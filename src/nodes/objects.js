import { Lite } from "../Lite.js";

// EG METHOD

// function mMETHOD(){
//     this.properties = { };
//     // this.addInput("onTrigger", Lite.ACTION);
//     // this.addInput("condition", "boolean");
//     // this.addOutput("true", Lite.EVENT);
//     // this.addOutput("false", Lite.EVENT);
//     this.mode = Lite.ON_TRIGGER;
// }
// mMETHOD.title = "Branch";
// mMETHOD.desc = "Branch execution on condition";
// mMETHOD.prototype.onExecute = function(param, options) {
//     // this.triggerSlot(0);
// };
// mMETHOD.prototype.onAction = function(action, param, options){
// };
// mMETHOD.prototype.onGetInputs = function() {
//     //return [["optional slot in", 0]];
// };
// mMETHOD.prototype.onGetOutputs = function() {
//     //return [["optional slot out", 0]];
// };
// Lite.registerNodeType("basic/egnode", mMETHOD);

// --------------------------

class objProperties {

    static title = "OBJ props";
    static desc = "Properties for objects";

    constructor() {

        this.addInput("obj", "object");
        // this.addInput("condition", "boolean");

        this.addOutput("properties", "array");
        // this.addOutput("false", Lite.EVENT);

        // this.mode = Lite.ON_TRIGGER;
        // this.widget = this.addWidget("text","prop.","",this.setValue.bind(this) );
        // this.widgets_up = true;
        // this.size = [140, 30];
        this._value = null;
        this._properties = [];
    }

    onExecute(param, options) {
        var data = this.getInputData(0);
        if (data != null) {
            this._value = data;
            try{
                this._properties = Object.keys(this._value);
            }catch(e) {
            }
            this.setOutputData(0, this._properties);
        }
    }
    onAction(action, param, options) {
        // should probably execute on action
    }
    onGetInputs() {
        // return [["in", 0]];
    }
    onGetOutputs() {
        // return [["out", 0]];
    }
    getTitle() {
        if (this.flags.collapsed) {
        }
        return this.title;
    }
    onPropertyChanged(name, value) {
        // this.widget.value = value;
    }
}
Lite.registerNodeType("objects/properties", objProperties);

// --------------------------

// node events
/*
onWidgetChanged
*/


// widgets
/*

this.widg_prop = this.addWidget("property","prop.","",this.setValue.bind(this) );
this.widg_prop = this.addWidget("combo","prop.",this.properties.prop,{ property: "prop", values: [] }); //,this.setValue.bind(this) );

// to put it before inputs
this.widgets_up = true;

// remove or update does not exists :: should save index to do it :: this.removeWidget();
// to clear
this.widgets = [];
// readd if needed
this.widg_prop = this.addWidget();

// can specify draw function
obWidget.draw = function(ctx, node, widget_width, y, H){

}
// can override Y placement
obWidget.computeSize = function(width){
    return Y;
}

obWidget.mouse = function(){
    return b_isDirtyCanvas; // can specify if canvas should get dirty
}

obWidget.callback = function(value, canvas, node, pos, event){

}

*/

// --------------------------


class objPropertyWidget {

    static title = "Obj Prop widget";
    static desc = "Choose a property for an object";

    constructor() {

        this.addInput("obj", "object");
        // this.addInput("condition", "boolean");

        this.addOutput("value", "*");
        // this.addOutput("false", Lite.EVENT);

        this.addProperty("prop", 0);

        // this.mode = Lite.ON_REQUEST; // to be optimized, could run always
        // this.widg_prop = this.addWidget("property","prop.","",this.setValue.bind(this) );
        this.widg_prop = this.addWidget("combo","prop.",this.properties.prop,{ property: "prop", values: [] }); // ,this.setValue.bind(this) );
        // this.widgets_up = true;
        // this.size = [140, 30];

        this._obin = null;
        this._value = null;
        this._properties = [];
    }

    setValue(v) {
        this.properties.prop = v;
        this.widg_prop.value = v;
    }

    updateFromInput(v) {
        var data = this.getInputData(0);
        if (data != null) {
            this._obin = data;
            if(this._obin) { // } && typeof this._obin == "Object"){
                // TODO should detect change or rebuild use a widget/action to refresh properties list
                try{
                    this._properties = Object.keys(this._obin);
                    if(this._properties && this._properties.sort) this._properties = this._properties.sort();
                }catch(e) {
                }
                if(this._properties) {
                    // this.removeWidget();
                    this.widgets = [];
                    this.widg_prop = this.addWidget("combo","prop",this.properties.prop,{ property: "prop", values: this._properties });
                }
                if(typeof this._obin[this.properties.prop] !== "undefined") {
                    this._value = this._obin[this.properties.prop];
                }else{
                    this._value = null;
                }
            }else{
                this._value = null;
                this._properties = [];
            }
        }
        if(!this.widg_prop.options) this.widg_prop.options = {};
        this.widg_prop.options.values = this._properties;
        this.setOutputData(0, this._value);
    }

    onExecute(param, options) {
        this.updateFromInput();
    }

    onAction(action, param, options) {
        // should probably execute on action
        this.updateFromInput();
    }

    onGetInputs() {
        // return [["in", 0]];
    }

    onGetOutputs() {
        // return [["out", 0]];
    }

    getTitle() {
        if (this.flags.collapsed) {
            return this.properties.prop;
        }
        return this.title;
    }

    onPropertyChanged(name, value) {
        if(name == "value") {
            this.widg_prop.value = value;
        }
    }

    getExtraMenuOptions(canvas, options) {
        return [{
            content: "Console DBG", // has_submenu: false,
            callback: function(menuitO,obX,ev,htmO,nodeX) {
                console.debug(nodeX.widg_prop);
                console.debug(nodeX);
            },
        }];
    }
}
Lite.registerNodeType("objects/property_widget", objPropertyWidget);


class objMethodWidget {

    static title = "Obj Method widget";
    static desc = "Choose and execute a method from an object";

    constructor() {
        this.addInput("obj", "object");
        // this.addInput("onTrigger", Lite.ACTION);
        this.addInput("refresh", Lite.ACTION);
        this.addInput("execute", Lite.ACTION);
        this.addOutput("executed", Lite.EVENT);
        this.addOutput("method", "function");
        this.addOutput("return", "*");
        this.addProperty("method", null);
        // this.mode = Lite.ON_REQUEST; // to be optimized, could run always
        this.widg_prop = this.addWidget("combo","method",this.properties.method,{ property: "method", values: [] }); // ,this.setValue.bind(this) );
        this._obin = null;
        this._function = null;
        this._methods = [];
    }

    setValue(v) {
        this.properties.method = v;
        this.widg_prop.value = v;
    }

    updateFromInput(v) {
        var data = this.getInputData(0);
        if (data != null) {
            this._obin = data;
            if(this._obin) { // } && typeof this._obin == "Object"){
                // TODO should detect change or rebuild use a widget/action to refresh properties list
                try{
                    this._methods = [];
                    var allProps = Object.keys(this._obin);
                    console.debug("Props",allProps);
                    for(var iM in allProps) {
                        // console.debug("dbg prop",allProps[iM],typeof(this._obin[allProps[iM]]));
                        if(typeof(this._obin[allProps[iM]]) == "function") {
                            this._methods.push(allProps[iM]);
                        }
                    }
                    if(this._methods && this._methods.sort) this._methods = this._methods.sort();
                }catch(e) {
                    console.warn("Err on methods get",e);
                }
                if(this._methods) {
                    // this.removeWidget();
                    this.widgets = [];
                    this.widg_prop = this.addWidget("combo","method",this.properties.method,{ property: "method", values: this._methods });
                }

            }else{
                console.debug("Invalid obj",data);
                this._function = null;
                this._methods = [];
            }
        }
        if(!this.widg_prop.options) this.widg_prop.options = {}; // reset widget options
        this.widg_prop.options.values = this._methods; // set widget options

        this.updateInputsForMethod();
    }

    updateInputsForMethod() {
        // TODO fixthis :: property is not yet updated?
        var actVal = this.widg_prop.value; // this.properties.method
        if(actVal && this._obin && typeof this._obin[actVal] !== "undefined") {

            // if changed, reset inputs
            // if(this._function !== this._obin[actVal]){
            //     for (var i = 3; i < this.inputs; ++i) {
            //         this.removeSlot(i);
            //     }
            // }

            this._function = this._obin[actVal];

            var params = Array(this._function.length);
            var names = Lite.getParameterNames(this._function);
            for (var i = 0; i < names.length; ++i) {
                var exs = this.findInputSlot(names[i]);
                if(exs == -1) {
                    this.addInput(names[i],"",{auto: true, removable: false, nameLocked: true});
                }
            }
            this._params = names;

        }else{
            console.debug("Invalid method",actVal);
            this._function = null;
        }
        this.setOutputData(1, this._function); // update function output
    }

    onExecute(param, options) {
        // this.updateFromInput();
        // ?
    }

    // objMethodWidget.prototype.onPropertyChanged = function(name, value, prev_value){
    //     console.debug("Property changed", name, value, prev_value)
    //     this.updateInputsForMethod();
    // }

    onWidgetChanged(name, value, prev_value, widget) {
        console.debug("Widget changed", name, value, prev_value);
        // if changed, reset inputs
        if(this.properties.method !== value) {
            for (var i = 3; i < this.inputs.length; ++i) {
                this.removeInput(i);
            }
        }
        this.updateInputsForMethod();
    }

    onAction(action, param, options) {
        // should probably execute on action
        // this.updateFromInput();
        if(action == "refresh") {
            this.updateFromInput();
        }else if(action == "execute") {
            if(this._function && typeof(this._function) == "function") {

                var parValues = [];
                for (var i = 3; i < this.inputs.length; i++) {
                    parValues.push(this.getInputData(i));
                }

                // call execute
                console.debug("NodeObjMethod Execute",parValues);
                var r = this._function(parValues); // this._function.apply(this, parValues);

                this.triggerSlot(0);
                this.setOutputData(2, r); // update method result
            }else{
                this.setOutputData(1, null);
                this.setOutputData(2, null);
            }
        }
    }

    onGetInputs() {
        // return [["in", 0]];
    }

    onGetOutputs() {
        // return [["out", 0]];
    }

    getTitle() {
        if (this.flags.collapsed) {
            return this.properties.method;
        }
        return this.title;
    }

    onPropertyChanged(name, value) {
        if(name == "value") {
            this.widg_prop.value = value;
        }
    }

    getExtraMenuOptions(canvas, options) {
        return [{
            content: "NodeObjMethod DBG", // has_submenu: false,
            callback: function(menuitO,obX,ev,htmO,nodeX) {
                console.debug(NodeObjMethod, nodeX.widg_prop, nodeX);
            },
        }];
    }
}
Lite.registerNodeType("objects/method_widget", objMethodWidget);


// eval a Global object
class objEvalGlo {

    static title = "Eval Obj";
    static desc = "Evaluate an object";

    constructor() {
        this.size = [60, 30];
        this.addProperty("obj_eval", "window");
        this.addOutput("obj", "object");
        this._func = null;
        this.data = {};
    }

    // SINGLE object EVAL
    onConfigure(o) {
        if (o.properties.obj_eval && Lite.allow_scripts)
            this.compileCode(o.properties.obj_eval);
        else
            console.warn("Obj string not evaluated, Lite.allow_scripts is false");
    }

    static widgets_info = {obj_eval: { type: "code" }};

    onPropertyChanged(name, value) {
        if (name == "obj_eval" && Lite.allow_scripts)
            this.compileCode(value);
        else
            console.warn("Obj string not evaluated, Lite.allow_scripts is false");
    }

    compileCode(code) {
        this._func = null;
        if (code.length > 256) {
            console.warn("Script too long, max 256 chars");
        } else {
            var code_eval = "return "+code;
            // var forbidden_words = [
            //     "script",
            //     "body",
            //     "document",
            //     "eval",
            //     "objEvalGlo",
            //     "function"
            // ]; //bad security solution
            // for (var i = 0; i < forbidden_words.length; ++i) {
            //     if (code_low.indexOf(forbidden_words[i]) != -1) {
            //         console.warn("invalid script");
            //         return;
            //     }
            // }
            try {
                this._func = new Function("DATA", "node", code_eval);
            } catch (err) {
                console.error("Error parsing obj evaluation");
                console.error(err);
            }
        }
    }

    onExecute() {
        if (!this._func) {
            return;
        }
        try {
            this.setOutputData(0, this._func(this.data, this));
        } catch (err) {
            console.error("Error in code eval");
            console.error(err);
        }
    }

    // objEvalGlo.prototype.onGetOutputs = function() {
    //     return [["C", ""]];
    // };
}
Lite.registerNodeType("objects/evaluate", objEvalGlo);
