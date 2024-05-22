import { jest } from "@jest/globals";
import { Lite } from "../src/Lite.js";

// just for the Jest version number
import path from 'path';
import { fileURLToPath } from 'url';

describe("register node types", () => {
    let Sum;

    beforeAll(async () => {

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Resolve the path to the Jest package.json file
        const jestPackagePath = path.resolve(__dirname, '../node_modules/@jest/core/package.json');
        const jestPackage = await import(`file://${jestPackagePath}`);
        const jestVersion = jestPackage.default.version;
        console.info(`Jest version:${jestVersion}`);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();

        // attempt at resetting Lite each time, because Jest can't just do that
        // and neither can I.
        Lite.registered_node_types = {};
        Lite.registered_slot_in_types = {};
        Lite.registered_slot_in_types = {};

        Sum = function Sum() {
            this.addInput("a", "number");
            this.addInput("b", "number");
            this.addOutput("sum", "number");
        };
        Sum.prototype.onExecute = function (a, b) {
            this.setOutputData(0, a + b);
        };
    });

    test("normal case", () => {
        Lite.registerNodeType("math/sum", Sum);

        let node = Lite.registered_node_types["math/sum"];
        expect(node).toBeTruthy();
        expect(node.type).toBe("math/sum");
        expect(node.title).toBe("Sum");
        expect(node.category).toBe("math");
        expect(node.prototype.configure).toBe(
            Lite.Node.prototype.configure
        );
    });

    test("callback triggers", () => {
        const consoleSpy = jest
            .spyOn(console, "log")
            .mockImplementation(() => {});

        Lite.onNodeTypeRegistered = jest.fn();
        Lite.onNodeTypeReplaced = jest.fn();
        Lite.registerNodeType("math/sum", Sum);
        expect(Lite.onNodeTypeRegistered).toHaveBeenCalled();
        expect(Lite.onNodeTypeReplaced).not.toHaveBeenCalled();
        Lite.registerNodeType("math/sum", Sum);
        expect(Lite.onNodeTypeReplaced).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringMatching("replacing node type")
        );
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringMatching("math/sum")
        );
    });

    test("node with title", () => {
        Sum.title = "The sum title";
        Lite.registerNodeType("math/sum", Sum);
        let node = Lite.registered_node_types["math/sum"];
        expect(node.title).toBe("The sum title");
        expect(node.title).not.toBe(node.name);
    });

    test("handle error simple object", () => {
        expect(() =>
            Lite.registerNodeType("math/sum", { simple: "type" })
        ).toThrow("Cannot register a simple object");
    });

    test("check shape mapping", () => {
        Lite.registerNodeType("math/sum", Sum);

        const node_type = Lite.registered_node_types["math/sum"];
        expect(new node_type().shape).toBe(undefined);
        node_type.prototype.shape = "default";
        expect(new node_type().shape).toBe(undefined);
        node_type.prototype.shape = "box";
        console.log(Lite.BOX_SHAPE);
        expect(new node_type().shape).toBe(Lite.BOX_SHAPE);
        node_type.prototype.shape = "round";
        expect(new node_type().shape).toBe(Lite.ROUND_SHAPE);
        node_type.prototype.shape = "circle";
        expect(new node_type().shape).toBe(Lite.CIRCLE_SHAPE);
        node_type.prototype.shape = "card";
        expect(new node_type().shape).toBe(Lite.CARD_SHAPE);
        node_type.prototype.shape = "custom_shape";
        expect(new node_type().shape).toBe("custom_shape");

        // Check that also works for replaced node types
        jest.spyOn(console, "log").mockImplementation(() => {});
        function NewCalcSum(a, b) {
            return a + b;
        }
        Lite.registerNodeType("math/sum", NewCalcSum);
        const new_node_type = Lite.registered_node_types["math/sum"];
        new_node_type.prototype.shape = "box";
        expect(new new_node_type().shape).toBe(Lite.BOX_SHAPE);
    });

    test("onPropertyChanged warning", () => {
        const consoleSpy = jest
            .spyOn(console, "warn")
            .mockImplementation(() => {});

        Sum.prototype.onPropertyChange = true;
        Lite.registerNodeType("math/sum", Sum);
        expect(consoleSpy).toBeCalledTimes(1);
        expect(consoleSpy).toBeCalledWith(
            expect.stringContaining("has onPropertyChange method")
        );
        expect(consoleSpy).toBeCalledWith(expect.stringContaining("math/sum"));
    });

    test("registering supported file extensions", () => {
        expect(Lite.node_types_by_file_extension).toEqual({});

        // Create two node types with calc_times overriding .pdf
        Sum.supported_extensions = ["PDF", "exe", null];
        function Times() {
            this.addInput("a", "number");
            this.addInput("b", "number");
            this.addOutput("times", "number");
        }
        Times.prototype.onExecute = function (a, b) {
            this.setOutputData(0, a * b);
        };
        Times.supported_extensions = ["pdf", "jpg"];
        Lite.registerNodeType("math/sum", Sum);
        Lite.registerNodeType("math/times", Times);

        expect(
            Object.keys(Lite.node_types_by_file_extension).length
        ).toBe(3);
        expect(Lite.node_types_by_file_extension).toHaveProperty("pdf");
        expect(Lite.node_types_by_file_extension).toHaveProperty("exe");
        expect(Lite.node_types_by_file_extension).toHaveProperty("jpg");

        expect(Lite.node_types_by_file_extension.exe).toBe(Sum);
        expect(Lite.node_types_by_file_extension.pdf).toBe(Times);
        expect(Lite.node_types_by_file_extension.jpg).toBe(Times);
    });

    test("register in/out slot types", () => {
        expect(Lite.registered_slot_in_types).toEqual({});
        expect(Lite.registered_slot_out_types).toEqual({});

        // Test slot type registration with first type
        Lite.auto_load_slot_types = true;
        Lite.registerNodeType("math/sum", Sum);
        expect(Lite.registered_slot_in_types).toEqual({
            number: { nodes: ["math/sum"] },
        });
        expect(Lite.registered_slot_out_types).toEqual({
            number: { nodes: ["math/sum"] },
        });

        // Test slot type registration with second type
        function ToInt() {
            this.addInput("string", "string");
            this.addOutput("number", "number");
        };
        ToInt.prototype.onExecute = function (str) {
            this.setOutputData(0, Number(str));
        };
        Lite.registerNodeType("basic/to_int", ToInt);
        expect(Lite.registered_slot_in_types).toEqual({
            number: { nodes: ["math/sum"] },
            string: { nodes: ["basic/to_int"] },
        });
        expect(Lite.registered_slot_out_types).toEqual({
            number: { nodes: ["math/sum", "basic/to_int"] },
        });
    });
});

describe("unregister node types", () => {
    let Sum;

    beforeEach(async () => {
        jest.resetModules();
        Sum = function Sum() {
            this.addInput("a", "number");
            this.addInput("b", "number");
            this.addOutput("sum", "number");
        };
        Sum.prototype.onExecute = function (a, b) {
            this.setOutputData(0, a + b);
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("remove by name", () => {
        Lite.registerNodeType("math/sum", Sum);
        expect(Lite.registered_node_types["math/sum"]).toBeTruthy();

        Lite.unregisterNodeType("math/sum");
        expect(Lite.registered_node_types["math/sum"]).toBeFalsy();
    });

    test("remove by object", () => {
        Lite.registerNodeType("math/sum", Sum);
        expect(Lite.registered_node_types["math/sum"]).toBeTruthy();

        Lite.unregisterNodeType(Sum);
        expect(Lite.registered_node_types["math/sum"]).toBeFalsy();
    });

    test("try removing with wrong name", () => {
        expect(() => Lite.unregisterNodeType("missing/type")).toThrow(
            "node type not found: missing/type"
        );
    });

    test("no constructor name", () => {
        function BlankNode() {}
        BlankNode.constructor = {}
        Lite.registerNodeType("blank/node", BlankNode);
        expect(Lite.registered_node_types["blank/node"]).toBeTruthy()

        Lite.unregisterNodeType("blank/node");
        expect(Lite.registered_node_types["blank/node"]).toBeFalsy();
    })
});