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
        const og_getMenuOptions = LGraphCanvas.prototype.getMenuOptions;
        LGraphCanvas.prototype.getMenuOptions = function(){

            // This part is for compatibility
            const menuSoFar = og_getMenuOptions?.() ?? [
                // This is the original menu callback
                { content: "By Pack", has_submenu: true, callback: LGraphCanvas.onMenuAdd },
                { content: "Add Group", callback: LGraphCanvas.onGroupAdd },
            ];

            // Adds to the top
            menuSoFar.unshift(
                { content: "By Category", has_submenu: true, callback: menuGeneratorForByContent }
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
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }
        return true;
    }

    function recursiveCheck(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let value = obj[key];
                if (typeof value === 'object' && value !== null) {

                    // Recursively check child objects
                    recursiveCheck(value);

                    if(isEmpty(value))
                        delete obj[key];
                    
                } else if (value === 1) {

                    // Prune non-existent nodes
                    if (!LiteGraph.registered_node_types[key]) {
                        // console.log(key);
                        delete obj[key];
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
        // console.log("inner_onMenuAdded called");
        // console.log("base_object:", base_object);
        // console.log("base_key:", base_key);

        const entries = [];

        // Duplicate entry checks
        const isAlreadyAdded = (entries, value) => {
            return entries.find(entry => entry.value === value);
        };

        // Iterate over the keys of the base_object
        for (const key in base_object) {
            // console.log("Iterating key:", key); // Debug logging
            if (base_object[key]) {
                const value = base_object[key];

                if (value === 1) {
                    // Is Node
                    const node = LiteGraph.registered_node_types[key];
                    if (node) {
                        if (node.skip_list) {
                            continue;
                        }

                        if (isAlreadyAdded(entries, node.type)) {
                            continue;
                        }

                        // console.log(`Adding node: ${node.type} - ${node.title}`); // Debug logging

                        // Add Node
                        entries.push({
                            value: node.type,
                            content: node.title,
                            has_submenu: false, // Node entries are leaf nodes
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
                    } else {
                        // console.warn(`Node type not found: ${key}`); // Debug logging
                    }
                } else {
                    // Is Submenu
                    if (isAlreadyAdded(entries, key)) {
                        continue;
                    }

                    // console.log(`Adding submenu: ${key}`); // Debug logging

                    // Add Submenu
                    entries.push({
                        value: key,
                        content: key,
                        has_submenu: true,
                        callback: (submenu_value, event, mouseEvent, contextMenu) => inner_onMenuAdded(value, key, contextMenu)
                    });
                }
            }
        }

        // Build the menu with the entries from above
        new LiteGraph.ContextMenu(entries, { event: e, parentMenu: prev_menu }, ref_window);
    }

    // console.log("Initial data:", data); // Debug logging

    // Ensure the initial call passes the correct data
    inner_onMenuAdded(data, '', prev_menu);
    return false;
}
