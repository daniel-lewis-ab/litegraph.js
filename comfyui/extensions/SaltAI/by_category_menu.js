import { app } from "../../scripts/app.js";
import { data } from "./by_category_menu_json.js";

/*
    This part is scaffolding
    Allow ComfyUI to call us, bind in original menu stuff, and add this to the top
*/
app.registerExtension({
    name: "SaltAI.ByCategoryMenu",
    async setup(app) {

        // Prune anything that isn't needed from the data to reduce memory
        prune(data);

        // This uses a so-far unused method hook to provide a substitute root menu on *canvas
        const og_getMenuOptoriginalGetMenuOptionsions = LGraphCanvas.prototype.getMenuOptions;
        LGraphCanvas.prototype.getMenuOptions = function(){

            // This part is for compatibility
            const menuSoFar = originalGetMenuOptions?.() ?? [
                // This is the original menu callback
                { content: "Add By Pack", has_submenu: true, callback: LGraphCanvas.onMenuAdd },
                { content: "Add Group", callback: LGraphCanvas.onGroupAdd },
            ];

            // Adds to the top
            menuSoFar.unshift(
                { content: "Add By Category", has_submenu: true, callback: menuGeneratorForByContent }
            );

            return menuSoFar;
        };
    },
});

/*
    Purges alot of the raw data so the in memory data isn't so huge.
*/
function prune(data) {
    // Prune empty folders

    function isEmpty(obj) {
        if (Array.isArray(obj)) {
            return obj.length === 0;
        }
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }
        return true;
    }

    function recursiveCheck(obj) {
        if (Array.isArray(obj)) {
            for (let i = obj.length - 1; i >= 0; i--) {
                if (typeof obj[i] === 'object' && obj[i] !== null) {
                    recursiveCheck(obj[i]);
                    if (isEmpty(obj[i])) {
                        obj.splice(i, 1);
                    }
                } else if (typeof obj[i] === 'string') {
                    if (!LiteGraph.registered_node_types[obj[i]]) {
                        obj.splice(i, 1);
                    }
                }
            }
        } else {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    let value = obj[key];
                    if (typeof value === 'object' && value !== null) {
                        recursiveCheck(value);
                        if (isEmpty(value)) {
                            delete obj[key];
                        }
                    } else if (typeof value === 'string') {
                        if (!LiteGraph.registered_node_types[value]) {
                            delete obj[key];
                        }
                    }
                }
            }
        }
    }
    recursiveCheck(data);
}

/*
    This code is derived from LGraphCanvas.onMenuAdd, but using our own string URL paths.
    and binding into the classes found in LiteGraph.registered_node_types if they exist.
*/
function menuGeneratorForByContent(node, options, e, prev_menu, callback) {
    var canvas = LGraphCanvas.active_canvas;
    var ref_window = canvas.getCanvasWindow();
    var graph = canvas.graph;

    if (!graph) {
        console.error('Graph is not available in ByCategory menu?');
        return;
    }

    function inner_onMenuAdded(base_object, base_key, prev_menu) {
        const entries = [];

        const isAlreadyAdded = (entries, value) => {
            return entries.find(entry => entry.value === value);
        };

        for (const key in base_object) {
            if (base_object.hasOwnProperty(key)) {
                const value = base_object[key];

                // console.log(`base_object=${JSON.stringify(base_object)}, key=${key}, value=${JSON.stringify(value)}`);

                if (typeof value === 'object') {
                    if (isAlreadyAdded(entries, key)) {
                        continue;
                    }

                    entries.push({
                        value: key,
                        content: key,
                        has_submenu: true,
                        callback: (submenu_value, event, mouseEvent, contextMenu) => inner_onMenuAdded(value, key, contextMenu)
                    });
                } else if (Array.isArray(value)) {
                    if (isAlreadyAdded(entries, key)) {
                        continue;
                    }

                    entries.push({
                        value: key,
                        content: key,
                        has_submenu: true,
                        callback: (submenu_value, event, mouseEvent, contextMenu) => inner_onMenuAdded(value, key, contextMenu)
                    });
                } else if (typeof value === 'string') {
                    const node = LiteGraph.registered_node_types[value];
                    if (node) {
                        if (node.skip_list) {
                            continue;
                        }

                        if (isAlreadyAdded(entries, node.type)) {
                            continue;
                        }

                        entries.push({
                            value: node.type,
                            content: node.title,
                            has_submenu: false,
                            callback: (value, event, mouseEvent, contextMenu) => {
                                const first_event = contextMenu.getFirstEvent();
                                canvas.graph.beforeChange();
                                const newNode = LiteGraph.createNode(value.value);
                                if (newNode) {
                                    newNode.pos = canvas.convertEventToCanvasOffset(first_event);
                                    canvas.graph.add(newNode);
                                }
                                if (callback) callback(newNode);
                                canvas.graph.afterChange();
                            },
                        });
                    }
                    /*
                    else {
                        console.warn(`Node type not found: ${value}`); // Debug logging
                    }
                    */
                }
            }
        }

        new LiteGraph.ContextMenu(entries, { event: e, parentMenu: prev_menu }, ref_window);
    }

    inner_onMenuAdded(data, '', prev_menu);
    return false;
}
