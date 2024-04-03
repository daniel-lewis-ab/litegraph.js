"use strict";
import { app as comfyApp } from "../scripts/app.js";
import { ComfyWidgets as customWidgets } from "../scripts/widgets.js";

const createComboOptions = (comboWidget, options) => {
  const optionsMenu = { "": { options: [] } };
  for (const option of options) {
    if (typeof option === "string") {
      optionsMenu[""].options.push({
        title: option,
        value: option,
        callback: () => {
          comboWidget.value = option;
          comboWidget.callback(option);
          comfyApp.graph.setDirtyCanvas(true);
        },
      });
    } else if (option.subfolder) {
      if (!optionsMenu[option.subfolder]) {
        const submenu = {
          title: option.subfolder,
          submenu: { options: [], title: option.subfolder },
        };
        optionsMenu[option.subfolder] = submenu.submenu;
        optionsMenu[""].options.push(submenu);
      }
      optionsMenu[option.subfolder].options.push({
        title: option.name,
        callback: () => {
          comboWidget.value = option.name;
          comboWidget.callback(option.name);
          comfyApp.graph.setDirtyCanvas(true);
        },
      });
    } else {
      optionsMenu[""].options.push({
        title: option.name,
        value: option.name,
        callback: () => {
          comboWidget.value = option.name;
          comboWidget.callback(option.name);
          comfyApp.graph.setDirtyCanvas(true);
        },
      });
    }
  }
  return optionsMenu[""].options;
};

const extendComboWidget = () => {
  const originalComboWidget = customWidgets.COMBO;
  customWidgets.COMBO = function (node, widgetDef, options) {
    const optionsData = options[0];
    const originalWidget = originalComboWidget.apply(this, arguments);

    if (optionsData.some((option) => typeof option === "object" && typeof option.name === "string")) {
      let currentValue = originalWidget.widget.value;
      let originalOptions = originalWidget.widget.options.values;
      let dynamicOptions = null;

      Object.defineProperty(originalWidget.widget.options, "values", {
        get() {
          if (!dynamicOptions) {
            dynamicOptions = createComboOptions(originalWidget.widget, originalOptions);
            dynamicOptions.findIndex = function (predicate) {
              for (let i = 0; i < this.length; i++) {
                const option = this[i];
                if (predicate(option.title)) return i;
              }
              return -1;
            };
          }
          return dynamicOptions;
        },
        set(newOptions) {
          originalOptions = newOptions;
          dynamicOptions = null;
        },
      });

      Object.defineProperty(originalWidget.widget, "value", {
        get() {
          if (originalWidget.widget) {
            const stack = new Error().stack;
            if (stack.includes("drawNodeWidgets") || stack.includes("saveImageExtraOutput")) {
              const defaultValue = currentValue || optionsData[0]?.name;
              if (typeof defaultValue === "string") {
                return defaultValue.slice(defaultValue.lastIndexOf("/") + 1);
              }
            }
          }
          return currentValue;
        },
        set(newValue) {
          if (!newValue?.submenu) {
            currentValue = newValue;
          }
        },
      });
    }
    return originalWidget;
  };
};

comfyApp.registerExtension({ name: "flowt.combos", init: extendComboWidget });