
import { Lite } from "../Lite.js";

// https://api.cdnjs.com/libraries

Lite.libraries_known = {
    // "jquery": {"obj":"jQuery","name":"jquery", "latest":"..URL.."}
};
Lite.libraries_loaded = {
    // "vue":{},
};



// CDN LIBRARY SEARCH

class CDNLibSearch {
    constructor() {
        var that = this;
        this.addInput("search", Lite.ACTION);
        // this.addInput("name", "string"); in optionals
        this.addProperty("name", "", "string");
        this.addOutput("ready", Lite.EVENT);
        this.addOutput("results", "array");
        this.addOutput("first name", "object");
        this.addOutput("first object", "object");
        // this.addOutput("error", Lite.EVENT); // in optionals
        this.addWidget("string", "name", this.properties.name, "name");
        // this.addWidget("button", "Fetch", null, this.fetch.bind(this));
        this._data = null;
        this._fetching = null;
        this.base_url = "https://api.cdnjs.com/libraries";
    }

    static title = "CDN Search";
    static desc = "Search and fetch CDN libraries";

    search() {
        var that = this;
        var url = this.base_url;
        var name = this.getInputOrProperty("name");
        if(name && name!=="") {
            url += "?search="+name;
        }
        this._fetching = fetch(url)
            .then((resp) => {
                if(!resp.ok) {
                    this.boxcolor = "#F00";
                    that.trigger("error");
                }else{
                    this.boxcolor = "#0F0";
                    return resp.text();
                }
            })
            .then((data) => {
                that._data = data;
                that._fetching = null;

                // var libsNames = [];
                // for(var iL in data.results){
                // libsNames.push(data.results[iL]["name"]);
                // }

                if(this._data && typeof(this._data)=="string") {
                    try{
                        this._data = JSON.parse(this._data);
                    }catch(e) {
                        console.warn("Not a JSON resp",this._data);
                    }
                }

                if(this._data && typeof(this._data)=="object") {
                    if(this._data.results && this._data.results.length && this._data.results[0]["name"]) {
                        this.setOutputData(1, this._data.results); // array of result libs
                        this.setOutputData(2, this._data.results[0]["name"]);
                        this.setOutputData(3, this._data.results[0]);
                    }else{
                    // no results?
                        this.setOutputData(2, null);
                        this.setOutputData(3, null);
                    }
                }else{
                    this.setOutputData(2, null);
                    this.setOutputData(3, null);
                }
                that.trigger("ready");
            });
    }

    onAction(evt) {
        if(evt == "search")
            this.search();
    }

    onExecute() {
        // this.setOutputData(1, this._data); // "data"
        // if(this._data && typeof(this._data)=="string"){
        //     try{
        //         this._data = JSON.parse(this._data);
        //     }catch(e){
        //         console.warn("Not a JSON resp",this._data);
        //     }
        // }
        // if(this._data && typeof(this._data)=="object"){
        //     if(this._data.results && this._data.results.length){
        //         this.setOutputData(2, this._data.results[0]);
        //     }
        // }else{
        //     this.setOutputData(2, null);
        // }
    }

    onGetInputs() {
        return [["name","string"]];
    }

    onGetOutputs() {
        return [["error",Lite.EVENT]];
    }
}
Lite.registerNodeType("libraries/search_CDN_lib", CDNLibSearch);


// CDN LIBRARY LOAD INCLUDE

class CDNLibInclude {

    static title = "CDN Load";
    static desc = "Load and include a CDN library";

    constructor() {
        var that = this;
        this.addInput("load", Lite.ACTION);
        this.addInput("lib_spec", "object");
        this.addOutput("ready", Lite.EVENT);
        this.addOutput("error", Lite.EVENT);
        // this.addOutput("error", Lite.EVENT); // in optionals
        // this.addWidget("button", "load", null, this.load.bind(this));
    }

    load() {
        var that = this;
        var lib_spec = this.getInputOrProperty("lib_spec");
        if(lib_spec && typeof(lib_spec)=="object" && lib_spec.latest) {
            var url = lib_spec.latest;

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.onload = function(a) {
                that.on_loaded(lib_spec, a);
            }
            script.onerror = function(e) {
                that.on_error(lib_spec, e);
            }
            script.src = url;
            document.head.appendChild(script);
            // wait for loas
        }
    }

    on_loaded(ob_lib, a) {
        console.debug("Loaded library",ob_lib,a);
        if(ob_lib && ob_lib.name) {
            this.trigger("ready");
            libraries_loaded[ob_lib.name] = ob_lib;
            this.boxcolor = "#0F0";
        }else{
            this.on_error(ob_lib);
        }
    }

    on_error(ob_lib, e) {
        this.trigger("error");
        this.boxcolor = "#F00";
        console.warn("Lib loading failed",ob_lib,e);
    }

    onAction(evt) {
        if(evt == "load") {
            this.load();
        }
    }

    onExecute() {
        // ?
    }

    onGetInputs() {
        // return [["name","string"]];
    }
    onGetOutputs() {
        // return [["error",Lite.EVENT]];
    }
}
Lite.registerNodeType("libraries/load", CDNLibInclude);
