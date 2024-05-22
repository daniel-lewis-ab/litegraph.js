import { Lite } from "../Lite.js";

/* in types :: run in console :: var s=""; Lite.slot_types_in.forEach(function(el){s+=el+"\n";}); console.log(s); */

if (typeof Lite.slot_types_default_in == "undefined")
    Lite.slot_types_default_in = {}; // [];
Lite.slot_types_default_in["_event_"] = "widget/button";
Lite.slot_types_default_in["array"] = "basic/array";
Lite.slot_types_default_in["boolean"] = "basic/boolean";
Lite.slot_types_default_in["number"] = "widget/number";
Lite.slot_types_default_in["object"] = "basic/data";
Lite.slot_types_default_in["string"] = [
    "basic/string",
    "string/concatenate",
];
Lite.slot_types_default_in["vec2"] = "math3d/xy-to-vec2";
Lite.slot_types_default_in["vec3"] = "math3d/xyz-to-vec3";
Lite.slot_types_default_in["vec4"] = "math3d/xyzw-to-vec4";

Lite.slot_types_default_in["audio"] = ["audio/source","audio/media_source"];
Lite.slot_types_default_in["canvas"] = "graphics/canvas";
Lite.slot_types_default_in["geometry"] = ["geometry/polygon","geometry/eval"];
Lite.slot_types_default_in["image"] = ["graphics/image","graphics/video","graphics/webcam"];
Lite.slot_types_default_in["mat4"] = "math3d/mat4";
Lite.slot_types_default_in["quat"] = ["math3d/quaternion","math3d/rotation"];
Lite.slot_types_default_in["table"] = "string/toTable";

/* out types :: run in console :: var s=""; Lite.slot_types_out.forEach(function(el){s+=el+"\n";}); console.log(s); */
if (typeof Lite.slot_types_default_out == "undefined")
    Lite.slot_types_default_out = {};
Lite.slot_types_default_out["_event_"] = [
    "logic/IF",
    "events/sequence",
    "events/log",
    "events/counter",
];
Lite.slot_types_default_out["array"] = [
    "basic/watch",
    "basic/set_array",
    "basic/array[]",
];
Lite.slot_types_default_out["boolean"] = [
    "logic/IF",
    "basic/watch",
    "math/branch",
    "math/gate",
];
Lite.slot_types_default_out["number"] = [
    "basic/watch",
    { node: "math/operation", properties: { OP: "*" }, title: "A*B" },
    { node: "math/operation", properties: { OP: "/" }, title: "A/B" },
    { node: "math/operation", properties: { OP: "+" }, title: "A+B" },
    { node: "math/operation", properties: { OP: "-" }, title: "A-B" },
    { node: "math/compare", outputs: [["A==B", "boolean"]], title: "A==B" },
    { node: "math/compare", outputs: [["A>B", "boolean"]], title: "A>B" },
    { node: "math/compare", outputs: [["A<B", "boolean"]], title: "A<B" },
];
Lite.slot_types_default_out["object"] = [
    "objects/property_widget",
    "objects/method_widget",
    "objects/properties",
    "basic/object_property",
    "basic/keys",
    "string/toString",
    "basic/watch",
];
Lite.slot_types_default_out["string"] = [
    "basic/watch",
    "string/compare",
    "string/concatenate",
    "string/contains",
];
Lite.slot_types_default_out["vec2"] = "math3d/vec2-to-xy";
Lite.slot_types_default_out["vec3"] = "math3d/vec3-to-xyz";
Lite.slot_types_default_out["vec4"] = "math3d/vec4-to-xyzw";

Lite.slot_types_default_out["audio"] = ["audio/destination","audio/mixer","audio/analyser"];
Lite.slot_types_default_out["canvas"] = ["graphics/frame","graphics/drawImage"];
Lite.slot_types_default_out["geometry"] = ["geometry/points_to_instances","geometry/extrude","geometry/eval","geometry/connectPoints","geometry/transform"];
Lite.slot_types_default_out["image"] = ["graphics/frame","graphics/drawImage"];
// Lite.slot_types_default_out["mat4"] = "geometry/transform";
Lite.slot_types_default_out["quat"] = ["math3d/rotate_vec3","math3d/rotation"];
Lite.slot_types_default_out["table"] = "string/toTable";
