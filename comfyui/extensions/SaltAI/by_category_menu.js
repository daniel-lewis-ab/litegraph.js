import { app } from "../../scripts/app.js";
import { data as rawdata } from "./by_category_menu_data.js";

app.registerExtension({
    name: "SaltAI.ByCategoryMenu",
    async init(app) {

        // This uses a so-far unused method hook to provide a substitute root menu on *canvas
        const og_getMenuOptions = LGraphCanvas.prototype.getMenuOptions;
        LGraphCanvas.prototype.getMenuOptions = function(){
            const menuSoFar = og_getMenuOptions?.() ?? [
                {
                    // This is the original menu callback
                    content: "By Pack",
                    has_submenu: true,
                    callback: LGraphCanvas.onMenuAdd
                },
                {
                    content: "Add Group",
                    callback: LGraphCanvas.onGroupAdd
                },
            ];
            menuSoFar.unshift({
                // Substitute in the semantically sorted "Add Node"
                content: "By Category",
                has_submenu: true,
    
                // Derived from LGraphCanvas.onMenuAdd, but using below data
                // and binding into the classes found in LiteGraph.registered_node_types
                callback: function (node, options, e, prev_menu, callback) {
    
                    var canvas = LGraphCanvas.active_canvas;
                    var ref_window = canvas.getCanvasWindow();
                    var graph = canvas.graph;
                    if (!graph)
                        return;
    
                    const data = rawdata.split('\n').filter((row) => {
                        if(!row)
                            return false;
    
                        // Get just the part after the last /
                        const split = row.split('/');
                        const className = split[split.length-1];
                        if (!className) {
                            return false;
                        }
                    
                        // Ensure a similar string exists in LiteGraph.registered_node_types
                        const result = Object.keys(LiteGraph.registered_node_types).some((registeredClass) => {
                            if(!registeredClass)
                                return false;
                            const split = registeredClass.split('/');
                            return className === split[split.length-1];
                        });
                    
                        return result ?? false;
                    });
    
                    function inner_onMenuAdded(base_category ,prev_menu){
                
                        var categories = data
                            .filter(function(category){
                                return category.startsWith(base_category);
                            });
                        var entries = [];
                
                        // 898 entries as of development on my system
                        // category is the whole path
                        categories.forEach(category => {
                            
                            const base_category_regex = new RegExp('^(' + base_category + ')');
                            
                            // leftmost part of the path
                            const category_name = category.replace(base_category_regex,"").split('/')[0];
                            
                            // the whole path except the last bit? (includes last /)
                            const category_path = (base_category === '') ? category_name + '/' : base_category + category_name + '/';
                            
                            // name is just the part being clicked on
                            const name = category_name.includes("::") ? category_name.split("::")[1] : category_name;
                        
    
                            // Check if we have an exact match in data, in which case it's a leaf not a branch
                            // Return the "value" if the key matches the condition
                            let node = LiteGraph.registered_node_types[name]; // Access the value directly using the key
                            
                            if(node) {
                                console.debug(JSON.stringify(node));
    
                                if (node.skip_list)
                                    return;
    
                                // We haven't already added this menu item
                                const exists = entries.find(entry => entry.value === node.type);
                                if (exists)
                                    return;
    
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
                                    }
                                });
                            } else {
                                const exists = entries.find(entry => entry.value === category_path);
                                if(exists)
                                    return;
    
                                // add branch
                                entries.push({
                                    value: category_path,
                                    content: name,
                                    has_submenu: true,
                                    callback: (value, event, mouseEvent, contextMenu) => inner_onMenuAdded(value.value, contextMenu)
                                });
                            }
                        });
                        new LiteGraph.ContextMenu( entries, { event: e, parentMenu: prev_menu }, ref_window );
                    }
                    inner_onMenuAdded('',prev_menu);
                    return false;
                }
            });
            return menuSoFar;
        };
    },
});
