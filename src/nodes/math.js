import { Lite } from "../litegraph.js";

// Converter
class Converter {

    static title = "Converter";
    static desc = "type A to type B";

    constructor() {
        this.addInput("in", 0);
        this.addOutput("out", 0);
        this.size = [80, 30];
    }

    onExecute() {
        var v = this.getInputData(0);
        if (v == null) {
            return;
        }

        if (this.outputs) {
            for (var i = 0; i < this.outputs.length; i++) {
                var output = this.outputs[i];
                if (!output.links || !output.links.length) {
                    continue;
                }

                var result = null;
                switch (output.name) {
                    case "number":
                        result = v.length ? v[0] : parseFloat(v);
                        break;
                    case "vec2":
                    case "vec3":
                    case "vec4":
                        result = null;
                        var count = 1;
                        switch (output.name) {
                            case "vec2":
                                count = 2;
                                break;
                            case "vec3":
                                count = 3;
                                break;
                            case "vec4":
                                count = 4;
                                break;
                        }

                        result = new Float32Array(count);
                        if (v.length) {
                            for (
                                var j = 0;
                                j < v.length && j < result.length;
                                j++
                            ) {
                                result[j] = v[j];
                            }
                        } else {
                            result[0] = parseFloat(v);
                        }
                        break;
                }
                this.setOutputData(i, result);
            }
        }
    }

    onGetOutputs() {
        return [
            ["number", "number"],
            ["vec2", "vec2"],
            ["vec3", "vec3"],
            ["vec4", "vec4"],
        ];
    }
}
Lite.registerNodeType("math/converter", Converter);


// Bypass
class Bypass {

    static title = "Bypass";
    static desc = "removes the type";

    constructor() {
        this.addInput("in");
        this.addOutput("out");
        this.size = [80, 30];
    }

    onExecute() {
        var v = this.getInputData(0);
        this.setOutputData(0, v);
    }
}
Lite.registerNodeType("math/bypass", Bypass);


class ToNumber {

    static title = "to Number";
    static desc = "Cast to number";

    constructor() {
        this.addInput("in");
        this.addOutput("out");
    }

    onExecute() {
        var v = this.getInputData(0);
        this.setOutputData(0, Number(v));
    }
}
Lite.registerNodeType("math/to_number", ToNumber);


class MathRange {

    static title = "Range";
    static desc = "Convert a number from one range to another";

    constructor() {
        this.addInput("in", "number", { locked: true });
        this.addOutput("out", "number", { locked: true });
        this.addOutput("clamped", "number", { locked: true });

        this.addProperty("in", 0);
        this.addProperty("in_min", 0);
        this.addProperty("in_max", 1);
        this.addProperty("out_min", 0);
        this.addProperty("out_max", 1);

        this.size = [120, 50];
    }

    getTitle() {
        if (this.flags.collapsed) {
            return (this._last_v || 0).toFixed(2);
        }
        return this.title;
    }

    onExecute() {
        let v;
        if (this.inputs) {
            for (let i = 0; i < this.inputs.length; i++) {
                let input = this.inputs[i];
                v = this.getInputData(i);
                if (v === undefined) {
                    continue;
                }
                this.properties[input.name] = v;
            }
        }

        v = this.properties["in"];
        if (v === undefined || v === null || v.constructor !== Number) {
            v = 0;
        }

        var in_min = this.properties.in_min;
        var in_max = this.properties.in_max;
        var out_min = this.properties.out_min;
        var out_max = this.properties.out_max;
        /*
        if( in_min > in_max )
        {
            in_min = in_max;
            in_max = this.properties.in_min;
        }
        if( out_min > out_max )
        {
            out_min = out_max;
            out_max = this.properties.out_min;
        }
        */

        this._last_v =
            ((v - in_min) / (in_max - in_min)) * (out_max - out_min) + out_min;
        this.setOutputData(0, this._last_v);
        this.setOutputData(1, Lite.clamp(this._last_v, out_min, out_max));
    }

    onDrawBackground(_ctx) {
        // show the current value
        if (this._last_v) {
            this.outputs[0].label = this._last_v.toFixed(3);
        } else {
            this.outputs[0].label = "?";
        }
    }

    onGetInputs() {
        return [
            ["in_min", "number"],
            ["in_max", "number"],
            ["out_min", "number"],
            ["out_max", "number"],
        ];
    }
}
Lite.registerNodeType("math/range", MathRange);


class MathRand {

    static title = "Rand";
    static desc = "Random number";

    constructor() {
        this.addOutput("value", "number");
        this.addProperty("min", 0);
        this.addProperty("max", 1);
        this.size = [80, 30];
    }

    onExecute() {
        if (this.inputs) {
            for (var i = 0; i < this.inputs.length; i++) {
                var input = this.inputs[i];
                var v = this.getInputData(i);
                if (v === undefined) {
                    continue;
                }
                this.properties[input.name] = v;
            }
        }

        var min = this.properties.min;
        var max = this.properties.max;
        this._last_v = Math.random() * (max - min) + min;
        this.setOutputData(0, this._last_v);
    }

    onDrawBackground(_ctx) {
        // show the current value
        this.outputs[0].label = (this._last_v || 0).toFixed(3);
    }

    onGetInputs() {
        return [
            ["min", "number"],
            ["max", "number"],
        ];
    }
}
Lite.registerNodeType("math/rand", MathRand);


// basic continuous noise
class MathNoise {

    static title = "Noise";
    static desc = "Random number with temporal continuity";

    constructor() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.addProperty("min", 0);
        this.addProperty("max", 1);
        this.addProperty("smooth", true);
        this.addProperty("seed", 0);
        this.addProperty("octaves", 1);
        this.addProperty("persistence", 0.8);
        this.addProperty("speed", 1);
        this.size = [90, 30];
    }

    static getValue(f, smooth) {
        if (!MathNoise.data) {
            MathNoise.data = new Float32Array(1024);
            for (var i = 0; i < MathNoise.data.length; ++i) {
                MathNoise.data[i] = Math.random();
            }
        }
        f = f % 1024;
        if (f < 0) {
            f += 1024;
        }
        var f_min = Math.floor(f);
        f -= f_min;
        var r1 = MathNoise.data[f_min];
        var r2 = MathNoise.data[f_min == 1023 ? 0 : f_min + 1];
        if (smooth) {
            f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
        }
        return r1 * (1 - f) + r2 * f;
    }

    onExecute() {
        var f = this.getInputData(0) || 0;
        var iterations = this.properties.octaves || 1;
        var r = 0;
        var amp = 1;
        var seed = this.properties.seed || 0;
        f += seed;
        var speed = this.properties.speed || 1;
        var total_amp = 0;
        for (var i = 0; i < iterations; ++i) {
            r +=
                MathNoise.getValue(f * (1 + i) * speed, this.properties.smooth) *
                amp;
            total_amp += amp;
            amp *= this.properties.persistence;
            if (amp < 0.001) break;
        }
        r /= total_amp;
        var min = this.properties.min;
        var max = this.properties.max;
        this._last_v = r * (max - min) + min;
        this.setOutputData(0, this._last_v);
    }

    onDrawBackground(_ctx) {
        // show the current value
        this.outputs[0].label = (this._last_v || 0).toFixed(3);
    }

    static data = null;
}
Lite.registerNodeType("math/noise", MathNoise);


// generates spikes every random time
class MathSpikes {
    constructor() {
        this.addOutput("out", "number");
        this.addProperty("min_time", 1);
        this.addProperty("max_time", 2);
        this.addProperty("duration", 0.2);
        this.size = [90, 30];
        this._remaining_time = 0;
        this._blink_time = 0;
    }

    onExecute() {
        var dt = this.graph.elapsed_time; // in secs

        this._remaining_time -= dt;
        this._blink_time -= dt;

        var v = 0;
        if (this._blink_time > 0) {
            var f = this._blink_time / this.properties.duration;
            v = 1 / (Math.pow(f * 8 - 4, 4) + 1);
        }

        if (this._remaining_time < 0) {
            this._remaining_time =
                Math.random() *
                    (this.properties.max_time - this.properties.min_time) +
                this.properties.min_time;
            this._blink_time = this.properties.duration;
            this.boxcolor = "#FFF";
        } else {
            this.boxcolor = "#000";
        }
        this.setOutputData(0, v);
    }
}
Lite.registerNodeType("math/spikes", MathSpikes);


// Math clamp
class MathClamp {

    static title = "Clamp";
    static desc = "Clamp number between min and max";

    constructor() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.size = [80, 30];
        this.addProperty("min", 0);
        this.addProperty("max", 1);
    }

    // MathClamp.filter = "shader";

    onExecute() {
        var v = this.getInputData(0);
        if (v == null) {
            return;
        }
        v = Math.max(this.properties.min, v);
        v = Math.min(this.properties.max, v);
        this.setOutputData(0, v);
    }

    getCode() {
        var code = "";
        if (this.isInputConnected(0)) {
            code +=
                "clamp({{0}}," +
                this.properties.min +
                "," +
                this.properties.max +
                ")";
        }
        return code;
    }
}
Lite.registerNodeType("math/clamp", MathClamp);


class MathLerp {

    static title = "Lerp";
    static desc = "Linear Interpolation";

    constructor() {
        this.properties = { f: 0.5 };
        this.addInput("A", "number");
        this.addInput("B", "number");

        this.addOutput("out", "number");
    }

    onExecute() {
        var v1 = this.getInputData(0);
        if (v1 == null) {
            v1 = 0;
        }
        var v2 = this.getInputData(1);
        if (v2 == null) {
            v2 = 0;
        }

        var f = this.properties.f;

        var _f = this.getInputData(2);
        if (_f !== undefined) {
            f = _f;
        }

        this.setOutputData(0, v1 * (1 - f) + v2 * f);
    }

    onGetInputs() {
        return [["f", "number"]];
    }
}
Lite.registerNodeType("math/lerp", MathLerp);


class MathAbs {

    static title = "Abs";
    static desc = "Absolute";

    constructor() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.size = [80, 30];
    }

    onExecute() {
        var v = this.getInputData(0);
        if (v == null) {
            return;
        }
        this.setOutputData(0, Math.abs(v));
    }
}
Lite.registerNodeType("math/abs", MathAbs);


class MathFloor {

    static title = "Floor";
    static desc = "Floor number to remove fractional part";

    constructor() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.size = [80, 30];
    }

    onExecute() {
        var v = this.getInputData(0);
        if (v == null) {
            return;
        }
        this.setOutputData(0, Math.floor(v));
    }
}
Lite.registerNodeType("math/floor", MathFloor);


// Math frac
class MathFrac {

    static title = "Frac";
    static desc = "Returns fractional part";

    constructor() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.size = [80, 30];
    }

    onExecute() {
        var v = this.getInputData(0);
        if (v == null) {
            return;
        }
        this.setOutputData(0, v % 1);
    }
}
Lite.registerNodeType("math/frac", MathFrac);


class MathSmoothStep {

    static title = "Smoothstep";
    static desc = "Smoothstep";

    constructor() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.size = [80, 30];
        this.properties = { A: 0, B: 1 };
    }

    onExecute() {
        var v = this.getInputData(0);
        if (v === undefined) {
            return;
        }

        var edge0 = this.properties.A;
        var edge1 = this.properties.B;

        // Scale, bias and saturate x to 0..1 range
        v = Lite.clamp((v - edge0) / (edge1 - edge0), 0.0, 1.0);
        // Evaluate polynomial
        v = v * v * (3 - 2 * v);

        this.setOutputData(0, v);
    }
}
Lite.registerNodeType("math/smoothstep", MathSmoothStep);


class MathScale {

    static title = "Scale";
    static desc = "v * factor";

    constructor() {
        this.addInput("in", "number", { label: "" });
        this.addOutput("out", "number", { label: "" });
        this.size = [80, 30];
        this.addProperty("factor", 1);
    }

    onExecute() {
        var value = this.getInputData(0);
        if (value != null) {
            this.setOutputData(0, value * this.properties.factor);
        }
    }
}
Lite.registerNodeType("math/scale", MathScale);


class Gate {

    static title = "Gate";
    static desc = "if v is true, then outputs A, otherwise B";

    constructor() {
        this.addInput("v", "boolean");
        this.addInput("A");
        this.addInput("B");
        this.addOutput("out");
    }

    onExecute() {
        var v = this.getInputData(0);
        this.setOutputData(0, this.getInputData(v ? 1 : 2));
    }
}
Lite.registerNodeType("math/gate", Gate);


class MathAverageFilter {

    static title = "Average";
    static desc = "Average Filter";

    constructor() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.size = [80, 30];
        this.addProperty("samples", 10);
        this._values = new Float32Array(10);
        this._current = 0;
    }

    onExecute() {
        var v = this.getInputData(0);
        if (v == null) {
            v = 0;
        }

        var num_samples = this._values.length;

        this._values[this._current % num_samples] = v;
        this._current += 1;
        if (this._current > num_samples) {
            this._current = 0;
        }

        var avr = 0;
        for (var i = 0; i < num_samples; ++i) {
            avr += this._values[i];
        }

        this.setOutputData(0, avr / num_samples);
    }

    onPropertyChanged(name, value) {
        if (value < 1) {
            value = 1;
        }
        this.properties.samples = Math.round(value);
        var old = this._values;

        this._values = new Float32Array(this.properties.samples);
        if (old.length <= this._values.length) {
            this._values.set(old);
        } else {
            this._values.set(old.subarray(0, this._values.length));
        }
    }

    onPropertyChanged(name, value) {
        if (name == "formula") {
            this.code_widget.value = value;
        }
    }
}
Lite.registerNodeType("math/average", MathAverageFilter);


class MathTendTo {

    static title = "TendTo";
    static desc = "moves the output value always closer to the input";

    constructor() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.addProperty("factor", 0.1);
        this.size = [80, 30];
        this._value = null;
    }

    onExecute() {
        var v = this.getInputData(0);
        if (v == null) {
            v = 0;
        }
        var f = this.properties.factor;
        if (this._value == null) {
            this._value = v;
        } else {
            this._value = this._value * (1 - f) + v * f;
        }
        this.setOutputData(0, this._value);
    }
}
Lite.registerNodeType("math/tendTo", MathTendTo);


class MathOperation {

    static title = "Operation";
    static desc = "Easy math operators";

    constructor() {
        this.addInput("A", "number,array,object");
        this.addInput("B", "number");
        this.addOutput("=", "number");
        this.addProperty("A", 1);
        this.addProperty("B", 1);
        this.addProperty("OP", "+", "enum", { values: MathOperation.values });
        this._func = MathOperation.funcs[this.properties.OP];
        this._result = []; // only used for arrays
    }

    getTitle() {
        if (this.properties.OP == "max" || this.properties.OP == "min")
            return this.properties.OP + "(A,B)";
        return "A " + this.properties.OP + " B";
    }

    setValue(v) {
        if (typeof v == "string") {
            v = parseFloat(v);
        }
        this.properties["value"] = v;
    }

    onPropertyChanged(name, _value) {
        if (name != "OP") return;
        this._func = MathOperation.funcs[this.properties.OP];
        if (!this._func) {
            console.warn("Unknown operation: " + this.properties.OP);
            this._func = function (A) {
                return A;
            };
        }
    }

    onExecute() {
        var A = this.getInputData(0);
        var B = this.getInputData(1);
        if (A != null) {
            if (A.constructor === Number) this.properties["A"] = A;
        } else {
            A = this.properties["A"];
        }

        if (B != null) {
            this.properties["B"] = B;
        } else {
            B = this.properties["B"];
        }

        var func = MathOperation.funcs[this.properties.OP];

        var result;
        if (A.constructor === Number) {
            result = 0;
            result = func(A, B);
        } else if (A.constructor === Array) {
            result = this._result;
            result.length = A.length;
            for (let i = 0; i < A.length; ++i)
                result[i] = func(A[i], B);
        } else {
            result = {};
            for (let i in A)
                result[i] = func(A[i], B);
        }
        this.setOutputData(0, result);
    }

    onDrawBackground(ctx) {
        if (this.flags.collapsed) {
            return;
        }

        ctx.font = "40px Arial";
        ctx.fillStyle = "#666";
        ctx.textAlign = "center";
        ctx.fillText(
            this.properties.OP,
            this.size[0] * 0.5,
            (this.size[1] + Lite.NODE_TITLE_HEIGHT) * 0.5,
        );
        ctx.textAlign = "left";
    }

    static values = ["+", "-", "*", "/", "%", "^", "max", "min"];

    static funcs = {
        "+": function (A, B) {
            return A + B;
        },
        "-": function (A, B) {
            return A - B;
        },
        x: function (A, B) {
            return A * B;
        },
        X: function (A, B) {
            return A * B;
        },
        "*": function (A, B) {
            return A * B;
        },
        "/": function (A, B) {
            return A / B;
        },
        "%": function (A, B) {
            return A % B;
        },
        "^": function (A, B) {
            return Math.pow(A, B);
        },
        max: function (A, B) {
            return Math.max(A, B);
        },
        min: function (A, B) {
            return Math.min(A, B);
        },
    };

    static "@OP" = {
        type: "enum",
        title: "operation",
        values: MathOperation.values,
    };

    static size = [100, 60];
}
Lite.registerNodeType("math/operation", MathOperation);
Lite.registerSearchboxExtra("math/operation", "MAX", {
    properties: { OP: "max" },
    title: "MAX()",
});
Lite.registerSearchboxExtra("math/operation", "MIN", {
    properties: { OP: "min" },
    title: "MIN()",
});


class MathCompare {

    static title = "Compare";
    static desc = "compares between two values";

    constructor() {
        this.addInput("A", "number");
        this.addInput("B", "number");
        this.addOutput("A==B", "boolean");
        this.addOutput("A!=B", "boolean");
        this.addProperty("A", 0);
        this.addProperty("B", 0);
    }

    onExecute() {
        var A = this.getInputData(0);
        var B = this.getInputData(1);
        if (A !== undefined) {
            this.properties["A"] = A;
        } else {
            A = this.properties["A"];
        }

        if (B !== undefined) {
            this.properties["B"] = B;
        } else {
            B = this.properties["B"];
        }

        for (var i = 0, l = this.outputs.length; i < l; ++i) {
            var output = this.outputs[i];
            if (!output.links || !output.links.length) {
                continue;
            }
            var value;
            switch (output.name) {
                case "A==B":
                    value = A == B;
                    break;
                case "A!=B":
                    value = A != B;
                    break;
                case "A>B":
                    value = A > B;
                    break;
                case "A<B":
                    value = A < B;
                    break;
                case "A<=B":
                    value = A <= B;
                    break;
                case "A>=B":
                    value = A >= B;
                    break;
            }
            this.setOutputData(i, value);
        }
    }

    onGetOutputs() {
        return [
            ["A==B", "boolean"],
            ["A!=B", "boolean"],
            ["A>B", "boolean"],
            ["A<B", "boolean"],
            ["A>=B", "boolean"],
            ["A<=B", "boolean"],
        ];
    }
}
Lite.registerNodeType("math/compare", MathCompare);
Lite.registerSearchboxExtra("math/compare", "==", {
    outputs: [["A==B", "boolean"]],
    title: "A==B",
});
Lite.registerSearchboxExtra("math/compare", "!=", {
    outputs: [["A!=B", "boolean"]],
    title: "A!=B",
});
Lite.registerSearchboxExtra("math/compare", ">", {
    outputs: [["A>B", "boolean"]],
    title: "A>B",
});
Lite.registerSearchboxExtra("math/compare", "<", {
    outputs: [["A<B", "boolean"]],
    title: "A<B",
});
Lite.registerSearchboxExtra("math/compare", ">=", {
    outputs: [["A>=B", "boolean"]],
    title: "A>=B",
});
Lite.registerSearchboxExtra("math/compare", "<=", {
    outputs: [["A<=B", "boolean"]],
    title: "A<=B",
});


class MathCondition {

    static title = "Condition";
    static desc = "evaluates condition between A and B";

    constructor() {
        this.addInput("A", "number");
        this.addInput("B", "number");
        this.addOutput("true", "boolean");
        this.addOutput("false", "boolean");
        this.addProperty("A", 1);
        this.addProperty("B", 1);
        this.addProperty("OP", ">", "enum", { values: MathCondition.values });
        this.addWidget("combo", "Cond.", this.properties.OP, {
            property: "OP",
            values: MathCondition.values,
        });

        this.size = [80, 60];
    }

    getTitle() {
        return "A " + this.properties.OP + " B";
    }

    onExecute() {
        var A = this.getInputData(0);
        if (A === undefined) {
            A = this.properties.A;
        } else {
            this.properties.A = A;
        }

        var B = this.getInputData(1);
        if (B === undefined) {
            B = this.properties.B;
        } else {
            this.properties.B = B;
        }

        var result = true;
        switch (this.properties.OP) {
            case ">":
                result = A > B;
                break;
            case "<":
                result = A < B;
                break;
            case "==":
                result = A == B;
                break;
            case "!=":
                result = A != B;
                break;
            case "<=":
                result = A <= B;
                break;
            case ">=":
                result = A >= B;
                break;
            case "||":
                result = A || B;
                break;
            case "&&":
                result = A && B;
                break;
        }

        this.setOutputData(0, result);
        this.setOutputData(1, !result);
    }

    static values = [">", "<", "==", "!=", "<=", ">=", "||", "&&"];

    static "@OP" = {
        type: "enum",
        title: "operation",
        values: MathCondition.values,
    };
}
Lite.registerNodeType("math/condition", MathCondition);


class MathBranch {
    static title = "Branch";
    static desc = "If condition is true, outputs IN in true, otherwise in false";
    constructor() {
        this.addInput("in", 0);
        this.addInput("cond", "boolean");
        this.addOutput("true", 0);
        this.addOutput("false", 0);
        this.size = [80, 60];
    }

    onExecute() {
        var V = this.getInputData(0);
        var cond = this.getInputData(1);

        if (cond) {
            this.setOutputData(0, V);
            this.setOutputData(1, null);
        } else {
            this.setOutputData(0, null);
            this.setOutputData(1, V);
        }
    }
}
Lite.registerNodeType("math/branch", MathBranch);


class MathAccumulate {

    static title = "Accumulate";
    static desc = "Increments a value every time";

    constructor() {
        this.addInput("inc", "number");
        this.addOutput("total", "number");
        this.addProperty("increment", 1);
        this.addProperty("value", 0);
    }

    onExecute() {
        if (this.properties.value === null) {
            this.properties.value = 0;
        }

        var inc = this.getInputData(0);
        if (inc !== null) {
            this.properties.value += inc;
        } else {
            this.properties.value += this.properties.increment;
        }
        this.setOutputData(0, this.properties.value);
    }
}
Lite.registerNodeType("math/accumulate", MathAccumulate);


class MathTrigonometry {

    static title = "Trigonometry";
    static desc = "Sin Cos Tan";

    constructor() {
        this.addInput("v", "number");
        this.addOutput("sin", "number");

        this.addProperty("amplitude", 1);
        this.addProperty("offset", 0);
        this.bgImageUrl = "nodes/imgs/icon-sin.png";
    }

    // MathTrigonometry.filter = "shader";

    onExecute() {
        var v = this.getInputData(0);
        if (v == null) {
            v = 0;
        }
        var amplitude = this.properties["amplitude"];
        var slot = this.findInputSlot("amplitude");
        if (slot != -1) {
            amplitude = this.getInputData(slot);
        }
        var offset = this.properties["offset"];
        slot = this.findInputSlot("offset");
        if (slot != -1) {
            offset = this.getInputData(slot);
        }

        for (var i = 0, l = this.outputs.length; i < l; ++i) {
            var output = this.outputs[i];
            var value;
            switch (output.name) {
                case "sin":
                    value = Math.sin(v);
                    break;
                case "cos":
                    value = Math.cos(v);
                    break;
                case "tan":
                    value = Math.tan(v);
                    break;
                case "asin":
                    value = Math.asin(v);
                    break;
                case "acos":
                    value = Math.acos(v);
                    break;
                case "atan":
                    value = Math.atan(v);
                    break;
            }
            this.setOutputData(i, amplitude * value + offset);
        }
    }

    onGetInputs() {
        return [
            ["v", "number"],
            ["amplitude", "number"],
            ["offset", "number"],
        ];
    }

    onGetOutputs() {
        return [
            ["sin", "number"],
            ["cos", "number"],
            ["tan", "number"],
            ["asin", "number"],
            ["acos", "number"],
            ["atan", "number"],
        ];
    }
}
Lite.registerNodeType("math/trigonometry", MathTrigonometry);
Lite.registerSearchboxExtra("math/trigonometry", "SIN()", {
    outputs: [["sin", "number"]],
    title: "SIN()",
});
Lite.registerSearchboxExtra("math/trigonometry", "COS()", {
    outputs: [["cos", "number"]],
    title: "COS()",
});
Lite.registerSearchboxExtra("math/trigonometry", "TAN()", {
    outputs: [["tan", "number"]],
    title: "TAN()",
});


// math library for safe math operations without eval
class MathFormula {

    static title = "Formula";
    static desc = "Compute formula";

    constructor() {
        this.addInput("x", "number");
        this.addInput("y", "number");
        this.addOutput("", "number");
        this.properties = { x: 1.0, y: 1.0, formula: "x+y" };
        this.code_widget = this.addWidget(
            "text",
            "F(x,y)",
            this.properties.formula,
            function (v, canvas, node) {
                node.properties.formula = v;
            },
        );
        this.addWidget("toggle", "allow", Lite.allow_scripts, function (v) {
            Lite.allow_scripts = v;
        });
        this._func = null;
    }

    onExecute() {
        if (!Lite.allow_scripts) {
            return;
        }

        var x = this.getInputData(0);
        var y = this.getInputData(1);
        if (x != null) {
            this.properties["x"] = x;
        } else {
            x = this.properties["x"];
        }

        if (y != null) {
            this.properties["y"] = y;
        } else {
            y = this.properties["y"];
        }

        var value;
        try {
            if (!this._func || this._func_code != this.properties.formula) {
                this._func = new Function(
                    "x",
                    "y",
                    "TIME",
                    "return " + this.properties.formula,
                );
                this._func_code = this.properties.formula;
            }
            value = this._func(x, y, this.graph.globaltime);
            this.boxcolor = null;
        } catch (err) {
            this.boxcolor = "red";
        }
        this.setOutputData(0, value);
    }

    getTitle() {
        return this._func_code || "Formula";
    }

    onDrawBackground() {
        var f = this.properties["formula"];
        if (this.outputs && this.outputs.length) {
            this.outputs[0].label = f;
        }
    }

    static size = [160, 100];
}
Lite.registerNodeType("math/formula", MathFormula);


class Math3DVec2ToXY {

    static title = "Vec2->XY";
    static desc = "vector 2 to components";

    constructor() {
        this.addInput("vec2", "vec2");
        this.addOutput("x", "number");
        this.addOutput("y", "number");
    }

    onExecute() {
        var v = this.getInputData(0);
        if (v == null) {
            return;
        }

        this.setOutputData(0, v[0]);
        this.setOutputData(1, v[1]);
    }
}
Lite.registerNodeType("math3d/vec2-to-xy", Math3DVec2ToXY);


class Math3DXYToVec2 {

    static title = "XY->Vec2";
    static desc = "components to vector2";

    constructor() {
        this.addInputs([
            ["x", "number"],
            ["y", "number"],
        ]);
        this.addOutput("vec2", "vec2");
        this.properties = { x: 0, y: 0 };
        this._data = new Float32Array(2);
    }

    onExecute() {
        var x = this.getInputData(0);
        if (x == null) {
            x = this.properties.x;
        }
        var y = this.getInputData(1);
        if (y == null) {
            y = this.properties.y;
        }

        var data = this._data;
        data[0] = x;
        data[1] = y;

        this.setOutputData(0, data);
    }
}
Lite.registerNodeType("math3d/xy-to-vec2", Math3DXYToVec2);


class Math3DVec3ToXYZ {

    static title = "Vec3->XYZ";
    static desc = "vector 3 to components";

    constructor() {
        this.addInput("vec3", "vec3");
        this.addOutput("x", "number");
        this.addOutput("y", "number");
        this.addOutput("z", "number");
    }

    onExecute() {
        var v = this.getInputData(0);
        if (v == null) {
            return;
        }

        this.setOutputData(0, v[0]);
        this.setOutputData(1, v[1]);
        this.setOutputData(2, v[2]);
    }
}
Lite.registerNodeType("math3d/vec3-to-xyz", Math3DVec3ToXYZ);


class Math3DXYZToVec3 {

    static title = "XYZ->Vec3";
    static desc = "components to vector3";

    constructor() {
        this.addInputs([
            ["x", "number"],
            ["y", "number"],
            ["z", "number"],
        ]);
        this.addOutput("vec3", "vec3");
        this.properties = { x: 0, y: 0, z: 0 };
        this._data = new Float32Array(3);
    }

    onExecute() {
        var x = this.getInputData(0);
        if (x == null) {
            x = this.properties.x;
        }
        var y = this.getInputData(1);
        if (y == null) {
            y = this.properties.y;
        }
        var z = this.getInputData(2);
        if (z == null) {
            z = this.properties.z;
        }

        var data = this._data;
        data[0] = x;
        data[1] = y;
        data[2] = z;

        this.setOutputData(0, data);
    }
}
Lite.registerNodeType("math3d/xyz-to-vec3", Math3DXYZToVec3);


class Math3DVec4ToXYZW {

    static title = "Vec4->XYZW";
    static desc = "vector 4 to components";

    constructor() {
        this.addInput("vec4", "vec4");
        this.addOutput("x", "number");
        this.addOutput("y", "number");
        this.addOutput("z", "number");
        this.addOutput("w", "number");
    }

    onExecute() {
        var v = this.getInputData(0);
        if (v == null) {
            return;
        }

        this.setOutputData(0, v[0]);
        this.setOutputData(1, v[1]);
        this.setOutputData(2, v[2]);
        this.setOutputData(3, v[3]);
    }
}
Lite.registerNodeType("math3d/vec4-to-xyzw", Math3DVec4ToXYZW);


class Math3DXYZWToVec4 {

    static title = "XYZW->Vec4";
    static desc = "components to vector4";

    constructor() {
        this.addInputs([
            ["x", "number"],
            ["y", "number"],
            ["z", "number"],
            ["w", "number"],
        ]);
        this.addOutput("vec4", "vec4");
        this.properties = { x: 0, y: 0, z: 0, w: 0 };
        this._data = new Float32Array(4);
    }

    onExecute() {
        var x = this.getInputData(0);
        if (x == null) {
            x = this.properties.x;
        }
        var y = this.getInputData(1);
        if (y == null) {
            y = this.properties.y;
        }
        var z = this.getInputData(2);
        if (z == null) {
            z = this.properties.z;
        }
        var w = this.getInputData(3);
        if (w == null) {
            w = this.properties.w;
        }

        var data = this._data;
        data[0] = x;
        data[1] = y;
        data[2] = z;
        data[3] = w;

        this.setOutputData(0, data);
    }
}
Lite.registerNodeType("math3d/xyzw-to-vec4", Math3DXYZWToVec4);
