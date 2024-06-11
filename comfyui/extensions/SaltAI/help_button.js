import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";
import { data } from "./help_data.js";

// Declaration of Documentation class
class Documentation {
	static first = false;
	static dataMap = new Map();

	static async setup() {
		Documentation.dataMap.clear();

		data
			.split("\n")
			.map((line) => line.split(","))
			.forEach(([key, value]) => Documentation.dataMap.set(key, value));
	}

	static getDocumentationPack(comfyClass) {
		return Documentation.dataMap.get(comfyClass);
	}
}

(function() {
	// Check if the Documentation class exists or the HelpButton extension is already loaded
	if (app.extensions.find(e => e.name === 'SaltAI.HelpButton')) {
		return;
	}

	// Extension registration
	const ext = {
		name: "SaltAI.HelpButton",
		init(app) {
			console.log("Initializing Documentation class for Help");
			Documentation.setup();

			// Hook into existing node drawing mechanism
			const origDrawNodeShape = LGraphCanvas.prototype.drawNodeShape;
			LGraphCanvas.prototype.drawNodeShape = function(node, ctx, size, fgcolor, bgcolor, selected, mouse_over) {
				const result = origDrawNodeShape.apply(this, arguments);
				if (!node || node.flags.collapsed) return result;

				const documentation = Documentation.getDocumentationPack(
					node.comfyClass
				);
				if (!documentation) return result;

				node.helpRect = new DOMRect(node.size[0]-22, -34, 27, 24);

				ctx.font = "11px sans";
				ctx.fillText("?", parseInt(node.size[0])-11, -18);

				ctx.lineWidth = 1;
				ctx.strokeStyle = "#444";
				ctx.beginPath(); // Start a new path
				ctx.moveTo(node.size[0]-18, -30);
				ctx.lineTo(node.size[0]-18, -14);
				ctx.lineTo(node.size[0]+1, -14);
				ctx.stroke();

				node.graph?.setDirtyCanvas(true);
				return result;
			};
		},
		nodeCreated(node, app) {
			const documentationPack = Documentation.getDocumentationPack(
				node.comfyClass
			);
			if (!documentationPack) return;

			node.onMouseMove = function(event, pos, canvas) {
				if (this.flags.collapsed || !isInside(pos)) return;

				node.onMouseDown = function(event, pos, canvas) {
					if (!isInside(pos)) return false;
					const url = new URL(
						`./${documentationPack}/Nodes/${this.comfyClass}`,
						"https://docs.getsalt.ai/md/"
					);
					window.open(url);
					event.preventDefault();
					return true;
				};
			};

			function isInside(pos) {
				return node.helpRect.x <= pos[0] && pos[0] <= node.helpRect.x + node.helpRect.width &&
					   node.helpRect.y <= pos[1] && pos[1] <= node.helpRect.y + node.helpRect.height;
			}
		}
	};

	app.registerExtension(ext);

})();