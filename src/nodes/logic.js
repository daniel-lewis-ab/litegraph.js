import { Lite } from "../Lite.js";

class Selector {

    static title = "Selector";
    static desc = "selects an output";

    constructor() {
        this.addInput("sel", "number");
        this.addInput("A");
        this.addInput("B");
        this.addInput("C");
        this.addInput("D");
        this.addOutput("out");

        this.selected = 0;
    }

    onDrawBackground(ctx) {
        if (this.flags.collapsed) {
            return;
        }
        ctx.fillStyle = "#AFB";
        var y = (this.selected + 1) * Lite.NODE_SLOT_HEIGHT + 6;
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(50, y + Lite.NODE_SLOT_HEIGHT);
        ctx.lineTo(34, y + Lite.NODE_SLOT_HEIGHT * 0.5);
        ctx.fill();
    }

    onExecute() {
        var sel = this.getInputData(0);
        if (sel == null || sel.constructor !== Number) sel = 0;
        this.selected = sel = Math.round(sel) % (this.inputs.length - 1);
        var v = this.getInputData(sel + 1);
        if (v !== undefined) {
            this.setOutputData(0, v);
        }
    }

    onGetInputs() {
        return [
            ["E", 0],
            ["F", 0],
            ["G", 0],
            ["H", 0],
        ];
    }
}
Lite.registerNodeType("logic/selector", Selector);


class Sequence {

    static title = "Sequence";
    static desc = "select one element from a sequence from a string";

    constructor() {
        this.properties = {sequence: "A,B,C"};
        this.addInput("index", "number");
        this.addInput("seq");
        this.addOutput("out");

        this.index = 0;
        this.values = this.properties.sequence.split(",");
    }

    onPropertyChanged(name, value) {
        if (name == "sequence") {
            this.values = value.split(",");
        }
    }

    onExecute() {
        var seq = this.getInputData(1);
        if (seq && seq != this.current_sequence) {
            this.values = seq.split(",");
            this.current_sequence = seq;
        }
        var index = this.getInputData(0);
        if (index == null) {
            index = 0;
        }
        this.index = index = Math.round(index) % this.values.length;

        this.setOutputData(0, this.values[index]);
    }
}
Lite.registerNodeType("logic/sequence", Sequence);


class logicAnd {

    static title = "AND";
    static desc = "Return true if all inputs are true";

    constructor() {
        this.properties = {};
        this.addInput("a", "boolean");
        this.addInput("b", "boolean");
        this.addOutput("out", "boolean");
    }

    onExecute() {
        let ret = true;
        for (let inX in this.inputs) {
            if (!this.getInputData(inX)) {
                ret = false;
                break;
            }
        }
        this.setOutputData(0, ret);
    }

    onGetInputs() {
        return [["and", "boolean"]];
    }
}
Lite.registerNodeType("logic/AND", logicAnd);


class logicOr {

    static title = "OR";
    static desc = "Return true if at least one input is true";

    constructor() {
        this.properties = {};
        this.addInput("a", "boolean");
        this.addInput("b", "boolean");
        this.addOutput("out", "boolean");
    }

    onExecute() {
        var ret = false;
        for (var inX in this.inputs) {
            if (this.getInputData(inX)) {
                ret = true;
                break;
            }
        }
        this.setOutputData(0, ret);
    }

    onGetInputs() {
        return [["or", "boolean"]];
    }
}
Lite.registerNodeType("logic/OR", logicOr);


class logicNot {
    static title = "NOT";
    static desc = "Return the logical negation";
    constructor() {
        this.properties = {};
        this.addInput("in", "boolean");
        this.addOutput("out", "boolean");
    }

    onExecute() {
        var ret = !this.getInputData(0);
        this.setOutputData(0, ret);
    }
}
Lite.registerNodeType("logic/NOT", logicNot);


class logicCompare {

    static title = "bool == bool";
    static desc = "Compare for logical equality";

    constructor() {
        this.properties = {};
        this.addInput("a", "boolean");
        this.addInput("b", "boolean");
        this.addOutput("out", "boolean");
    }

    onExecute() {
        var last = null;
        var ret = true;
        for (var inX in this.inputs) {
            if (last === null) last = this.getInputData(inX);
            else if (last != this.getInputData(inX)) {
                ret = false;
                break;
            }
        }
        this.setOutputData(0, ret);
    }

    onGetInputs() {
        return [["bool", "boolean"]];
    }
}
Lite.registerNodeType("logic/CompareBool", logicCompare);


class logicBranch {

    static title = "Branch";
    static desc = "Branch execution on condition";
    // @BUG: Seems to always execute false branch

    constructor() {
        this.properties = {};
        this.addInput("onTrigger", Lite.ACTION);
        this.addInput("condition", "boolean");
        this.addOutput("true", Lite.EVENT);
        this.addOutput("false", Lite.EVENT);
        this.mode = Lite.ON_TRIGGER;
    }

    onExecute(_param, _options) {
        var condtition = this.getInputData(1);
        if (condtition) {
            this.triggerSlot(0);
        } else {
            this.triggerSlot(1);
        }
    }
}
Lite.registerNodeType("logic/IF", logicBranch);


class logicFor {
    constructor() {
        this.properties = { };
        this.addInput("start", "number");
        this.addInput("nElements", "number");
        this.addInput("do", Lite.ACTION);
        this.addInput("break", Lite.ACTION);
        // this.addInput("reset", Lite.ACTION);
        this.addOutput("do", Lite.EVENT);
        this.addOutput("index", "number");
        this.started = false;
        this.stopped = false;
    }

    static title = "FOR";
    static desc = "Cycle FOR";

    onExecute(param) {
        if (!this.started) return;
        var iI = this.getInputData(0);
        var num = this.getInputData(1);
        for (var k=iI;k<iI+num;k++) {
            console.debug("for cycle "+k);
            this.triggerSlot(0, param);
            if (this.stopped) {
                console.debug("for cycle stopped on index "+k);
                break;
            }
            this.setOutputData(1, k);
        }
        this.started = false;
        this.stopped = true;
    }

    onAction(action, param) {
        /* console.debug(action);
        console.debug(param);
        console.debug(this);*/
        switch(action) {
            case "break":
                this.stopped = true;
                break;
            /* case "reset":
                this.stopped = false;
            break;*/
            case "do":
                this.started = true;
                this.stopped = false;
                this.execute();
                break;
        }
    }
}
Lite.registerNodeType("logic/CycleFOR", logicFor);


class logicWhile {
    constructor() {
        this.properties = { cycleLimit: 999, checkOnStart: true };
        this.addInput("do", Lite.ACTION);
        this.addInput("condition", "boolean");
        this.addInput("break", Lite.ACTION);
        this.addOutput("do", Lite.EVENT);
        this.addOutput("index", "number");
        this.started = false;
        this.stopped = false;
        this.k = 0;
        this.cond = false;
        this.addWidget("toggle","checkOnStart",this.properties.checkOnStart,"checkOnStart");
    }

    static title = "WHILE";
    static desc = "Cycle WHILE";

    onExecute(param) {
        this.setOutputData(1, this.k);
        this.cond = this.getInputData(1);
    }
    onAction(action, param) {
        switch(action) {
            case "break":
                this.stopped = true;
                break;
            case "do":
                /* this.started = true;
                this.stopped = false;
                this.execute();*/
                this.started = true;
                this.stopped = false;
                var checkOnStart = this.getInputOrProperty("checkOnStart");
                this.cond = !checkOnStart || this.getInputData(1);
                this.k = 0;
                cycleLimit = this.properties.cycleLimit || 999;
                while (this.cond && this.k<cycleLimit) {
                    console.debug("while cycle "+this.k);
                    this.setOutputData(1, this.k);
                    this.triggerSlot(0, param);
                    // done
                    if (this.stopped) {
                        console.debug("while cycle stopped on index "+k);
                        break;
                    }
                    this.k++;
                    this.cond = this.getInputData(1,true,true);
                }
                this.k = 0;
                this.setOutputData(1, this.k);
                this.cond = this.getInputData(1);
                this.started = false;
                this.stopped = true;
                break;
        }
    }
}
Lite.registerNodeType("logic/CycleWHILE", logicWhile);
