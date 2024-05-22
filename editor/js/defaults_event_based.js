
Lite.debug = true;
Lite.catch_exceptions = true;
Lite.throw_errors = true;
Lite.allow_scripts = false; //if set to true some nodes like Formula would be allowed to evaluate code that comes from unsafe sources (like node configuration); which could lead to exploits

Lite.searchbox_extras = {}; //used to add extra features to the search box
Lite.auto_sort_node_types = true; // [true!] If set to true; will automatically sort node types / categories in the context menus
Lite.node_box_coloured_when_on = true; // [true!] this make the nodes box (top left circle) coloured when triggered (execute/action); visual feedback
Lite.node_box_coloured_by_mode = true; // [true!] nodebox based on node mode; visual feedback
Lite.dialog_close_on_mouse_leave = true; // [false on mobile] better true if not touch device;
Lite.dialog_close_on_mouse_leave_delay = 500;
Lite.shift_click_do_break_link_from = false; // [false!] prefer false if results too easy to break links
Lite.click_do_break_link_to = false; // [false!]prefer false; way too easy to break links
Lite.search_hide_on_mouse_leave = true; // [false on mobile] better true if not touch device;
Lite.search_filter_enabled = true; // [true!] enable filtering slots type in the search widget; !requires auto_load_slot_types or manual set registered_slot_[in/out]_types and slot_types_[in/out]
Lite.search_show_all_on_open = true; // [true!] opens the results list when opening the search widget

Lite.show_node_tooltip = true; // [true!] show a tooltip with node property "tooltip" over the selected node
Lite.show_node_tooltip_use_descr_property = true; // enabled tooltip from desc when property tooltip not set

Lite.auto_load_slot_types = true; // [if want false; use true; run; get vars values to be statically set; than disable] nodes types and nodeclass association with node types need to be calculated; if dont want this; calculate once and set registered_slot_[in/out]_types and slot_types_[in/out]
/*// set these values if not using auto_load_slot_types
Lite.registered_slot_in_types = {}; // slot types for nodeclass
Lite.registered_slot_out_types = {}; // slot types for nodeclass
Lite.slot_types_in = []; // slot types IN
Lite.slot_types_out = []; // slot types OUT*/

Lite.alt_drag_do_clone_nodes = true; // [true!] very handy; ALT click to clone and drag the new node
Lite.do_add_triggers_slots = true; // [true!] will create and connect event slots when using action/events connections; !WILL CHANGE node mode when using onTrigger (enable mode colors); onExecuted does not need this
Lite.allow_multi_output_for_events = false; // [false!] being events; it is strongly reccomended to use them sequentially; one by one
Lite.middle_click_slot_add_default_node = true;  //[true!] allows to create and connect a ndoe clicking with the third button (wheel)
Lite.release_link_on_empty_shows_menu = true; //[true!] dragging a link to empty space will open a menu, add from list, search or defaults
Lite.pointerevents_method = "mouse"; // "mouse"|"pointer" use mouse for compatibility issues, touch will work only with pointer 
Lite.ctrl_shift_v_paste_connect_unselected_outputs = true; //[true!] allows ctrl + shift + v to paste nodes with the outputs of the unselected nodes connected with the inputs of the newly pasted nodes
Lite.backspace_delete = false;  // [false!] delete key is enough, don't mess with text edit and custom

Lite.actionHistory_enabled = true; // [true!] cntrlZ, cntrlY :: WIP testing
Lite.actionHistoryMaxSave = 40;

Lite.showCanvasOptions = true; // enable canvas options panel, customize in LiteGrpah.availableCanvasOptions

Lite.use_uuids = false; // why not? maybe not good for comparison?

/* -- EVENTS PROCESSING METHODS -- */

/* METHOD 1 ANCESTORS : EXECUTING ACTIONS BEFORE THE NEXT FRAME, AFFECTING INPUT NODES WILL BE REPROCESSED */
Lite.refreshAncestorsOnTriggers = true; //[true!]
Lite.refreshAncestorsOnActions = true; //[true!]
Lite.ensureUniqueExecutionAndActionCall = true; //[true!]

/* METHOD 2 DEFERRED ACTIONS */
Lite.use_deferred_actions = false; // disabling deferred