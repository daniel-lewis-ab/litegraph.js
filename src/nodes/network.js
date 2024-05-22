import { Lite } from "../litegraph.js";


class LGWebSocket {

    static title = "WebSocket";
    static desc = "Send data through a websocket";

    constructor() {
        this.size = [60, 20];
        this.addInput("send", Lite.ACTION);
        this.addOutput("received", Lite.EVENT);
        this.addInput("in", 0);
        this.addOutput("out", 0);
        this.properties = {
            url: "",
            room: "lgraph", // allows to filter messages,
            only_send_changes: true,
        };
        this._ws = null;
        this._last_sent_data = [];
        this._last_received_data = [];
    }

    onPropertyChanged(name, _value) {
        if (name == "url") {
            this.connectSocket();
        }
    }

    onExecute() {
        if (!this._ws && this.properties.url) {
            this.connectSocket();
        }

        if (!this._ws || this._ws.readyState != WebSocket.OPEN) {
            return;
        }

        var room = this.properties.room;
        var only_changes = this.properties.only_send_changes;

        for (let i = 1; i < this.inputs.length; ++i) {
            var data = this.getInputData(i);
            if (data == null) {
                continue;
            }
            var json;
            try {
                json = JSON.stringify({
                    type: 0,
                    room: room,
                    channel: i,
                    data: data,
                });
            } catch (err) {
                continue;
            }
            if (only_changes && this._last_sent_data[i] == json) {
                continue;
            }

            this._last_sent_data[i] = json;
            this._ws.send(json);
        }

        for (let i = 1; i < this.outputs.length; ++i) {
            this.setOutputData(i, this._last_received_data[i]);
        }

        if (this.boxcolor == "#AFA") {
            this.boxcolor = "#6C6";
        }
    }

    connectSocket() {
        var that = this;
        var url = this.properties.url;
        if (url.substr(0, 2) != "ws") {
            url = "ws://" + url;
        }
        this._ws = new WebSocket(url);
        this._ws.onopen = function () {
            console.log("ready");
            that.boxcolor = "#6C6";
        };
        this._ws.onmessage = function (e) {
            that.boxcolor = "#AFA";
            var data = JSON.parse(e.data);
            if (data.room && data.room != that.properties.room) {
                return;
            }
            if (data.type == 1) {
                if (data.data.object_class && Lite[data.data.object_class]) {
                    var obj = null;
                    try {
                        obj = new Lite[data.data.object_class](data.data);
                        that.triggerSlot(0, obj);
                    } catch (err) {
                        return;
                    }
                } else {
                    that.triggerSlot(0, data.data);
                }
            } else {
                that._last_received_data[data.channel || 0] = data.data;
            }
        };
        this._ws.onerror = function (_e) {
            console.log("couldnt connect to websocket");
            that.boxcolor = "#E88";
        };
        this._ws.onclose = function (_e) {
            console.log("connection closed");
            that.boxcolor = "#000";
        };
    }

    send(data) {
        if (!this._ws || this._ws.readyState != WebSocket.OPEN) {
            return;
        }
        this._ws.send(JSON.stringify({ type: 1, msg: data }));
    }

    onAction(action, param) {
        if (!this._ws || this._ws.readyState != WebSocket.OPEN) {
            return;
        }
        this._ws.send({
            type: 1,
            room: this.properties.room,
            action: action,
            data: param,
        });
    }

    onGetInputs() {
        return [["in", 0]];
    }

    onGetOutputs() {
        return [["out", 0]];
    }
}
Lite.registerNodeType("network/websocket", LGWebSocket);


// HTTP Request
class HTTPRequestNode {

    static title = "HTTP Request";
    static desc = "Fetch data through HTTP";

    constructor() {
        this.addInput("request", Lite.ACTION);
        this.addInput("url", "string");
        this.addProperty("url", "");
        this.addOutput("ready", Lite.EVENT);
        this.addOutput("data", "string");
        this.addWidget("button", "Fetch", null, this.fetch.bind(this));
        this._data = null;
        this._fetching = null;
    }

    fetch() {
        var url = this.getInputOrProperty("url");
        if (!url)
            return;

        this.boxcolor = "#FF0";
        var that = this;
        this._fetching = fetch(url)
            .then((resp) => {
                if (!resp.ok) {
                    this.boxcolor = "#F00";
                    that.trigger("error");
                } else {
                    this.boxcolor = "#0F0";
                    return resp.text();
                }
            })
            .then((data) => {
                that._data = data;
                that._fetching = null;
                that.trigger("ready");
            });
    }

    onAction(evt) {
        if (evt == "request")
            this.fetch();
    }

    onExecute() {
        this.setOutputData(1, this._data);
    }

    onGetOutputs() {
        return [["error", Lite.EVENT]];
    }
}
Lite.registerNodeType("network/httprequest", HTTPRequestNode);
