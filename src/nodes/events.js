import { Lite } from "../litegraph.js";


// Show value inside the debug console
class LogEvent {

    static title = "Log Event";
    static desc = "Log event in console";

    constructor() {
        this.size = [60, 30];
        this.addInput("event", Lite.ACTION);
    }

    onAction(action, param) {
        console.log(action, param);
    }
}
Lite.registerNodeType("events/log", LogEvent);


// convert to Event if the value is true
class TriggerEvent {

    static title = "TriggerEvent";
    static desc = "Triggers event if input evaluates to true";

    constructor() {
        this.size = [60, 30];
        this.addInput("if", "");
        this.addOutput("true", Lite.EVENT);
        this.addOutput("change", Lite.EVENT);
        this.addOutput("false", Lite.EVENT);
        this.properties = {
            only_on_change: true,
            tooltip: "Triggers event if input evaluates to true",
        };
        this.prev = 0;
    }

    onExecute(param, options) {
        var v = this.getInputData(0);
        var changed = v != this.prev;
        if (this.prev === 0) changed = false;
        var must_resend =
            (changed && this.properties.only_on_change) ||
            (!changed && !this.properties.only_on_change);
        if (v && must_resend) this.triggerSlot(0, param, null, options);
        if (!v && must_resend) this.triggerSlot(2, param, null, options);
        if (changed) this.triggerSlot(1, param, null, options);
        this.prev = v;
    }
}


Lite.registerNodeType("events/trigger", TriggerEvent);

// Sequence of events
class Sequence {

    static title = "Sequence";
    static desc = "Triggers a sequence of events when an event arrives";
    // @ BUG: fails to construct Node

    constructor() {
        var that = this;
        this.addInput("", Lite.ACTION);
        this.addInput("", Lite.ACTION);
        this.addInput("", Lite.ACTION);
        this.addOutput("", Lite.EVENT);
        this.addOutput("", Lite.EVENT);
        this.addOutput("", Lite.EVENT);
        this.addWidget("button", "+", null, function () {
            that.addInput("", Lite.ACTION);
            that.addOutput("", Lite.EVENT);
        });
        this.size = [90, 70];
        this.flags = { horizontal: true, render_box: false };
    }

    getTitle() {
        return "";
    }

    onAction(action, param, options) {
        if (this.outputs) {
            options = options || {};
            for (var i = 0; i < this.outputs.length; ++i) {
                // needs more info about this...
                if (options.action_call)
                    // CREATE A NEW ID FOR THE ACTION
                    options.action_call = options.action_call + "_seq_" + i;
                else
                    options.action_call =
                        this.id +
                        "_" +
                        (action ? action : "action") +
                        "_seq_" +
                        i +
                        "_" +
                        Math.floor(Math.random() * 9999);
                this.triggerSlot(i, param, null, options);
            }
        }
    }
}
Lite.registerNodeType("events/sequence", Sequence);


// Sequence of events
class WaitAll {

    static title = "WaitAll";
    static desc = "Wait until all input events arrive then triggers output";

    constructor() {
        var that = this;
        this.addInput("", Lite.ACTION);
        this.addInput("", Lite.ACTION);
        this.addOutput("", Lite.EVENT);
        this.addWidget("button", "+", null, function () {
            that.addInput("", Lite.ACTION);
            that.size[0] = 90;
        });
        this.size = [90, 70];
        this.ready = [];
    }

    getTitle() {
        return "";
    }

    onDrawBackground(ctx) {
        if (this.flags.collapsed) {
            return;
        }
        for (var i = 0; i < this.inputs.length; ++i) {
            var y = i * Lite.NODE_SLOT_HEIGHT + 10;
            ctx.fillStyle = this.ready[i] ? "#AFB" : "#000";
            ctx.fillRect(20, y, 10, 10);
        }
    }

    onAction(action, param, options, slot_index) {
        if (slot_index == null) return;

        // check all
        this.ready.length = this.outputs.length;
        this.ready[slot_index] = true;
        for (var i = 0; i < this.ready.length; ++i)
            if (!this.ready[i])
                return;
        // pass
        this.reset();
        this.triggerSlot(0);
    }

    reset() {
        this.ready.length = 0;
    }
}
Lite.registerNodeType("events/waitAll", WaitAll);


// Sequencer for events
class Stepper {

    static title = "Stepper";
    static desc = "Trigger events sequentially when an tick arrives";

    constructor() {
        var that = this;
        this.properties = { index: 0 };
        this.addInput("index", "number");
        this.addInput("step", Lite.ACTION);
        this.addInput("reset", Lite.ACTION);
        this.addOutput("index", "number");
        this.addOutput("", Lite.EVENT);
        this.addOutput("", Lite.EVENT);
        this.addOutput("", Lite.EVENT, { removable: true });
        this.addWidget("button", "+", null, function () {
            that.addOutput("", Lite.EVENT, { removable: true });
        });
        this.size = [120, 120];
        this.flags = { render_box: false };
    }

    onDrawBackground(ctx) {
        if (this.flags.collapsed) {
            return;
        }
        var index = this.properties.index || 0;
        ctx.fillStyle = "#AFB";
        var w = this.size[0];
        var y = (index + 1) * Lite.NODE_SLOT_HEIGHT + 4;
        ctx.beginPath();
        ctx.moveTo(w - 30, y);
        ctx.lineTo(w - 30, y + Lite.NODE_SLOT_HEIGHT);
        ctx.lineTo(w - 15, y + Lite.NODE_SLOT_HEIGHT * 0.5);
        ctx.fill();
    }

    onExecute() {
        var index = this.getInputData(0);
        if (index != null) {
            index = Math.floor(index);
            index = Lite.clamp(
                index,
                0,
                this.outputs ? this.outputs.length - 2 : 0,
            );
            if (index != this.properties.index) {
                this.properties.index = index;
                this.triggerSlot(index + 1);
            }
        }

        this.setOutputData(0, this.properties.index);
    }

    onAction(action, param) {
        if (action == "reset") this.properties.index = 0;
        else if (action == "step") {
            this.triggerSlot(this.properties.index + 1, param);
            var n = this.outputs ? this.outputs.length - 1 : 0;
            this.properties.index = (this.properties.index + 1) % n;
        }
    }
}
Lite.registerNodeType("events/stepper", Stepper);

// Filter events
class FilterEvent {

    static title = "Filter Event";
    static desc = "Blocks events that do not match the filter";

    constructor() {
        this.size = [60, 30];
        this.addInput("event", Lite.ACTION);
        this.addOutput("event", Lite.EVENT);
        this.properties = {
            equal_to: "",
            has_property: "",
            property_equal_to: "",
        };
    }

    onAction(action, param, options) {
        if (param == null) {
            return;
        }

        if (this.properties.equal_to && this.properties.equal_to != param) {
            return;
        }

        if (this.properties.has_property) {
            var prop = param[this.properties.has_property];
            if (prop == null) {
                return;
            }

            if (
                this.properties.property_equal_to &&
                this.properties.property_equal_to != prop
            ) {
                return;
            }
        }

        this.triggerSlot(0, param, null, options);
    }
}
Lite.registerNodeType("events/filter", FilterEvent);

class EventBranch {

    static title = "Branch";
    static desc = "If condition is true, outputs triggers true, otherwise false";

    constructor() {
        this.addInput("in", Lite.ACTION);
        this.addInput("cond", "boolean");
        this.addOutput("true", Lite.EVENT);
        this.addOutput("false", Lite.EVENT);
        this.size = [120, 60];
        this._value = false;
    }

    onExecute() {
        this._value = this.getInputData(1);
    }

    onAction(action, param, options) {
        this._value = this.getInputData(1);
        this.triggerSlot(this._value ? 0 : 1, param, null, options);
    }
}
Lite.registerNodeType("events/branch", EventBranch);


// Show value inside the debug console
class EventCounter {

    static title = "Counter";
    static desc = "Counts events";

    constructor() {
        this.addInput("inc", Lite.ACTION);
        this.addInput("dec", Lite.ACTION);
        this.addInput("reset", Lite.ACTION);
        this.addOutput("change", Lite.EVENT);
        this.addOutput("num", "number");
        this.addProperty(
            "doCountExecution",
            false,
            "boolean",
            { name: "Count Executions" },
        );
        this.addWidget(
            "toggle",
            "Count Exec.",
            this.properties.doCountExecution,
            "doCountExecution",
        );
        this.num = 0;
    }

    getTitle() {
        if (this.flags.collapsed) {
            return String(this.num);
        }
        return this.title;
    }

    onAction(action) {
        var v = this.num;
        if (action == "inc") {
            this.num += 1;
        } else if (action == "dec") {
            this.num -= 1;
        } else if (action == "reset") {
            this.num = 0;
        }
        if (this.num != v) {
            this.trigger("change", this.num);
        }
    }

    onDrawBackground(ctx) {
        if (this.flags.collapsed) {
            return;
        }
        ctx.fillStyle = "#AAA";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.num, this.size[0] * 0.5, this.size[1] * 0.5);
    }

    onExecute() {
        if (this.properties.doCountExecution) {
            this.num += 1;
        }
        this.setOutputData(1, this.num);
    }
}
Lite.registerNodeType("events/counter", EventCounter);


// Show value inside the debug console
class DelayEvent {

    static title = "Delay";
    static desc = "Delays one event";

    constructor() {
        this.size = [60, 30];
        this.addProperty("time_in_ms", 1000);
        this.addInput("event", Lite.ACTION);
        this.addOutput("on_time", Lite.EVENT);
        this._pending = [];
    }

    onAction(action, param, options) {
        var time = this.properties.time_in_ms;
        if (time <= 0) {
            this.trigger(null, param, options);
        } else {
            this._pending.push([time, param]);
        }
    }

    onExecute(param, options) {
        var dt = this.graph.elapsed_time * 1000; // in ms

        if (this.isInputConnected(1)) {
            this.properties.time_in_ms = this.getInputData(1);
        }

        for (var i = 0; i < this._pending.length; ++i) {
            var actionPass = this._pending[i];
            actionPass[0] -= dt;
            if (actionPass[0] > 0) {
                continue;
            }

            // remove
            this._pending.splice(i, 1);
            --i;

            // trigger
            this.trigger(null, actionPass[1], options);
        }
    }

    onGetInputs() {
        return [
            ["event", Lite.ACTION],
            ["time_in_ms", "number"],
        ];
    }
}
Lite.registerNodeType("events/delay", DelayEvent);


// Show value inside the debug console
class TimerEvent {

    static title = "Timer";
    static desc = "Sends an event every N milliseconds";

    constructor() {
        this.addProperty("interval", 1000);
        this.addProperty("event", "tick");
        this.addOutput("on_tick", Lite.EVENT);
        this.time = 0;
        this.last_interval = 1000;
        this.triggered = false;
    }

    onStart() {
        this.time = 0;
    }

    getTitle() {
        return "Timer: " + this.last_interval.toString() + "ms";
    }

    onDrawBackground() {
        this.boxcolor = this.triggered ? TimerEvent.on_color : TimerEvent.off_color;
        this.triggered = false;
    }

    onExecute() {
        var dt = this.graph.elapsed_time * 1000; // in ms

        var trigger = this.time == 0;

        this.time += dt;
        this.last_interval = Math.max(1, this.getInputOrProperty("interval") | 0);

        if (
            !trigger &&
            (this.time < this.last_interval || isNaN(this.last_interval))
        ) {
            if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
                this.setOutputData(1, false);
            }
            return;
        }

        this.triggered = true;
        this.time = this.time % this.last_interval;
        this.trigger("on_tick", this.properties.event);
        if (this.inputs && this.inputs.length > 1 && this.inputs[1]) {
            this.setOutputData(1, true);
        }
    }

    onGetInputs() {
        return [["interval", "number"]];
    }

    onGetOutputs() {
        return [["tick", "boolean"]];
    }
}
TimerEvent.on_color = "#AAA";
TimerEvent.off_color = "#222";
Lite.registerNodeType("events/timer", TimerEvent);


class SemaphoreEvent {

    static title = "Semaphore Event";
    static desc = "Until both events are not triggered, it doesnt continue.";

    constructor() {
        this.addInput("go", Lite.ACTION);
        this.addInput("green", Lite.ACTION);
        this.addInput("red", Lite.ACTION);
        this.addOutput("continue", Lite.EVENT);
        this.addOutput("blocked", Lite.EVENT);
        this.addOutput("is_green", "boolean");
        this._ready = false;
        this.properties = {};
        var that = this;
        this.addWidget("button", "reset", "", function () {
            that._ready = false;
        });
    }

    onExecute() {
        this.setOutputData(1, this._ready);
        this.boxcolor = this._ready ? "#9F9" : "#FA5";
    }

    onAction(action) {
        if (action == "go") this.triggerSlot(this._ready ? 0 : 1);
        else if (action == "green") this._ready = true;
        else if (action == "red") this._ready = false;
    }
}
Lite.registerNodeType("events/semaphore", SemaphoreEvent);


class OnceEvent {

    static title = "Once";
    static desc = "Only passes an event once, then gets locked";

    constructor() {
        this.addInput("in", Lite.ACTION);
        this.addInput("reset", Lite.ACTION);
        this.addOutput("out", Lite.EVENT);
        this._once = false;
        this.properties = {};
        var that = this;
        this.addWidget("button", "reset", "", function () {
            that._once = false;
        });
    }

    onAction(action, param) {
        if (action == "in" && !this._once) {
            this._once = true;
            this.triggerSlot(0, param);
        } else if (action == "reset") this._once = false;
    }
}
Lite.registerNodeType("events/once", OnceEvent);


class DataStore {

    static title = "Data Store";
    static desc = "Stores data and only changes when event is received";

    constructor() {
        this.addInput("data", 0);
        this.addInput("assign", Lite.ACTION);
        this.addOutput("data", 0);
        this._last_value = null;
        this.properties = { data: null, serialize: true };
        var that = this;
        this.addWidget("button", "store", "", function () {
            that.properties.data = that._last_value;
        });
    }

    onExecute() {
        this._last_value = this.getInputData(0);
        this.setOutputData(0, this.properties.data);
    }

    onAction() {
        this.properties.data = this._last_value;
    }

    onSerialize(o) {
        if (o.data == null) return;
        if (
            !this.properties.serialize ||
            (o.data.constructor !== String &&
                o.data.constructor !== Number &&
                o.data.constructor !== Boolean &&
                o.data.constructor !== Array &&
                o.data.constructor !== Object)
        )
            o.data = null;
    }
}
Lite.registerNodeType("basic/data_store", DataStore);
