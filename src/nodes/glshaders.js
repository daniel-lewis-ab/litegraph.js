import { Lite } from "../litegraph.js";
import { LGraph } from "../lgraph.js";
import { GL } from "../../editor/js/libs/litegl.js";
import { gl } from "../../editor/js/code.js";
import { LGraphTexture } from "./gltextures.js";

var SHADERNODES_COLOR = "#345";

var LGShaders = (Lite.Shaders = {});

var GLSL_types = (LGShaders.GLSL_types = [
    "float",
    "vec2",
    "vec3",
    "vec4",
    "mat3",
    "mat4",
    "sampler2D",
    "samplerCube",
]);
var GLSL_types_const = (LGShaders.GLSL_types_const = [
    "float",
    "vec2",
    "vec3",
    "vec4",
]);

var GLSL_functions_desc = {
    radians: "T radians(T degrees)",
    degrees: "T degrees(T radians)",
    sin: "T sin(T angle)",
    cos: "T cos(T angle)",
    tan: "T tan(T angle)",
    asin: "T asin(T x)",
    acos: "T acos(T x)",
    atan: "T atan(T x)",
    atan2: "T atan(T x,T y)",
    pow: "T pow(T x,T y)",
    exp: "T exp(T x)",
    log: "T log(T x)",
    exp2: "T exp2(T x)",
    log2: "T log2(T x)",
    sqrt: "T sqrt(T x)",
    inversesqrt: "T inversesqrt(T x)",
    abs: "T abs(T x)",
    sign: "T sign(T x)",
    floor: "T floor(T x)",
    round: "T round(T x)",
    ceil: "T ceil(T x)",
    fract: "T fract(T x)",
    mod: "T mod(T x,T y)", // "T mod(T x,float y)"
    min: "T min(T x,T y)",
    max: "T max(T x,T y)",
    clamp: "T clamp(T x,T minVal = 0.0,T maxVal = 1.0)",
    mix: "T mix(T x,T y,T a)", // "T mix(T x,T y,float a)"
    step: "T step(T edge, T edge2, T x)", // "T step(float edge, T x)"
    smoothstep: "T smoothstep(T edge, T edge2, T x)", // "T smoothstep(float edge, T x)"
    length: "float length(T x)",
    distance: "float distance(T p0, T p1)",
    normalize: "T normalize(T x)",
    dot: "float dot(T x,T y)",
    cross: "vec3 cross(vec3 x,vec3 y)",
    reflect: "vec3 reflect(vec3 V,vec3 N)",
    refract: "vec3 refract(vec3 V,vec3 N, float IOR)",
};

// parse them
var GLSL_functions = {};
var GLSL_functions_name = [];
parseGLSLDescriptions();

LGShaders.ALL_TYPES = "float,vec2,vec3,vec4";

function parseGLSLDescriptions() {
    GLSL_functions_name.length = 0;

    for (var i in GLSL_functions_desc) {
        var op = GLSL_functions_desc[i];
        var index = op.indexOf(" ");
        var return_type = op.substr(0, index);
        var index2 = op.indexOf("(", index);
        var func_name = op.substr(index, index2 - index).trim();
        var params = op
            .substr(index2 + 1, op.length - index2 - 2)
            .split(",");
        for (var j in params) {
            var p = params[j].split(" ").filter(function (a) {
                return a;
            });
            params[j] = { type: p[0].trim(), name: p[1].trim() };
            if (p[2] == "=") params[j].value = p[3].trim();
        }
        GLSL_functions[i] = {
            return_type: return_type,
            func: func_name,
            params: params,
        };
        GLSL_functions_name.push(func_name);
        // console.log( GLSL_functions[i] );
    }
}

// common actions to all shader node classes
function registerShaderNode(type, node_ctor) {
    // static attributes
    node_ctor.color = SHADERNODES_COLOR;
    node_ctor.filter = "shader";

    // common methods
    node_ctor.prototype.clearDestination = function () {
        this.shader_destination = {};
    };
    node_ctor.prototype.propagateDestination =
        function propagateDestination(dest_name) {
            this.shader_destination[dest_name] = true;
            if (this.inputs)
                for (var i = 0; i < this.inputs.length; ++i) {
                    var origin_node = this.getInputNode(i);
                    if (origin_node)
                        origin_node.propagateDestination(dest_name);
                }
        };
    if (!node_ctor.prototype.onPropertyChanged)
        node_ctor.prototype.onPropertyChanged = function () {
            if (this.graph) this.graph._version++;
        };

    /*
    if(!node_ctor.prototype.onGetCode)
        node_ctor.prototype.onGetCode = function()
        {
            //check destination to avoid lonely nodes
            if(!this.shader_destination)
                return;
            //grab inputs with types
            var inputs = [];
            if(this.inputs)
            for(var i = 0; i < this.inputs.length; ++i)
                inputs.push({ type: this.getInputData(i), name: getInputLinkID(this,i) });
            var outputs = [];
            if(this.outputs)
            for(var i = 0; i < this.outputs.length; ++i)
                outputs.push({ name: getOutputLinkID(this,i) });
            //pass to code func
            var results = this.extractCode(inputs);
            //grab output, pass to next
            if(results)
            for(var i = 0; i < results.length; ++i)
            {
                var r = results[i];
                if(!r)
                    continue;
                this.setOutputData(i,r.value);
            }
        }
    */

    Lite.registerNodeType("shader::" + type, node_ctor);
}

function getShaderNodeVarName(node, name) {
    return "VAR_" + (name || "TEMP") + "_" + node.id;
}

function getInputLinkID(node, slot) {
    if (!node.inputs) return null;
    var link = node.getInputLink(slot);
    if (!link) return null;
    var origin_node = node.graph.getNodeById(link.origin_id);
    if (!origin_node) return null;
    if (origin_node.getOutputVarName)
        return origin_node.getOutputVarName(link.origin_slot);
    // generate
    return "link_" + origin_node.id + "_" + link.origin_slot;
}

function getOutputLinkID(node, slot) {
    if (!node.isOutputConnected(slot)) return null;
    return "link_" + node.id + "_" + slot;
}

LGShaders.registerShaderNode = registerShaderNode;
LGShaders.getInputLinkID = getInputLinkID;
LGShaders.getOutputLinkID = getOutputLinkID;
LGShaders.getShaderNodeVarName = getShaderNodeVarName;
LGShaders.parseGLSLDescriptions = parseGLSLDescriptions;

// given a const number, it transform it to a string that matches a type
export function valueToGLSL(
    v,
    type,
    precision,
) {
    var n = 5; // num decimals
    if (precision != null) {
        n = precision;
    }
    if (!type) {
        if (v.constructor === Number) {
            type = "float";
        } else if (v.length) {
            switch (v.length) {
                case 2:
                    type = "vec2";
                    break;
                case 3:
                    type = "vec3";
                    break;
                case 4:
                    type = "vec4";
                    break;
                case 9:
                    type = "mat3";
                    break;
                case 16:
                    type = "mat4";
                    break;
                default:
                    throw new Error("unknown type for glsl value size");
            }
        } else {
            throw new Error("unknown type for glsl value: " + v.constructor);
        }
    }
    switch (type) {
        case "float":
            return v.toFixed(n);
        case "vec2":
            return `vec2(${v[0].toFixed(n)},${v[1].toFixed(n)})`;
        case "color3":
        case "vec3":
            return `vec3(${v[0].toFixed(n)},${v[1].toFixed(n)},${v[2].toFixed(n)})`;
        case "color4":
        case "vec4":
            return `vec4(${v[0].toFixed(n)},${v[1].toFixed(n)},${v[2].toFixed(n)},${v[3].toFixed(n)})`;
        case "mat3":
            return "mat3(1.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,1.0)";
        case "mat4":
            return "mat4(1.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0)";
        default:
            throw ("unknown glsl type in valueToGLSL:", type);
    }
}

// makes sure that a var is of a type, and if not, it converts it
var varToTypeGLSL = (Lite.varToTypeGLSL = function varToTypeGLSL(
    v,
    input_type,
    output_type,
) {
    if (input_type == output_type) {
        return v;
    }
    if (v == null) {
        switch (output_type) {
            case "float":
                return "0.0";
            case "vec2":
                return "vec2(0.0)";
            case "vec3":
                return "vec3(0.0)";
            case "vec4":
                return "vec4(0.0,0.0,0.0,1.0)";
            default: // null
                return null;
        }
    }
    if (!output_type) {
        throw new Error("error: no output type specified");
    }
    if (output_type == "float") {
        switch (input_type) {
            // case "float":
            case "vec2":
            case "vec3":
            case "vec4":
                return v + ".x";
            default: // null
                return "0.0";
        }
    } else if (output_type == "vec2") {
        switch (input_type) {
            case "float":
                return "vec2(" + v + ")";
            // case "vec2":
            case "vec3":
            case "vec4":
                return v + ".xy";
            default: // null
                return "vec2(0.0)";
        }
    } else if (output_type == "vec3") {
        switch (input_type) {
            case "float":
                return "vec3(" + v + ")";
            case "vec2":
                return "vec3(" + v + ",0.0)";
            // case "vec3":
            case "vec4":
                return v + ".xyz";
            default: // null
                return "vec3(0.0)";
        }
    } else if (output_type == "vec4") {
        switch (input_type) {
            case "float":
                return "vec4(" + v + ")";
            case "vec2":
                return "vec4(" + v + ",0.0,1.0)";
            case "vec3":
                return "vec4(" + v + ",1.0)";
            default: // null
                return "vec4(0.0,0.0,0.0,1.0)";
        }
    }
    throw new Error("type cannot be converted");
});

// used to plug incompatible stuff
var convertVarToGLSLType = (Lite.convertVarToGLSLType =
    function convertVarToGLSLType(varname, type, target_type) {
        if (type == target_type) return varname;
        if (type == "float") return target_type + "(" + varname + ")";
        if (target_type == "vec2")
            // works for vec2,vec3 and vec4
            return "vec2(" + varname + ".xy)";
        if (target_type == "vec3") {
            // works for vec2,vec3 and vec4
            if (type == "vec2") return "vec3(" + varname + ",0.0)";
            if (type == "vec4") return "vec4(" + varname + ".xyz)";
        }
        if (target_type == "vec4") {
            if (type == "vec2") return "vec4(" + varname + ",0.0,0.0)";
            if (target_type == "vec3") return "vec4(" + varname + ",1.0)";
        }
        return null;
    });

// used to host a shader body
export class LGShaderContext {
    constructor() {
        // to store the code template
        this.vs_template = "";
        this.fs_template = "";

        // required so nodes now where to fetch the input data
        this.buffer_names = {uvs: "v_coord"};

        this.extra = {}; // to store custom info from the nodes (like if this shader supports a feature, etc)

        this._functions = {};
        this._uniforms = {};
        this._codeparts = {};
        this._uniform_value = null;
    }

    clear() {
        this._uniforms = {};
        this._functions = {};
        this._codeparts = {};
        this._uniform_value = null;
        this.extra = {};
    }

    addUniform(name, type, value) {
        this._uniforms[name] = type;
        if (value != null) {
            if (!this._uniform_value) this._uniform_value = {};
            this._uniform_value[name] = value;
        }
    }

    addFunction(name, code) {
        this._functions[name] = code;
    }

    addCode(hook, code, destinations) {
        destinations = destinations || { "": "" };
        for (var i in destinations) {
            var h = i ? i + "_" + hook : hook;
            if (!this._codeparts[h]) this._codeparts[h] = code + "\n";
            else this._codeparts[h] += code + "\n";
        }
    }

    // the system works by grabbing code fragments from every node and concatenating them in blocks depending on where must they be attached
    computeCodeBlocks(graph, extra_uniforms) {
        // prepare context
        this.clear();

        // grab output nodes
        var vertexout = graph.findNodesByType("shader::output/vertex");
        vertexout = vertexout && vertexout.length ? vertexout[0] : null;
        var fragmentout = graph.findNodesByType("shader::output/fragcolor");
        fragmentout = fragmentout && fragmentout.length ? fragmentout[0] : null;
        if (!fragmentout)
            // ??
            return null;

        // propagate back destinations
        graph.sendEventToAllNodes("clearDestination");
        if (vertexout) vertexout.propagateDestination("vs");
        if (fragmentout) fragmentout.propagateDestination("fs");

        // gets code from graph
        graph.sendEventToAllNodes("onGetCode", this);

        var uniforms = "";
        for (let i in this._uniforms)
            uniforms += "uniform " + this._uniforms[i] + " " + i + ";\n";
        if (extra_uniforms)
            for (let i in extra_uniforms)
                uniforms += "uniform " + extra_uniforms[i] + " " + i + ";\n";

        var functions = "";
        for (let i in this._functions)
            functions += "//" + i + "\n" + this._functions[i] + "\n";

        var blocks = this._codeparts;
        blocks.uniforms = uniforms;
        blocks.functions = functions;
        return blocks;
    }

    // replaces blocks using the vs and fs template and returns the final codes
    computeShaderCode(graph) {
        var blocks = this.computeCodeBlocks(graph);
        var vs_code = GL.Shader.replaceCodeUsingContext(
            this.vs_template,
            blocks,
        );
        var fs_code = GL.Shader.replaceCodeUsingContext(
            this.fs_template,
            blocks,
        );
        return {
            vs_code: vs_code,
            fs_code: fs_code,
        };
    }

    // generates the shader code from the template and the
    computeShader(graph, shader) {
        var finalcode = this.computeShaderCode(graph);
        console.log(finalcode.vs_code, finalcode.fs_code);

        if (!Lite.catch_exceptions) {
            this._shader_error = true;
            if (shader)
                shader.updateShader(finalcode.vs_code, finalcode.fs_code);
            else shader = new GL.Shader(finalcode.vs_code, finalcode.fs_code);
            this._shader_error = false;
            return shader;
        }

        try {
            if (shader)
                shader.updateShader(finalcode.vs_code, finalcode.fs_code);
            else shader = new GL.Shader(finalcode.vs_code, finalcode.fs_code);
            this._shader_error = false;
            return shader;
        } catch (err) {
            if (!this._shader_error) {
                console.error(err);
                if (err.indexOf("Fragment shader") != -1)
                    console.log(finalcode.fs_code
                        .split("\n")
                        .map(function (v, i) {
                            return i + ".- " + v;
                        })
                        .join("\n"));
                else
                    console.log(finalcode.vs_code);
            }
            this._shader_error = true;
            return null;
        }
    }

    getShader(graph) {
        // if graph not changed?
        if (this._shader && this._shader._version == graph._version)
            return this._shader;

        // compile shader
        var shader = this.computeShader(graph, this._shader);
        if (!shader) return null;

        this._shader = shader;
        shader._version = graph._version;
        return shader;
    }

    // some shader nodes could require to fill the box with some uniforms
    fillUniforms(uniforms, param) {
        if (!this._uniform_value) return;

        for (var i in this._uniform_value) {
            var v = this._uniform_value[i];
            if (v == null) continue;
            if (v.constructor === Function) uniforms[i] = v.call(this, param);
            else if (v.constructor === GL.Texture) {
                // todo...
            } else uniforms[i] = v;
        }
    }
}


// applies a shader graph to texture, it can be uses as an example
class LGraphShaderGraph {
    constructor() {
        // before inputs
        this.subgraph = new LGraph();
        this.subgraph._subgraph_node = this;
        this.subgraph._is_subgraph = true;
        this.subgraph.filter = "shader";

        this.addInput("in", "texture");
        this.addOutput("out", "texture");
        this.properties = {
            width: 0,
            height: 0,
            alpha: false,
            precision:
                typeof LGraphTexture != "undefined" ? LGraphTexture.DEFAULT : 2,
        };

        var inputNode = this.subgraph.findNodesByType("shader::input/uniform")[0];
        inputNode.pos = [200, 300];

        var sampler = Lite.createNode("shader::texture/sampler2D");
        sampler.pos = [400, 300];
        this.subgraph.add(sampler);

        var outnode = Lite.createNode("shader::output/fragcolor");
        outnode.pos = [600, 300];
        this.subgraph.add(outnode);

        inputNode.connect(0, sampler);
        sampler.connect(0, outnode);

        this.size = [180, 60];
        this.redraw_on_mouse = true; // force redraw

        this._uniforms = {};
        this._shader = null;
        this._context = new LGShaderContext();
        this._context.vs_template =
            "#define VERTEX\n" + GL.Shader.SCREEN_VERTEX_SHADER;
        this._context.fs_template = LGraphShaderGraph.template;
    }

    static template = `
        #define FRAGMENT
        precision highp float;
        varying vec2 v_coord;
        {{varying}}
        {{uniforms}}
        {{functions}}
        {{fs_functions}}
        void main() {
    
            vec2 uv = v_coord;
            vec4 fragcolor = vec4(0.0);
            vec4 fragcolor1 = vec4(0.0);
            {{fs_code}}
            gl_FragColor = fragcolor;
        }
    `;

    static widgets_info = {
        precision: {
            widget: "combo",
            values: LGraphTexture.MODE_VALUES,
        },
    };

    static title = "ShaderGraph";
    static desc = "Builds a shader using a graph";
    static input_node_type = "input/uniform";
    static output_node_type = "output/fragcolor";
    static title_color = SHADERNODES_COLOR;

    onSerialize(o) {
        o.subgraph = this.subgraph.serialize();
    }

    onConfigure(o) {
        this.subgraph.configure(o.subgraph);
    }

    onExecute() {
        if (!this.isOutputConnected(0)) return;

        // read input texture
        var intex = this.getInputData(0);
        if (intex && intex.constructor != GL.Texture) intex = null;

        var w = this.properties.width | 0;
        var h = this.properties.height | 0;
        if (w == 0) {
            w = intex ? intex.width : gl.viewport_data[2];
        } // 0 means default
        if (h == 0) {
            h = intex ? intex.height : gl.viewport_data[3];
        } // 0 means default

        var type = LGraphTexture.getTextureType(
            this.properties.precision,
            intex,
        );

        var texture = this._texture;
        if (
            !texture ||
            texture.width != w ||
            texture.height != h ||
            texture.type != type
        ) {
            texture = this._texture = new GL.Texture(w, h, {
                type: type,
                format: this.alpha ? gl.RGBA : gl.RGB,
                filter: gl.LINEAR,
            });
        }

        var shader = this.getShader(this.subgraph);
        if (!shader) return;

        var uniforms = this._uniforms;
        this._context.fillUniforms(uniforms);

        var tex_slot = 0;
        if (this.inputs)
            for (var i = 0; i < this.inputs.length; ++i) {
                var input = this.inputs[i];
                var data = this.getInputData(i);
                if (input.type == "texture") {
                    if (!data) data = GL.Texture.getWhiteTexture();
                    data = data.bind(tex_slot++);
                }

                if (data != null) uniforms["u_" + input.name] = data;
            }

        var mesh = GL.Mesh.getScreenQuad();

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);

        texture.drawTo(function () {
            shader.uniforms(uniforms);
            shader.draw(mesh);
        });

        // use subgraph output
        this.setOutputData(0, texture);
    }

    // add input node inside subgraph
    onInputAdded(slot_info) {
        var subnode = Lite.createNode("shader::input/uniform");
        subnode.setProperty("name", slot_info.name);
        subnode.setProperty("type", slot_info.type);
        this.subgraph.add(subnode);
    }

    // remove all
    onInputRemoved(slot, slot_info) {
        var nodes = this.subgraph.findNodesByType("shader::input/uniform");
        for (var i = 0; i < nodes.length; ++i) {
            var node = nodes[i];
            if (node.properties.name == slot_info.name)
                this.subgraph.remove(node);
        }
    }

    computeSize() {
        var num_inputs = this.inputs ? this.inputs.length : 0;
        var num_outputs = this.outputs ? this.outputs.length : 0;
        return [
            200,
            Math.max(num_inputs, num_outputs) * Lite.NODE_SLOT_HEIGHT +
                Lite.NODE_TITLE_HEIGHT +
                10,
        ];
    }

    getShader() {
        var shader = this._context.getShader(this.subgraph);
        if (!shader) this.boxcolor = "red";
        else this.boxcolor = null;
        return shader;
    }

    onDrawBackground(ctx, graphcanvas, canvas, pos) {
        if (this.flags.collapsed)
            return;

        // allows to preview the node if the canvas is a webgl canvas
        var tex = this.getOutputData(0);
        var inputs_y = this.inputs
            ? this.inputs.length * Lite.NODE_SLOT_HEIGHT
            : 0;
        if (
            tex &&
            ctx == tex.gl &&
            this.size[1] > inputs_y + Lite.NODE_TITLE_HEIGHT
        ) {
            ctx.drawImage(
                tex,
                10,
                y,
                this.size[0] - 20,
                this.size[1] - inputs_y - Lite.NODE_TITLE_HEIGHT,
            );
        }

        var y = this.size[1] - Lite.NODE_TITLE_HEIGHT + 0.5;

        // button
        var over = Lite.isInsideRectangle(
            pos[0],
            pos[1],
            this.pos[0],
            this.pos[1] + y,
            this.size[0],
            Lite.NODE_TITLE_HEIGHT,
        );
        ctx.fillStyle = over ? "#555" : "#222";
        ctx.beginPath();
        if (this._shape == Lite.BOX_SHAPE)
            ctx.rect(0, y, this.size[0] + 1, Lite.NODE_TITLE_HEIGHT);
        else
            ctx.roundRect(
                0,
                y,
                this.size[0] + 1,
                Lite.NODE_TITLE_HEIGHT,
                0,
                8,
            );
        ctx.fill();

        // button
        ctx.textAlign = "center";
        ctx.font = "24px Arial";
        ctx.fillStyle = over ? "#DDD" : "#999";
        ctx.fillText("+", this.size[0] * 0.5, y + 24);
    }

    onMouseDown(e, localpos, graphcanvas) {
        var y = this.size[1] - Lite.NODE_TITLE_HEIGHT + 0.5;
        if (localpos[1] > y) {
            graphcanvas.showSubgraphPropertiesDialog(this);
        }
    }

    /*
    * @TODO: Either make it or excise it
    * LGraphShaderGraph.prototype.onDrawSubgraphBackground = function () {};
    */
    getExtraMenuOptions() {
        var that = this;
        var options = [
            {
                content: "Print Code",
                callback: function () {
                    var code = that._context.computeShaderCode();
                    console.log(code.vs_code, code.fs_code);
                },
            },
        ];

        return options;
    }
}
Lite.registerNodeType("texture/shaderGraph", LGraphShaderGraph);

/*
    * @TODO: Either write it or excise it.
    * function shaderNodeFromFunction() {};
    */

// applies a shader graph to a code
class LGraphShaderUniform {
    constructor() {
        this.addOutput("out", "");
        this.properties = { name: "", type: "" };
    }

    static title = "Uniform";
    static desc = "Input data for the shader";

    getTitle() {
        if (this.properties.name && this.flags.collapsed)
            return this.properties.type + " " + this.properties.name;
        return "Uniform";
    }

    onPropertyChanged() {
        this.outputs[0].name =
            this.properties.type + " " + this.properties.name;
    }

    onGetCode(context) {
        if (!this.shader_destination) return;

        var type = this.properties.type;
        if (!type) {
            if (!context.onGetPropertyInfo) return;
            var info = context.onGetPropertyInfo(this.property.name);
            if (!info) return;
            type = info.type;
        }
        if (type == "number") type = "float";
        else if (type == "texture") type = "sampler2D";
        if (LGShaders.GLSL_types.indexOf(type) == -1) return;

        context.addUniform("u_" + this.properties.name, type);
        this.setOutputData(0, type);
    }

    getOutputVarName() {
        return "u_" + this.properties.name;
    }
}
registerShaderNode("input/uniform", LGraphShaderUniform);


class LGraphShaderAttribute {
    constructor () {
        this.addOutput("out", "vec2");
        this.properties = { name: "coord", type: "vec2" };
    }

    static title = "Attribute";
    static desc = "Input data from mesh attribute";

    getTitle() {
        return "att. " + this.properties.name;
    }

    onGetCode(context) {
        if (!this.shader_destination) return;

        var type = this.properties.type;
        if (!type || LGShaders.GLSL_types.indexOf(type) == -1) return;
        if (type == "number") type = "float";
        if (this.properties.name != "coord") {
            context.addCode(
                "varying",
                " varying " + type + " v_" + this.properties.name + ";",
            );
            // if( !context.varyings[ this.properties.name ] )
            // context.addCode( "vs_code", "v_" + this.properties.name + " = " + input_name + ";" );
        }
        this.setOutputData(0, type);
    }

    getOutputVarName() {
        return "v_" + this.properties.name;
    }
}
registerShaderNode("input/attribute", LGraphShaderAttribute);


class LGraphShaderSampler2D {
    constructor() {
        this.addInput("tex", "sampler2D");
        this.addInput("uv", "vec2");
        this.addOutput("rgba", "vec4");
        this.addOutput("rgb", "vec3");
    }

    static title = "Sampler2D";
    static desc = "Reads a pixel from a texture";

    onGetCode(context) {
        if (!this.shader_destination) return;

        var texname = getInputLinkID(this, 0);
        var varname = getShaderNodeVarName(this);
        var code = "vec4 " + varname + " = vec4(0.0);\n";
        if (texname) {
            var uvname = getInputLinkID(this, 1) || context.buffer_names.uvs;
            code += varname + " = texture2D(" + texname + "," + uvname + ");\n";
        }

        var link0 = getOutputLinkID(this, 0);
        if (link0)
            code +=
                "vec4 " + getOutputLinkID(this, 0) + " = " + varname + ";\n";

        var link1 = getOutputLinkID(this, 1);
        if (link1)
            code +=
                "vec3 " +
                getOutputLinkID(this, 1) +
                " = " +
                varname +
                ".xyz;\n";

        context.addCode("code", code, this.shader_destination);
        this.setOutputData(0, "vec4");
        this.setOutputData(1, "vec3");
    }
}
registerShaderNode("texture/sampler2D", LGraphShaderSampler2D);


class LGraphShaderConstant {
    constructor() {
        this.addOutput("", "float");

        this.properties = {
            type: "float",
            value: 0,
        };

        this.addWidget("combo", "type", "float", null, {
            values: GLSL_types_const,
            property: "type",
        });
        this.updateWidgets();
    }

    static title = "const";

    getTitle() {
        if (this.flags.collapsed)
            return valueToGLSL(this.properties.value, this.properties.type, 2);
        return "Const";
    }

    onPropertyChanged(name, value) {
        if (name == "type") {
            if (this.outputs[0].type != value) {
                this.disconnectOutput(0);
                this.outputs[0].type = value;
            }
            this.widgets.length = 1; // remove extra widgets
            this.updateWidgets();
        }
        if (name == "value") {
            if (!value.length) this.widgets[1].value = value;
            else {
                this.widgets[1].value = value[1];
                if (value.length > 2) this.widgets[2].value = value[2];
                if (value.length > 3) this.widgets[3].value = value[3];
            }
        }
    }

    updateWidgets(old_value) {
        var that = this;
        old_value = this.properties.value;
        var options = { step: 0.01 };
        switch (this.properties.type) {
            case "float":
                this.properties.value = 0;
                this.addWidget("number", "v", 0, {
                    step: 0.01,
                    property: "value",
                });
                break;
            case "vec2":
                this.properties.value =
                    old_value && old_value.length == 2
                        ? [old_value[0], old_value[1]]
                        : [0, 0, 0];
                this.addWidget(
                    "number",
                    "x",
                    this.properties.value[0],
                    function (v) {
                        that.properties.value[0] = v;
                    },
                    options,
                );
                this.addWidget(
                    "number",
                    "y",
                    this.properties.value[1],
                    function (v) {
                        that.properties.value[1] = v;
                    },
                    options,
                );
                break;
            case "vec3":
                this.properties.value =
                    old_value && old_value.length == 3
                        ? [old_value[0], old_value[1], old_value[2]]
                        : [0, 0, 0];
                this.addWidget(
                    "number",
                    "x",
                    this.properties.value[0],
                    function (v) {
                        that.properties.value[0] = v;
                    },
                    options,
                );
                this.addWidget(
                    "number",
                    "y",
                    this.properties.value[1],
                    function (v) {
                        that.properties.value[1] = v;
                    },
                    options,
                );
                this.addWidget(
                    "number",
                    "z",
                    this.properties.value[2],
                    function (v) {
                        that.properties.value[2] = v;
                    },
                    options,
                );
                break;
            case "vec4":
                this.properties.value =
                    old_value && old_value.length == 4
                        ? [
                            old_value[0],
                            old_value[1],
                            old_value[2],
                            old_value[3],
                        ]
                        : [0, 0, 0, 0];
                this.addWidget(
                    "number",
                    "x",
                    this.properties.value[0],
                    function (v) {
                        that.properties.value[0] = v;
                    },
                    options,
                );
                this.addWidget(
                    "number",
                    "y",
                    this.properties.value[1],
                    function (v) {
                        that.properties.value[1] = v;
                    },
                    options,
                );
                this.addWidget(
                    "number",
                    "z",
                    this.properties.value[2],
                    function (v) {
                        that.properties.value[2] = v;
                    },
                    options,
                );
                this.addWidget(
                    "number",
                    "w",
                    this.properties.value[3],
                    function (v) {
                        that.properties.value[3] = v;
                    },
                    options,
                );
                break;
            default:
                console.error("unknown type for constant");
        }
    }

    onGetCode(context) {
        if (!this.shader_destination) return;

        var value = valueToGLSL(this.properties.value, this.properties.type);
        var link_name = getOutputLinkID(this, 0);
        if (!link_name)
            // not connected
            return;

        var code =
            "	" + this.properties.type + " " + link_name + " = " + value + ";";
        context.addCode("code", code, this.shader_destination);

        this.setOutputData(0, this.properties.type);
    }
}
registerShaderNode("const/const", LGraphShaderConstant);


class LGraphShaderVec2 {
    constructor() {
        this.addInput("xy", "vec2");
        this.addInput("x", "float");
        this.addInput("y", "float");
        this.addOutput("xy", "vec2");
        this.addOutput("x", "float");
        this.addOutput("y", "float");

        this.properties = { x: 0, y: 0 };
    }

    static title = "vec2";
    static varmodes = ["xy", "x", "y"];

    onPropertyChanged() {
        if (this.graph)
            this.graph._version++;
    }

    onGetCode(context) {
        if (!this.shader_destination) return;

        var props = this.properties;

        var varname = getShaderNodeVarName(this);
        var code =
            "	vec2 " + varname + " = " + valueToGLSL([props.x, props.y]) + ";\n";

        for (let i = 0; i < LGraphShaderVec2.varmodes.length; ++i) {
            let varmode = LGraphShaderVec2.varmodes[i];
            var inlink = getInputLinkID(this, i);
            if (!inlink) continue;
            code += "	" + varname + "." + varmode + " = " + inlink + ";\n";
        }

        for (let i = 0; i < LGraphShaderVec2.varmodes.length; ++i) {
            let varmode = LGraphShaderVec2.varmodes[i];
            var outlink = getOutputLinkID(this, i);
            if (!outlink) continue;
            var type = GLSL_types_const[varmode.length - 1];
            code +=
                "	" +
                type +
                " " +
                outlink +
                " = " +
                varname +
                "." +
                varmode +
                ";\n";
            this.setOutputData(i, type);
        }

        context.addCode("code", code, this.shader_destination);
    }
}
registerShaderNode("const/vec2", LGraphShaderVec2);


class LGraphShaderVec3 {
    constructor() {
        this.addInput("xyz", "vec3");
        this.addInput("x", "float");
        this.addInput("y", "float");
        this.addInput("z", "float");
        this.addInput("xy", "vec2");
        this.addInput("xz", "vec2");
        this.addInput("yz", "vec2");
        this.addOutput("xyz", "vec3");
        this.addOutput("x", "float");
        this.addOutput("y", "float");
        this.addOutput("z", "float");
        this.addOutput("xy", "vec2");
        this.addOutput("xz", "vec2");
        this.addOutput("yz", "vec2");

        this.properties = { x: 0, y: 0, z: 0 };
    }

    static title = "vec3";
    static varmodes = ["xyz", "x", "y", "z", "xy", "xz", "yz"];

    onPropertyChanged() {
        if (this.graph) {
            this.graph._version++;
        }
    }

    onGetCode(context) {
        if (!this.shader_destination) {
            return;
        }

        var props = this.properties;

        var varname = getShaderNodeVarName(this);
        var code =
            "vec3 " +
            varname +
            " = " +
            valueToGLSL([props.x, props.y, props.z]) +
            ";\n";

        for (let i = 0; i < LGraphShaderVec3.varmodes.length; ++i) {
            let varmode = LGraphShaderVec3.varmodes[i];
            let inlink = getInputLinkID(this, i);
            if (!inlink) continue;
            code += "	" + varname + "." + varmode + " = " + inlink + ";\n";
        }

        for (let i = 0; i < LGraphShaderVec3.varmodes.length; ++i) {
            let varmode = LGraphShaderVec3.varmodes[i];
            let outlink = getOutputLinkID(this, i);
            if (!outlink) continue;
            var type = GLSL_types_const[varmode.length - 1];
            code +=
                "	" +
                type +
                " " +
                outlink +
                " = " +
                varname +
                "." +
                varmode +
                ";\n";
            this.setOutputData(i, type);
        }

        context.addCode("code", code, this.shader_destination);
    }
}
registerShaderNode("const/vec3", LGraphShaderVec3);


class LGraphShaderVec4 {
    constructor() {
        this.addInput("xyzw", "vec4");
        this.addInput("xyz", "vec3");
        this.addInput("x", "float");
        this.addInput("y", "float");
        this.addInput("z", "float");
        this.addInput("w", "float");
        this.addInput("xy", "vec2");
        this.addInput("yz", "vec2");
        this.addInput("zw", "vec2");
        this.addOutput("xyzw", "vec4");
        this.addOutput("xyz", "vec3");
        this.addOutput("x", "float");
        this.addOutput("y", "float");
        this.addOutput("z", "float");
        this.addOutput("xy", "vec2");
        this.addOutput("yz", "vec2");
        this.addOutput("zw", "vec2");

        this.properties = { x: 0, y: 0, z: 0, w: 0 };
    }

    static title = "vec4";
    static varmodes = [
        "xyzw",
        "xyz",
        "x",
        "y",
        "z",
        "w",
        "xy",
        "yz",
        "zw",
    ];

    onPropertyChanged() {
        if (this.graph) {
            this.graph._version++;
        }
    }

    onGetCode(context) {
        if (!this.shader_destination) {
            return;
        }

        var props = this.properties;

        var varname = getShaderNodeVarName(this);
        var code =
            "vec4 " +
            varname +
            " = " +
            valueToGLSL([props.x, props.y, props.z, props.w]) +
            ";\n";

        for (let i = 0; i < LGraphShaderVec4.varmodes.length; ++i) {
            let varmode = LGraphShaderVec4.varmodes[i];
            let inlink = getInputLinkID(this, i);
            if (!inlink) continue;
            code += "	" + varname + "." + varmode + " = " + inlink + ";\n";
        }

        for (let i = 0; i < LGraphShaderVec4.varmodes.length; ++i) {
            let varmode = LGraphShaderVec4.varmodes[i];
            let outlink = getOutputLinkID(this, i);
            if (!outlink) continue;
            var type = GLSL_types_const[varmode.length - 1];
            code +=
                "	" +
                type +
                " " +
                outlink +
                " = " +
                varname +
                "." +
                varmode +
                ";\n";
            this.setOutputData(i, type);
        }
        context.addCode("code", code, this.shader_destination);
    }
}
registerShaderNode("const/vec4", LGraphShaderVec4);


class LGraphShaderFragColor {
    constructor() {
        this.addInput("color", LGShaders.ALL_TYPES);
        this.block_delete = true;
    }

    static title = "FragColor";
    static desc = "Pixel final color";

    onGetCode(context) {
        var link_name = getInputLinkID(this, 0);
        if (!link_name) {
            return;
        }
        var type = this.getInputData(0);
        var code = varToTypeGLSL(link_name, type, "vec4");
        context.addCode("fs_code", "fragcolor = " + code + ";");
    }
}
registerShaderNode("output/fragcolor", LGraphShaderFragColor);


/*
function LGraphShaderDiscard()
{
    this.addInput("v","T");
    this.addInput("min","T");
    this.properties = { min_value: 0.0 };
    this.addWidget("number","min",0,{ step: 0.01, property: "min_value" });
}

LGraphShaderDiscard.title = "Discard";

LGraphShaderDiscard.prototype.onGetCode = function( context )
{
    if(!this.isOutputConnected(0))
        return;

    var inlink = getInputLinkID(this,0);
    var inlink1 = getInputLinkID(this,1);

    if(!inlink && !inlink1) //not connected
        return;
    context.addCode("code", return_type + " " + outlink + " = ( (" + inlink + " - "+minv+") / ("+ maxv+" - "+minv+") ) * ("+ maxv2+" - "+minv2+") + " + minv2 + ";", this.shader_destination );
    this.setOutputData( 0, return_type );
}

registerShaderNode( "output/discard", LGraphShaderDiscard );
*/


class LGraphShaderOperation {
    constructor() {
        this.addInput("A", LGShaders.ALL_TYPES);
        this.addInput("B", LGShaders.ALL_TYPES);
        this.addOutput("out", "");
        this.properties = {operation: "*"};
        this.addWidget("combo", "op.", this.properties.operation, {
            property: "operation",
            values: LGraphShaderOperation.operations,
        });
    }

    static title = "Operation";
    static operations = ["+", "-", "*", "/"];

    getTitle() {
        if (this.flags.collapsed)
            return "A" + this.properties.operation + "B";
        else
            return "Operation";
    }

    onGetCode(context) {
        if (!this.shader_destination)
            return;

        if (!this.isOutputConnected(0))
            return;

        var inlinks = [];
        for (let i = 0; i < 3; ++i)
            inlinks.push({
                name: getInputLinkID(this, i),
                type: this.getInputData(i) || "float",
            });

        var outlink = getOutputLinkID(this, 0);
        if (!outlink)
            // not connected
            return;

        // func_desc
        var base_type = inlinks[0].type;
        var return_type = base_type;
        var op = this.properties.operation;

        var params = [];
        for (let i = 0; i < 2; ++i) {
            var param_code = inlinks[i].name;
            if (param_code == null) {
                // not plugged
                param_code = p.value != null ? p.value : "(1.0)";
                inlinks[i].type = "float";
            }

            // convert
            if (inlinks[i].type != base_type) {
                if (inlinks[i].type == "float" && (op == "*" || op == "/")) {
                    // I find hard to create the opposite condition now, so I prefeer an else
                } else
                    param_code = convertVarToGLSLType(
                        param_code,
                        inlinks[i].type,
                        base_type,
                    );
            }
            params.push(param_code);
        }

        context.addCode(
            "code",
            return_type +
                " " +
                outlink +
                " = " +
                params[0] +
                op +
                params[1] +
                ";",
            this.shader_destination,
        );
        this.setOutputData(0, return_type);
    }
}
registerShaderNode("math/operation", LGraphShaderOperation);


class LGraphShaderFunc {
    constructor() {
        this.addInput("A", LGShaders.ALL_TYPES);
        this.addInput("B", LGShaders.ALL_TYPES);
        this.addOutput("out", "");
        this.properties = {func: "floor"};
        this._current = "floor";
        this.addWidget(
            "combo",
            "func",
            this.properties.func, {
                property: "func",
                values: GLSL_functions_name,
            },
        );
    }

    static title = "Func";

    onPropertyChanged(name, value) {
        if (this.graph) {
            this.graph._version++;
        }
        if (name == "func") {
            var func_desc = GLSL_functions[value];
            if (!func_desc)
                return;

            // remove extra inputs
            for (let i = func_desc.params.length; i < this.inputs.length; ++i)
                this.removeInput(i);

            // add and update inputs
            for (let i = 0; i < func_desc.params.length; ++i) {
                var p = func_desc.params[i];
                if (this.inputs[i])
                    this.inputs[i].name =
                        p.name + (p.value ? " (" + p.value + ")" : "");
                else this.addInput(p.name, LGShaders.ALL_TYPES);
            }
        }
    }

    getTitle() {
        if (this.flags.collapsed)
            return this.properties.func;
        else
            return "Func";
    }

    onGetCode(context) {
        if (!this.shader_destination)
            return;

        if (!this.isOutputConnected(0))
            return;

        var inlinks = [];
        for (let i = 0; i < 3; ++i)
            inlinks.push({
                name: getInputLinkID(this, i),
                type: this.getInputData(i) || "float",
            });

        var outlink = getOutputLinkID(this, 0);
        if (!outlink)
            // not connected
            return;

        var func_desc = GLSL_functions[this.properties.func];
        if (!func_desc)
            return;

        // func_desc
        var base_type = inlinks[0].type;
        var return_type = func_desc.return_type;
        if (return_type == "T")
            return_type = base_type;

        var params = [];
        for (let i = 0; i < func_desc.params.length; ++i) {
            var p = func_desc.params[i];
            var param_code = inlinks[i].name;
            if (param_code == null) {
                // not plugged
                param_code = p.value != null ? p.value : "(1.0)";
                inlinks[i].type = "float";
            }
            if (
                (p.type == "T" && inlinks[i].type != base_type) ||
                (p.type != "T" && inlinks[i].type != base_type)
            )
                param_code = convertVarToGLSLType(
                    param_code,
                    inlinks[i].type,
                    base_type,
                );
            params.push(param_code);
        }
        context.addFunction(
            "round",
            "float round(float v){ return floor(v+0.5); }\nvec2 round(vec2 v){ return floor(v+vec2(0.5));}\nvec3 round(vec3 v){ return floor(v+vec3(0.5));}\nvec4 round(vec4 v){ return floor(v+vec4(0.5)); }\n",
        );
        context.addCode(
            "code",
            return_type +
                " " +
                outlink +
                " = " +
                func_desc.func +
                "(" +
                params.join(",") +
                ");",
            this.shader_destination,
        );

        this.setOutputData(0, return_type);
    }
}
registerShaderNode("math/func", LGraphShaderFunc);


class LGraphShaderSnippet {
    constructor() {
        this.addInput("A", LGShaders.ALL_TYPES);
        this.addInput("B", LGShaders.ALL_TYPES);
        this.addOutput("C", "vec4");
        this.properties = {
            code: "C = A+B",
            type: "vec4",
        };
        this.addWidget("text", "code", this.properties.code, {property: "code"});
        this.addWidget("combo", "type", this.properties.type, {
            values: ["float", "vec2", "vec3", "vec4"],
            property: "type",
        });
    }

    static title = "Snippet";

    onPropertyChanged(name, value) {
        if (this.graph)
            this.graph._version++;

        if (name == "type" && this.outputs[0].type != value) {
            this.disconnectOutput(0);
            this.outputs[0].type = value;
        }
    }

    getTitle() {
        if (this.flags.collapsed)
            return this.properties.code;
        else
            return "Snippet";
    }

    onGetCode(context) {
        if (!this.shader_destination || !this.isOutputConnected(0))
            return;

        var inlinkA = getInputLinkID(this, 0);
        if (!inlinkA)
            inlinkA = "1.0";
        var inlinkB = getInputLinkID(this, 1);
        if (!inlinkB)
            inlinkB = "1.0";
        var outlink = getOutputLinkID(this, 0);
        if (!outlink)
            // not connected
            return;

        var inA_type = this.getInputData(0) || "float";
        var inB_type = this.getInputData(1) || "float";
        var return_type = this.properties.type;

        // cannot resolve input
        if (inA_type == "T" || inB_type == "T") {
            return null;
        }

        var funcname = "funcSnippet" + this.id;

        var func_code =
            "\n" +
            return_type +
            " " +
            funcname +
            "( " +
            inA_type +
            " A, " +
            inB_type +
            " B) {\n";
        func_code += "	" + return_type + " C = " + return_type + "(0.0);\n";
        func_code += "	" + this.properties.code + ";\n";
        func_code += "	return C;\n}\n";

        context.addCode("functions", func_code, this.shader_destination);
        context.addCode(
            "code",
            return_type +
                " " +
                outlink +
                " = " +
                funcname +
                "(" +
                inlinkA +
                "," +
                inlinkB +
                ");",
            this.shader_destination,
        );

        this.setOutputData(0, return_type);
    }
}
registerShaderNode("utils/snippet", LGraphShaderSnippet);


class LGraphShaderRand {
    constructor() {
        this.addOutput("out", "float");
    }

    static title = "Rand";

    onGetCode(context) {
        if (!this.shader_destination || !this.isOutputConnected(0))
            return;

        var outlink = getOutputLinkID(this, 0);

        context.addUniform("u_rand" + this.id, "float", function () {
            return Math.random();
        });
        context.addCode(
            "code",
            "float " + outlink + " = u_rand" + this.id + ";",
            this.shader_destination,
        );
        this.setOutputData(0, "float");
    }
}
registerShaderNode("input/rand", LGraphShaderRand);


// noise
// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
class LGraphShaderNoise {
    constructor() {
        this.addInput("out", LGShaders.ALL_TYPES);
        this.addInput("scale", "float");
        this.addOutput("out", "float");
        this.properties = {
            type: "noise",
            scale: 1,
        };
        this.addWidget("combo", "type", this.properties.type, {
            property: "type",
            values: LGraphShaderNoise.NOISE_TYPES,
        });
        this.addWidget("number", "scale", this.properties.scale, {property: "scale"});
    }

    static NOISE_TYPES = ["noise", "rand"];

    static title = "noise";

    onGetCode(context) {
        if (!this.shader_destination || !this.isOutputConnected(0))
            return;

        var inlink = getInputLinkID(this, 0);
        var outlink = getOutputLinkID(this, 0);

        var intype = this.getInputData(0);
        if (!inlink) {
            intype = "vec2";
            inlink = context.buffer_names.uvs;
        }

        context.addFunction("noise", LGraphShaderNoise.shader_functions);
        context.addUniform(
            "u_noise_scale" + this.id,
            "float",
            this.properties.scale,
        );
        if (intype == "float")
            context.addCode(
                "code",
                "float " +
                    outlink +
                    " = snoise( vec2(" +
                    inlink +
                    ") * u_noise_scale" +
                    this.id +
                    ");",
                this.shader_destination,
            );
        else if (intype == "vec2" || intype == "vec3")
            context.addCode(
                "code",
                "float " +
                    outlink +
                    " = snoise(" +
                    inlink +
                    " * u_noise_scale" +
                    this.id +
                    ");",
                this.shader_destination,
            );
        else if (intype == "vec4")
            context.addCode(
                "code",
                "float " +
                    outlink +
                    " = snoise(" +
                    inlink +
                    ".xyz * u_noise_scale" +
                    this.id +
                    ");",
                this.shader_destination,
            );
        this.setOutputData(0, "float");
    }

    static shader_functions = `
        vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
            m = m * m ;
            m = m * m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
            vec3 g;
            g.x = a0.x  * x0.x + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }

        vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);

            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);

            vec3 x1 = x0 - i1 + 1.0 * C.xxx;
            vec3 x2 = x0 - i2 + 2.0 * C.xxx;
            vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

            i = mod(i, 289.0);
            vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));

            float n_ = 1.0 / 7.0;
            vec3 ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            
            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            
            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
            
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            
            vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            
            vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
            m = m * m;
            
            return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }

        vec3 hash3(vec2 p) {
            vec3 q = vec3(dot(p, vec2(127.1, 311.7)),
                        dot(p, vec2(269.5, 183.3)),
                        dot(p, vec2(419.2, 371.9)));
            return fract(sin(q) * 43758.5453);
        }

        vec4 hash4(vec3 p) {
            vec4 q = vec4(dot(p, vec3(127.1, 311.7, 257.3)),
                        dot(p, vec3(269.5, 183.3, 335.1)),
                        dot(p, vec3(314.5, 235.1, 467.3)),
                        dot(p, vec3(419.2, 371.9, 114.9)));
            return fract(sin(q) * 43758.5453);
        }

        float iqnoise(in vec2 x, float u, float v) {
            vec2 p = floor(x);
            vec2 f = fract(x);
            
            float k = 1.0 + 63.0 * pow(1.0 - v, 4.0);
            
            float va = 0.0;
            float wt = 0.0;
            for (int j = -2; j <= 2; j++)
                for (int i = -2; i <= 2; i++) {
                    vec2 g = vec2(float(i), float(j));
                    vec3 o = hash3(p + g) * vec3(u, u, 1.0);
                    vec2 r = g - f + o.xy;
                    float d = dot(r, r);
                    float ww = pow(1.0 - smoothstep(0.0, 1.414, sqrt(d)), k);
                    va += o.z * ww;
                    wt += ww;
                }
            
            return va / wt;
        }
    `;
}
registerShaderNode("math/noise", LGraphShaderNoise);


class LGraphShaderTime {
    constructor() {
        this.addOutput("out", "float");
    }

    static title = "Time";

    onGetCode(context) {
        if (!this.shader_destination || !this.isOutputConnected(0))
            return;

        var outlink = getOutputLinkID(this, 0);

        context.addUniform("u_time" + this.id, "float", function () {
            return getTime() * 0.001;
        });
        context.addCode(
            "code",
            "float " + outlink + " = u_time" + this.id + ";",
            this.shader_destination,
        );
        this.setOutputData(0, "float");
    }
}
registerShaderNode("input/time", LGraphShaderTime);


class LGraphShaderDither {
    constructor() {
        this.addInput("in", "T");
        this.addOutput("out", "float");
    }

    static title = "Dither";

    onGetCode(context) {
        if (!this.shader_destination || !this.isOutputConnected(0))
            return;

        var inlink = getInputLinkID(this, 0);
        var return_type = "float";
        var outlink = getOutputLinkID(this, 0);
        var intype = this.getInputData(0);
        inlink = varToTypeGLSL(inlink, intype, "float");
        context.addFunction("dither8x8", LGraphShaderDither.dither_func);
        context.addCode(
            "code",
            return_type + " " + outlink + " = dither8x8(" + inlink + ");",
            this.shader_destination,
        );
        this.setOutputData(0, return_type);
    }

    static dither_values = [
        0.515625, 0.140625, 0.640625, 0.046875, 0.546875, 0.171875, 0.671875,
        0.765625, 0.265625, 0.890625, 0.390625, 0.796875, 0.296875, 0.921875,
        0.421875, 0.203125, 0.703125, 0.078125, 0.578125, 0.234375, 0.734375,
        0.109375, 0.609375, 0.953125, 0.453125, 0.828125, 0.328125, 0.984375,
        0.484375, 0.859375, 0.359375, 0.0625, 0.5625, 0.1875, 0.6875, 0.03125,
        0.53125, 0.15625, 0.65625, 0.8125, 0.3125, 0.9375, 0.4375, 0.78125,
        0.28125, 0.90625, 0.40625, 0.25, 0.75, 0.125, 0.625, 0.21875, 0.71875,
        0.09375, 0.59375, 1.0001, 0.5, 0.875, 0.375, 0.96875, 0.46875, 0.84375,
        0.34375,
    ];

    static dither_func = `
        float dither8x8(float brightness) {
            vec2 position = vec2(0.0);
            #ifdef FRAGMENT
            position = gl_FragCoord.xy;
            #endif
            int x = int(mod(position.x, 8.0));
            int y = int(mod(position.y, 8.0));
            int index = x + y * 8;
            float limit = 0.0;
            if (x < 8) {
                if (index == 0) limit = 0.015625;
                // Add more conditions or code here if needed
                // Example: if (condition) { ... }
            }
            ${LGraphShaderDither.dither_values.map((v, i) => `else if (index == ${i + 1}) limit = ${v};`).join("\n")}
            return brightness < limit ? 0.0 : 1.0;
        }
    `;
}
registerShaderNode("math/dither", LGraphShaderDither);


class LGraphShaderRemap {
    constructor() {
        this.addInput("", LGShaders.ALL_TYPES);
        this.addOutput("", "");
        this.properties = {
            min_value: 0,
            max_value: 1,
            min_value2: 0,
            max_value2: 1,
        };
        this.addWidget("number", "min", 0, {
            step: 0.1,
            property: "min_value",
        });
        this.addWidget("number", "max", 1, {
            step: 0.1,
            property: "max_value",
        });
        this.addWidget("number", "min2", 0, {
            step: 0.1,
            property: "min_value2",
        });
        this.addWidget("number", "max2", 1, {
            step: 0.1,
            property: "max_value2",
        });
    }

    static title = "Remap";

    onPropertyChanged() {
        if (this.graph)
            this.graph._version++;
    }

    onConnectionsChange() {
        var return_type = this.getInputDataType(0);
        this.outputs[0].type = return_type || "T";
    }

    onGetCode(context) {
        if (!this.shader_destination || !this.isOutputConnected(0))
            return;

        var inlink = getInputLinkID(this, 0);
        var outlink = getOutputLinkID(this, 0);
        if (!inlink && !outlink)
            // not connected
            return;

        var return_type = this.getInputDataType(0);
        this.outputs[0].type = return_type;
        if (return_type == "T") {
            console.warn("node type is T and cannot be resolved");
            return;
        }

        if (!inlink) {
            context.addCode(
                "code",
                "	" +
                    return_type +
                    " " +
                    outlink +
                    " = " +
                    return_type +
                    "(0.0);\n",
            );
            return;
        }

        var minv = valueToGLSL(this.properties.min_value);
        var maxv = valueToGLSL(this.properties.max_value);
        var minv2 = valueToGLSL(this.properties.min_value2);
        var maxv2 = valueToGLSL(this.properties.max_value2);

        context.addCode(
            "code",
            `${return_type} ${outlink} = ( (${inlink} - ${minv}) / (${maxv} - ${minv}) ) * (${maxv2} - ${minv2}) + ${minv2};`,
            this.shader_destination,
        );

        this.setOutputData(0, return_type);
    }
}
registerShaderNode("math/remap", LGraphShaderRemap);
