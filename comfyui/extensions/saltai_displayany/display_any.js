import { app } from "../../scripts/app.js";
import { ComfyWidgets } from "../../scripts/widgets.js";

// partly shamelessly ripped from rgthree, appreciate it, was MIT licensed
let hasShownAlertForUpdatingInt = false;
app.registerExtension({
    name: "SaltDisplayAny",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "SaltDisplayAny") {

            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                onNodeCreated?.apply(this, arguments);
                this.showValueWidget = ComfyWidgets["STRING"](this, "output", ["STRING", { multiline: true }], app).widget;
                this.showValueWidget.inputEl.readOnly = true;
            };

            const onExecuted = nodeType.prototype.onExecuted;
            nodeType.prototype.onExecuted = function (message) {
                onExecuted?.apply(this, arguments);
                if(Array.isArray(message.text)){
                    this.showValueWidget.value = message.text.join("");
                } else if(message.text) {
                    JSON.stringify(message.text);
                } else {
                    JSON.stringify(message);
                }   
            };
        }
    },
});