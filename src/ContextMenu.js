import { Lite } from "./Lite.js";

export class ContextMenu {

    /**
    * @constructor
    * @param {Array<Object>} values (allows object { title: "Nice text", callback: function ... })
    * @param {Object} options [optional] Some options:\
    * - title: title to show on top of the menu
    * - callback: function to call when an option is clicked, it receives the item information
    * - ignore_item_callbacks: ignores the callback inside the item, it just calls the options.callback
    * - event: you can pass a MouseEvent, this way the ContextMenu appears in that position
    *
    *   Rendering notes: This is only relevant to rendered graphs, and is rendered using HTML+CSS+JS.
    */
    constructor(values, options = {}) {
        this.options = options;
        options.scroll_speed ??= 0.1;
        this.menu_elements = [];

        this.#linkToParent();
        this.#validateEventClass();
        this.#createRoot();
        this.#bindEvents();
        this.setTitle(this.options.title);
        this.addItems(values);
        this.#insertMenu();
        this.#calculateBestPosition();
    }

    #createRoot() {
        const root = this.root = document.createElement("div");
        if (this.options.className) {
            root.className = this.options.className;
        }
        root.classList.add("litegraph","litecontextmenu","litemenubar-panel");
        root.style.minWidth = "80px";
        root.style.minHeight = "10px";
        return root;
    }

    #bindEvents() {
        const root = this.root;

        root.style.pointerEvents = "none";
        setTimeout(() => {
            root.style.pointerEvents = "auto";
        }, 100); // delay so the mouse up event is not caught by this element

        // this prevents the default context browser menu to open in case this menu was created when pressing right button
        root.addEventListener("pointerup", (e) => {
            // console.log("pointerevents: ContextMenu up root prevent");
            e.preventDefault();
            return true;
        });
        root.addEventListener("contextmenu", (e) => {
            if (e.button != 2) {
                // right button
                return false;
            }
            e.preventDefault();
            return false;
        });
        root.addEventListener("pointerdown", (e) => {
            // console.log("pointerevents: ContextMenu down");
            if (e.button == 2) {
                this.close();
                e.preventDefault();
                return true;
            }
        });
        root.addEventListener("wheel", (e) => {
            var pos = parseInt(root.style.top);
            root.style.top =
                (pos + e.deltaY * this.options.scroll_speed).toFixed() + "px";
            e.preventDefault();
            return true;
        });
        root.addEventListener("pointerenter", (_event) => {
            // console.log("pointerevents: ContextMenu enter");
            if (root.closing_timer) {
                clearTimeout(root.closing_timer);
            }
        });
    }

    #linkToParent() {
        const parentMenu = this.options.parentMenu;
        if (!parentMenu)
            return;
        if (parentMenu.constructor !== this.constructor) {
            console.error("parentMenu must be of class ContextMenu, ignoring it");
            this.options.parentMenu = null;
            return;
        }
        this.parentMenu = parentMenu;
        this.parentMenu.lock = true;
        this.parentMenu.current_submenu = this;
    }

    #validateEventClass() {
        if(!this.options.event)
            return;

        // use strings because comparing classes between windows doesnt work
        const eventClass = this.options.event.constructor.name;
        if ( eventClass !== "MouseEvent" &&
            eventClass !== "CustomEvent" &&
            eventClass !== "PointerEvent"
        ) {
            console.error(`Event passed to ContextMenu is not of type MouseEvent or CustomEvent. Ignoring it. (${eventClass})`);
            this.options.event = null;
        }
    }

    /**
     * Creates a title element if it doesn't have one.
     * Sets the title of the menu.
     * @param {string} title - The title to be set.
     */
    setTitle(title) {
        if (!title)
            return;
        this.titleElement ??= document.createElement("div");
        const element = this.titleElement;
        element.className = "litemenu-title";
        element.innerHTML = title;
        if(!this.root.parentElement)
            this.root.appendChild(element);
    }

    /**
     * Adds a set of values to the menu.
     * @param {Array<string|object>} values - An array of values to be added.
     */
    addItems(values) {

        for (let i = 0; i < values.length; i++) {
            let name = values[i];

            if (typeof name !== 'string') {
                name = name && name.content !== undefined ? String(name.content) : String(name);
            }

            let value = values[i];
            this.menu_elements.push(this.addItem(name, value, this.options));
        }
    }

    #insertMenu() {
        const doc = this.options.event?.target.ownerDocument ?? document;
        const parent = doc.fullscreenElement ?? doc.body;
        const root = this.root;
        const that = this;

        // Atlasan's code: @BUG: Variable names will mismatch
        if (Lite.context_menu_filter_enabled) {
            if(doc) {
                // TEXT FILTER by KEYPRESS
                // TODO FIX THIS :: need to remove correctly events !! getting multiple
                if(root.f_textfilter) {
                    doc.removeEventListener("keydown",root.f_textfilter,false);
                    doc.removeEventListener("keydown",root.f_textfilter,true);
                    root.f_textfilter = false;
                }
                root.f_textfilter = function(e) {
                    // console.debug("keyPressInsideContext",e,that,this,options);
                    if(that.current_submenu) {
                        // removing listeners is buggy, this prevent parent menus to process the key event
                        if( Lite.debug ) {
                            console.debug("Prevent filtering on ParentMenu",that);
                        }
                        return;
                    }
                    if(!that.allOptions) {
                        that.allOptions = that.menu_elements; // combo_options;
                        that.selectedOption = false;
                    }
                    if(!that.currentOptions) {
                        that.currentOptions = that.allOptions; // initialize filtered to all
                    }
                    if(!that.filteringText) {
                        that.filteringText = "";
                    }
                    if(e.key) {
                        var kdone = false;
                        // DBG("KeyEv",e.key);
                        switch(e.key) {
                            case "Backspace":
                                if(that.filteringText.length) {
                                    that.filteringText = that.filteringText.substring(0,that.filteringText.length-1);
                                    kdone = true;
                                }
                                break;
                            case "Escape":
                                // should close ContextMenu
                                if(root.f_textfilter) {
                                    doc.removeEventListener("keydown",root.f_textfilter,false);
                                    doc.removeEventListener("keydown",root.f_textfilter,true);
                                    root.f_textfilter = false;
                                }
                                that.close();
                                break;
                            case "ArrowDown":
                                do{
                                    that.selectedOption = that.selectedOption!==false
                                        ? Math.min(Math.max(that.selectedOption+1, 0), that.allOptions.length-1) // currentOptions vs allOptions
                                        : 0;
                                } while(that.allOptions[that.selectedOption]
                                        && that.allOptions[that.selectedOption].hidden
                                        && that.selectedOption < that.allOptions.length-1
                                );
                                // fix last filtered pos
                                if(that.allOptions[that.selectedOption] && that.allOptions[that.selectedOption].hidden) {
                                    that.selectedOption = that.currentOptions[that.currentOptions.length-1].menu_index;
                                }
                                kdone = true;
                                break;
                            case "ArrowUp":
                                do{
                                    that.selectedOption = that.selectedOption!==false
                                        ? Math.min(Math.max(that.selectedOption-1, 0), that.allOptions.length-1)
                                        : 0;
                                } while(that.allOptions[that.selectedOption]
                                        && that.allOptions[that.selectedOption].hidden
                                        && that.selectedOption > 0
                                );
                                // fix first filtered pos
                                if(that.allOptions[that.selectedOption] && that.allOptions[that.selectedOption].hidden) {
                                    if(that.currentOptions && that.currentOptions.length) {
                                        that.selectedOption = that.currentOptions[0].menu_index;
                                    }else{
                                        that.selectedOption = false;
                                    }
                                }
                                kdone = true;
                                break;
                            case "ArrowLeft":
                                // should close submenu and jump back to parent
                                // that.close(e, true);
                                // NEED restoring events and resetting current_submenu on child close ?
                                break;
                            case "ArrowRight": // right do same as enter
                            case "Enter":
                                if(that.selectedOption !== false) {

                                    if(that.allOptions[that.selectedOption]) {
                                        if( Lite.debug ) {
                                            console.debug("ContextElement simCLICK",that.allOptions[iO]);
                                        }
                                        // checking because of bad event removal :: FIX
                                        if(that.allOptions[that.selectedOption].do_click){
                                            that.allOptions[that.selectedOption].do_click(that.options.event, ignore_parent_menu);
                                        }
                                    }else{
                                        if( Lite.debug ) {
                                            console.debug("ContextElement selection wrong",that.selectedOption);
                                        }
                                        // selection fix when filtering
                                        that.selectedOption = that.selectedOption!==false
                                            ? Math.min(Math.max(that.selectedOption, 0), that.allOptions.length-1) // currentOptions vs allOptions
                                            : 0;
                                    }

                                }else{
                                    if(that.filteringText.length) {
                                        for(var iO in that.allOptions) {
                                            if( that.allOptions[iO].style.display !== "none" // filtering for visible
                                                && !(that.allOptions[iO].classList+"").includes("separator")
                                                // && that.allOptions[iO].textContent !== "Add Node"
                                                && that.allOptions[iO].textContent !== "Search"
                                            ) {
                                                if( Lite.debug ) {
                                                    console.debug("ContextElement simCLICK",that.allOptions[iO]);
                                                }
                                                // try cleaning parent listeners
                                                if(root.f_textfilter) {
                                                    if(doc) {
                                                        doc.removeEventListener('keydown',root.f_textfilter,false);
                                                        doc.removeEventListener('keydown',root.f_textfilter,true);
                                                        if( Lite.debug ) {
                                                            console.debug("Cleaned ParentContextMenu listener",doc,that);
                                                        }
                                                    }
                                                }
                                                var ignore_parent_menu = false; // ?
                                                that.allOptions[iO].do_click(e, ignore_parent_menu); // .click();
                                                // return; //break;
                                                break;
                                            }
                                        }
                                    }
                                }
                                kdone = true;
                                break;
                            default:
                                if( Lite.debug ) {
                                    console.debug("ContextMenu filter: keyEvent",e.keyCode,e.key);
                                }
                                if (String.fromCharCode(e.key).match(/(\w|\s)/g)) {
                                    // pressed key is a char
                                } else {
                                    // pressed key is a non-char
                                    // DBG ("--not char break--")
                                    // do not return
                                    // ?? kdone = true;
                                }
                                break;
                        }
                        if(!kdone && e.key.length == 1) {
                            that.filteringText += e.key;
                            if(that.parentMenu) {
                                // that.lock = true; // ??
                                // that.parentMenu.close(e, true); // clean parent ?? lock ??
                            }
                        }
                    }

                    // process text filtering
                    if(that.filteringText && that.filteringText!=="") {
                        var aFilteredOpts = [];
                        that.currentOptions = []; // reset filtered
                        for(var iO in that.allOptions) {
                            // if(that.allOptions[iO].textContent){ //.startWith(that.filteringText)){
                            var txtCont = that.allOptions[iO].textContent;
                            var doesContainW = txtCont.toLocaleLowerCase().includes(that.filteringText.toLocaleLowerCase());
                            var isStartW = txtCont.toLocaleLowerCase().startsWith(that.filteringText.toLocaleLowerCase());
                            var wSplits = txtCont.split("/");
                            var isStartLast = false;
                            // DBG("check splits",wSplits);
                            isStartLast = ( (wSplits.length>1) && wSplits[wSplits.length-1].toLocaleLowerCase().startsWith(that.filteringText.toLocaleLowerCase()) )
                                                || ( wSplits.length==1 && isStartW );
                            var isExtra = (that.allOptions[iO].classList+"").includes("separator")
                                                // || txtCont === "Add Node"
                                                || txtCont === "Search";
                            that.allOptions[iO].menu_index = iO; // original allOptions index
                            if(doesContainW && !isExtra) {
                                aFilteredOpts.push(that.allOptions[iO]);
                                that.allOptions[iO].style.display = "block";
                                that.allOptions[iO].hidden = false;
                                that.currentOptions.push(that.allOptions[iO]); // push filtered options
                                that.allOptions[iO].filtered_index = that.currentOptions.length-1; // filtered index
                            }else{
                                that.allOptions[iO].hidden = true;
                                that.allOptions[iO].style.display = "none";
                                that.allOptions[iO].filtered_index = false;
                            }
                            if (isStartLast) {
                                // DBG("isStartLast"+that.filteringText,that.allOptions[iO].textContent);
                                that.allOptions[iO].style.fontWeight = "bold";
                            }else if(isStartW) {
                                // DBG("isStartW"+that.filteringText,that.allOptions[iO].textContent);
                                that.allOptions[iO].style.fontStyle = "italic";
                            }
                            // }
                        }
                        // selection clamp fix when filtering
                        that.selectedOption = that.selectedOption!==false
                            ? Math.min(Math.max(that.selectedOption, 0), that.allOptions.length-1) // currentOptions vs allOptions
                            : 0
                        ;
                        // fix first filtered pos
                        if(that.allOptions[that.selectedOption] && that.allOptions[that.selectedOption].hidden && that.currentOptions.length) {
                            that.selectedOption = that.currentOptions[0].menu_index;
                        }
                    }else{
                        aFilteredOpts = that.allOptions; // combo_options
                        that.currentOptions = that.allOptions; // no filtered options
                        for(var iO in that.allOptions) {
                            that.allOptions[iO].style.display = "block";
                            that.allOptions[iO].style.fontStyle = "inherit";
                            that.allOptions[iO].style.fontWeight = "inherit";
                            that.allOptions[iO].hidden = false;
                            that.allOptions[iO].filtered_index = false;
                            that.allOptions[iO].menu_index = iO;
                        }
                    }
                    // process selection (up down)
                    var hasSelected = that.selectedOption !== false;
                    if(hasSelected) {
                        if( Lite.debug ) {
                            console.debug("ContextMenu selection: ",that.selectedOption);
                        }
                        for(var iO in that.allOptions) {
                            var isSelected = that.selectedOption+"" === iO+"";
                            if( Lite.debug ) {
                                // console.debug("ContextMenu check sel: ",that.selectedOption,iO);
                            }
                            if(isSelected) {
                                // that.allOptions[iO].style.backgroundColor = "#333";
                                that.allOptions[iO].classList.add("selected");
                                // that.allOptions[iO].style.fontStyle = "italic";
                            }else{
                                that.allOptions[iO].classList.remove("selected");
                                // that.allOptions[iO].style.backgroundColor = "none";
                            }
                        }
                    }

                    // height reset
                    var body_rect = document.body.getBoundingClientRect();
                    var root_rect = root.getBoundingClientRect();
                    root.style.top = that.top_original + "px";
                    // if (body_rect.height && top > body_rect.height - root_rect.height - 10) {
                    // var new_top = body_rect.height - root_rect.height - 10;
                    // root.style.top = this.top_original + "px";
                    // }

                    // DBG("filtered for ",that.filteringText);

                    // do not return, do not prevent
                    // e.preventDefault();
                    // return false;
                }
                doc.addEventListener(
                    "keydown"
                    ,root.f_textfilter
                    ,true,
                );
            }else{
                console.warning("NO root document to add context menu and event",doc,options);
            }
        }

        parent.appendChild(this.root);
    }

    #calculateBestPosition() {
        const options = this.options;
        const root = this.root;

        let left = options.left || 0;
        let top = options.top || 0;
        this.top_original = top;

        if (options.event) {
            left = options.event.clientX - 10;
            top = options.event.clientY - 10;

            if (options.title) {
                top -= 20;
            }
            this.top_original = top;

            if (options.parentMenu) {
                const rect = options.parentMenu.root.getBoundingClientRect();
                left = rect.left + rect.width;
            }

            const body_rect = document.body.getBoundingClientRect();
            const root_rect = root.getBoundingClientRect();
            if(body_rect.height === 0)
                console.error("document.body height is 0. That is dangerous, set html,body { height: 100%; }");

            if (body_rect.width && left > body_rect.width - root_rect.width - 10) {
                left = body_rect.width - root_rect.width - 10;
            }
            if (body_rect.height && top > body_rect.height - root_rect.height - 10) {
                top = body_rect.height - root_rect.height - 10;
            }
        }

        root.style.left = `${left}px`;
        root.style.top = `${top}px`;

        if (options.scale) {
            root.style.transform = `scale(${options.scale})`;
        }
    }

    /**
     * Adds an item to the menu.
     * @param {string} name - The name of the item.
     * @param {object | null} value - The value associated with the item.
     * @param {object} [options={}] - Additional options for the item.
     * @returns {HTMLElement} - The created HTML element representing the added item.
     */
    addItem(name, value, options = {}) {

        const element = document.createElement("div");
        element.className = "litemenu-entry submenu";

        let disabled = false;

        if (value === null) {
            element.classList.add("separator");
        } else {
            element.innerHTML = value?.title ?? name;
            element.value = value;

            if (value) {
                if (value.disabled) {
                    disabled = true;
                    element.classList.add("disabled");
                }
                if (value.submenu || value.has_submenu) {
                    element.classList.add("has_submenu");
                }
            }

            if (typeof value == "function") {
                element.dataset["value"] = name;
                element.onclick_callback = value;
            } else {
                element.dataset["value"] = value;
            }

            if (value.className) {
                element.className += " " + value.className;
            }
        }

        this.root.appendChild(element);
        if (!disabled) {
            element.addEventListener("click", handleMenuItemClick);
        }
        if (!disabled && options.autoopen) {
            element.addEventListener("pointerenter",(event) => {
                const value = this.value;
                if (!value || !value.has_submenu) {
                    return;
                }
                // if it is a submenu, autoopen like the item was clicked
                handleMenuItemClick.call(this, event);
            });
        }

        var that = this;

        function handleMenuItemClick(event) {
            const value = this.value;
            let closeParent = true;

            if(Lite.debug)
                console.debug("ContextMenu handleMenuItemClick",value,options,closeParent,this.current_submenu,this);

            // Close any current submenu
            that.current_submenu?.close(event);

            // Execute global callback
            if (options.callback) {
                if(Lite.debug)
                    console.debug("ContextMenu handleMenuItemClick callback",this,value,options,event,that,options.node);

                const globalCallbackResult = options.callback.call(this, value, options, event, that, options.node);
                if (globalCallbackResult === true) {
                    closeParent = false;
                }
            }

            // Handle special cases
            if (value) {
                if (value.callback && !options.ignore_item_callbacks && value.disabled !== true) {

                    if(Lite.debug)
                        console.debug("ContextMenu using value callback and !ignore_item_callbacks",this,value,options,event,that,options.node);
                    const itemCallbackResult = value.callback.call(this, value, options, event, that, options.extra);
                    if (itemCallbackResult === true) {
                        closeParent = false;
                    }
                }
                if (value.submenu) {
                    if(Lite.debug)
                        console.debug("ContextMenu SUBMENU",this,value,value.submenu.options,e,that,options);

                    if (!value.submenu.options) {
                        throw new Error("ContextMenu submenu needs options");
                    }
                    // Recursively create submenu
                    new that.constructor(value.submenu.options, {
                        callback: value.submenu.callback,
                        event: event,
                        parentMenu: that,
                        ignore_item_callbacks: value.submenu.ignore_item_callbacks,
                        title: value.submenu.title,
                        extra: value.submenu.extra,
                        autoopen: options.autoopen,
                    });
                    closeParent = false;
                }
            }

            // Close parent menu if necessary and not locked
            if (closeParent && !that.lock) {
                that.close();
            }
        }
        return element;
    }

    /**
     * Closes this menu.
     * @param {Event} [e] - The event that triggered the close action.
     * @param {boolean} [ignore_parent_menu=false] - Whether to ignore the parent menu when closing.
     */
    close(e, ignore_parent_menu) {

        if(this.root.f_textfilter) {
            let doc = document;
            doc.removeEventListener('keydown',this.root.f_textfilter,true);
            doc.removeEventListener('keydown',this.root.f_textfilter,false);
            if (e && e.target) {
                doc = e.target.ownerDocument;
            }
            if (!doc) {
                doc = document;
            }
            doc.removeEventListener('keydown',this.root.f_textfilter,true);
            doc.removeEventListener('keydown',this.root.f_textfilter,false);
        }

        if (this.parentMenu && !ignore_parent_menu) {
            this.parentMenu.lock = false;
            this.parentMenu.current_submenu = null;
            if (e === undefined) {
                this.parentMenu.close();
            } else if (
                e &&
                !ContextMenu.isCursorOverElement(e, this.parentMenu.root)
            ) {
                ContextMenu.trigger(this.parentMenu.root, "pointerleave", e);
            }
        }
        this.current_submenu?.close(e, true);

        if (this.root.closing_timer) {
            clearTimeout(this.root.closing_timer);
        }

        if (this.root.parentNode) {
            this.root.parentNode.removeChild(this.root);
        }
    }

    /**
     * Closes all open ContextMenus in the specified window.
     * @param {Window} [ref_window=window] - The window object to search for open menus.
     */
    static closeAll = (ref_window = window) => {
        const elements = ref_window.document.querySelectorAll(".litecontextmenu");
        if (!elements.length)
            return;

        elements.forEach((element) => {
            if (element.close) {
                element.close();
            } else {
                element.parentNode?.removeChild(element);
            }
        });
    };

    /**
     * Triggers an event on the specified element with the given event name and parameters.
     * @param {HTMLElement} element - The element on which to trigger the event.
     * @param {string} event_name - The name of the event to trigger.
     * @param {Object} params - Additional parameters to include in the event.
     * @param {HTMLElement} origin - The origin of the event <currently not supported as CustomEvent can't have a target!>
     * @returns {CustomEvent} - The created CustomEvent instance.
     * @BUG: Probable bug related to params, origin not being configured/populated correctly
     */
    static trigger(element, event_name, params, origin) {
        const evt = new CustomEvent(event_name, {
            bubbles: true,
            cancelable: true,
            detail: params,
        });
        Object.defineProperty(evt, 'target', { value: origin });
        if (element.dispatchEvent) {
            element.dispatchEvent(evt);
        } else if (element.__events) {
            element.__events.dispatchEvent(evt);
        }
        return evt;
    }

    // returns the top most menu
    getTopMenu() {
        return this.options.parentMenu?.getTopMenu() ?? this;
    }

    getFirstEvent() {
        return this.options.parentMenu?.getFirstEvent() ?? this.options.event;
    }

    static isCursorOverElement(event, element) {
        return Lite.isInsideRectangle(event.clientX, event.clientY, element.left, element.top, element.width, element.height);
    }
}
