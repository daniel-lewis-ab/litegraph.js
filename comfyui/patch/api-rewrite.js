'use strict';
import { extensions } from './extensions.js';
import { nodeDefinitions } from './object_info.js';
import { opaque } from './opaque.js';

const refreshInterval = 1000;
const apiHostMappings = {
  'http://localhost:1218': 'http://localhost:8000/api',
  'https://iframe-dev.getsalt.ai': 'https://salt-api-dev.getsalt.ai/api',
  'https://iframe.getsalt.ai': 'https://salt-api-prod.getsalt.ai/api',
};
const selectedCategories = [];
const opaqueNodeSet = new Set(opaque);

class ComfyGraphPatcher extends EventTarget {
  constructor() {
    super();
    this.registeredEvents = new Set([
      'status',
      'progress',
      'executing',
      'executed',
      'execution_start',
      'execution_error',
      'execution_cached',
    ]);
    this.models = [{ name: '' }];
    this.inputs = [];
    this.apiHost = location.host;
    this.apiBase = location.pathname.split('/').slice(0, -1).join('/');
    this.workflow_id = '';
    this.createIFrameCommunication(false);
  }

  handlePreviewData = (previewData) => {
    this.dispatchEvent(new CustomEvent('b_preview', { detail: previewData }));
  };

  postMessageToParent = (type, data) => {
    window.parent.postMessage({ internal: { type, data } }, '*');
  };

  handleMessage = (event) => {
    const message = event.data;
    if (
      message.event &&
      this.registeredEvents.has(message.event) &&
      this.dispatchEvent(
        new CustomEvent(message.event, {
          detail: message.event === 'executing' ? message.data.node : message.data,
        }),
      )
    );
    if (
      message.event === 'validation_error' &&
      ((this.app.lastNodeErrors = message.data?.node_errors || []),
      this.app.lastNodeErrors.length > 0 && this.app.canvas.draw(true, true))
    );
    if (message.internal) {
      const internalMessage = message.internal;
      if (internalMessage.data.previews) {
        this.handlePreviewData(internalMessage.data);
      }
      switch (internalMessage.type) {
        case 'load_prompt': {
          if (internalMessage.data && internalMessage.data.prompt) {
            const loadPrompt = () => {
              if (internalMessage.data.prompt.viewport) {
                const { x, y, scale } = internalMessage.data.prompt.viewport;
                this.app.canvas.setZoom(scale);
                this.app.canvas.ds.offset = new Float32Array([x, y]);
                this.app.canvas.draw(true, true);
              }
              internalMessage.data.read_only
                ? ((this.readOnly = true), this.disableEditing())
                : setInterval(this.sendGraphData, refreshInterval);
              this.updateNodeDefinitions();
              this.loadCategories();
            };
            this.workflow_id = internalMessage.data.workflow_id;
            this.app
              .loadGraphData(internalMessage.data.prompt, true)
              .then(() => {
                loadPrompt();
                this.postMessageToParent('prompt_loaded');
              })
              .catch(() => {
                loadPrompt();
                this.postMessageToParent('prompt_load_error');
              });
          }
          break;
        }
        case 'get_prompt': {
          this.app
            .graphToPrompt()
            .then((prompt) => {
              this.postMessageToParent('got_prompt', prompt);
              this.handlePromptGenerated(prompt);
            })
            .catch(() => this.postMessageToParent('prompt_gen_error'));
          break;
        }
        case 'refresh_defs': {
          if (
            (internalMessage.data.models && (this.models = internalMessage.data.models),
            internalMessage.data.inputs && (this.inputs = internalMessage.data.inputs),
            this.getNodeDefs().then((nodeDefs) => {
              this.app.registerNodesFromDefs(nodeDefs).then(() => {
                this.updateNodeDefinitions();
              });
            }))
          );
          break;
        }
        case 'export': {
          this.app
            .graphToPrompt()
            .then((prompt) => this.postMessageToParent('download_prompt', prompt.workflow))
            .catch((error) => this.postMessageToParent('prompt_gen_error', error?.message));
          break;
        }
        case 'import': {
          const fileInput = document.getElementById('comfy-file-input');
          fileInput && fileInput.click();
          break;
        }
        case 'clear': {
          this.app.clean();
          this.app.graph.clear();
          break;
        }
        case 'undo': {
          const undoEvent = new KeyboardEvent('keydown', {
            key: 'z',
            ctrlKey: true,
          });
          window.dispatchEvent(undoEvent);
          break;
        }
        case 'redo': {
          const redoEvent = new KeyboardEvent('keydown', {
            key: 'y',
            ctrlKey: true,
          });
          window.dispatchEvent(redoEvent);
          break;
        }
        case 'zoomIn': {
          this.app.canvas.setZoom(this.app.canvas.ds.scale + 0.2);
          break;
        }
        case 'zoomOut': {
          this.app.canvas.setZoom(this.app.canvas.ds.scale - 0.2);
          break;
        }
        case 'resetZoom': {
          this.resetZoom();
          break;
        }
        case 'openEditorSettings': {
          this.app.ui.settings.show();
          break;
        }
        case 'arrange': {
          this.app.graph.arrange();
          break;
        }
        case 'status': {
          if (internalMessage.data.sid) {
            this.clientId = internalMessage.data.sid;
            window.name = this.clientId;
          }
          this.dispatchEvent(new CustomEvent('status', { detail: internalMessage.data.status }));
          break;
        }
        case 'progress': {
          this.dispatchEvent(new CustomEvent('progress', { detail: internalMessage.data }));
          break;
        }
        case 'executing': {
          this.dispatchEvent(new CustomEvent('executing', { detail: internalMessage.data.node }));
          break;
        }
        case 'executed': {
          this.dispatchEvent(new CustomEvent('executed', { detail: internalMessage.data }));
          break;
        }
        case 'execution_start': {
          this.dispatchEvent(new CustomEvent('execution_start', { detail: internalMessage.data }));
          break;
        }
        case 'execution_error': {
          this.dispatchEvent(new CustomEvent('execution_error', { detail: internalMessage.data }));
          break;
        }
        case 'execution_cached': {
          this.dispatchEvent(new CustomEvent('execution_cached', { detail: internalMessage.data }));
          break;
        }
        default:
          console.warn(`Unknown event sent with type ${internalMessage.type}`);
      }
    }
  };

  loadCategories = async () => {
    try {
      if (selectedCategories.length === 0) return;
      this.app.graph.clear();
      const nodeDefs = await this.getNodeDefs();
      for (const nodeType in nodeDefs) {
        const nodeDef = nodeDefs[nodeType];
        for (const category of selectedCategories) {
          if (nodeDef.category.startsWith(category)) {
            const node = window.LiteGraph.createNode(nodeType);
            if (!node) break;
            this.app.graph.add(node);
            break;
          }
        }
      }
      this.app.graph.arrange();
    } catch (error) {
      console.error(error);
    }
  };

  disableEditing = () => {
    const noop = () => null;
    const graphPrototype = Object.getPrototypeOf(this.app.graph);
    Object.assign(graphPrototype, {
      getNodeOnPos: () => null,
      getGroupOnPos: () => null,
      processContextMenu: noop,
    });
    Object.setPrototypeOf(this.app.graph, graphPrototype);

    const canvasPrototype = Object.getPrototypeOf(this.app.canvas);
    Object.assign(canvasPrototype, {
      processContextMenu: noop,
      showSearchBox: noop,
      showLinkMenu: noop,
      processKey: noop,
    });
    Object.setPrototypeOf(this.app.canvas, canvasPrototype);

    Array.from(document.querySelectorAll('[type="file"]')).forEach((input) => input.remove());
    Array.from(document.querySelectorAll('.comfy-modal')).forEach((modal) => modal.remove());
    Array.from(document.querySelectorAll('.comfy-menu')).forEach((menu) => menu.remove());
    Array.from(document.querySelectorAll('.comfy-settings-dialog')).forEach((settingsDialog) =>
      settingsDialog.remove(),
    );
    Array.from(document.querySelectorAll('input')).forEach((input) => {
      input.style.pointerEvents = 'none';
    });
    Array.from(document.querySelectorAll('textarea')).forEach((textarea) => {
      textarea.style.pointerEvents = 'none';
    });
    Array.from(document.querySelectorAll('select')).forEach((select) => {
      select.style.pointerEvents = 'none';
    });

    document.addEventListener(
      'drop',
      (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      true,
    );
    document.addEventListener(
      'paste',
      (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      true,
    );
    document.addEventListener(
      'copy',
      (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      true,
    );

    this.resetZoom();
  };

  sendGraphData = () => {
    const [offsetX, offsetY] = this.app.canvas.ds.offset;
    const scale = this.app.canvas.ds.scale;
    const serializedGraph = this.app.graph.serialize();
    serializedGraph.viewport = { x: offsetX, y: offsetY, scale };
    this.app.graphToPrompt().then((promptData) => {
      this.postMessageToParent('graph_data', { content: serializedGraph, api_content: promptData.output });
    });
  };

  updateNodeDefinitions = async () => {
    const nodeDefs = await this.getNodeDefs();
    for (const nodeType in window.LiteGraph.registered_node_types) {
      const registeredNode = window.LiteGraph.registered_node_types[nodeType];
      const nodeDef = nodeDefs[nodeType];
      if (nodeDef) {
        registeredNode.nodeData = nodeDef;
      }
    }
    for (let nodeId in this.app.graph._nodes) {
      const node = this.app.graph._nodes[nodeId];
      const nodeDef = nodeDefs[node.type];
      if (typeof node.refreshComboInNode === 'function' && node.refreshComboInNode(nodeDefs));
      if (nodeDef) {
        for (const widgetName in node.widgets) {
          const widget = node.widgets[widgetName];
          if (widget.type === 'combo' && nodeDef.input.required[widget.name] !== undefined) {
            widget.options.values = nodeDef.input.required[widget.name][0];
          }
        }
      }
    }
  };

  handlePromptGenerated = (prompt) => {
    this.app.lastNodeErrors = null;
    this.app.canvas.draw(true, true);
    for (const node of prompt.workflow.nodes) {
      const graphNode = this.app.graph.getNodeById(node.id);
      if (graphNode.widgets) {
        for (const widget of graphNode.widgets) {
          if (widget.afterQueued) {
            widget.afterQueued();
          }
        }
      }
    }
  };

  handleMissingNodes = (missingNodes) => {
    if (missingNodes.length > 0) {
      this.postMessageToParent(
        'missing_nodes',
        Array.from(new Set(missingNodes.filter((node) => typeof node === 'string'))),
      );
    }
  };

  registerMissingNodesHandler = () => {
    this.app.showMissingNodesError = this.handleMissingNodes;
  };

  initWithApp = async (comfyApp) => {
    this.app = comfyApp;
    this.registerMissingNodesHandler();
    window.addEventListener('message', this.handleMessage);
    this.postMessageToParent('loaded');
  };

  apiURL = (path) => {
    if (path.startsWith('/view')) {
      const params = new URLSearchParams(path.split('?')[1]);
      if (params.get('file_url')) {
        return params.get('file_url');
      }
      if (params.get('filename')) {
        let fileName = params.get('filename');
        if (params.get('subfolder')) {
          fileName = params.get('subfolder') + '/' + fileName;
        }
        if (apiHostMappings[window.location.origin]) {
          return `${apiHostMappings[window.location.origin]}/v1/workflows/${this.workflow_id}/assets/resolve?file_path=${encodeURIComponent(fileName)}`;
        }
      }
    }
    return this.apiBase + path;
  }

  createResponse = (data, error) => ({
    status: error ? 500 : 200,
    json: () => Promise.resolve(data),
  });

  uploadFile = (file, subdir = 'editor') =>
    new Promise((resolve) => {
      try {
        const handleMessage = (event) => {
          const message = event.data;
          if (message && message.internal) {
            const internalMessage = message.internal;
            if (typeof internalMessage.data === 'object' && internalMessage.data.name === file.name) {
              if (internalMessage.type === 'upload_done') {
                resolve(this.createResponse({ name: file.name, subfolder: subdir }));
              } else if (internalMessage.type === 'upload_rejected') {
                resolve(this.createResponse(null, true));
              }
              window.removeEventListener('message', handleMessage);
            }
          }
        };
        window.addEventListener('message', handleMessage);
        subdir = subdir || 'editor';
        this.postMessageToParent('upload', { file, subdir});
      } catch (error) {
        console.error(error);
        resolve(this.createResponse(null, true));
      }
    });

  fetchApi = async (path, options) => {
    if (path === '/mtb/debug') {
      return this.createResponse({});
    } else if ((path === '/upload/image' || path === '/upload/mask') && !this.readOnly) {
      const imageName = options.body.get('image')?.name;
      if (/\.DS_Store|__MACOSX/.test(imageName)) {
        return this.createResponse({
          file: imageName,
          subfolder: options.body.get('subfolder') || 'editor',
        });
      } else {
        return await this.uploadFile(options.body.get('image'), options.body.get('subfolder'));
      }
    } else if (path === '/impact/wildcards/list') {
      return this.createResponse([]);
    } else if (path === '/jovimetrix/config') {
      return this.createResponse({});
    } else {
      return fetch(this.apiURL(path), options);
    }
  };

  addEventListener = (eventName, listener, options) => {
    super.addEventListener(eventName, listener, options);
    this.registeredEvents.add(eventName);
  };

  getExtensions = async () => {
    const ext = extensions.filter((path) => !path.endsWith('impact-sam-editor.js')).map((path) => path);
    return ext;
  };

  getEmbeddings = async () => [];

  replaceSpecialValues = (definitions) => {
    for (const nodeType in definitions) {
      const definition = definitions[nodeType];
      if (Array.isArray(definition) && Array.isArray(definition[0])) {
        for (let i = 0; i < definition[0].length; i++) {
          if (definition[0][i] === '__models__') {
            definitions[nodeType] = [[...definition[0].slice(0, i), ...this.models], ...definition.slice(1)];
          } else if (definition[0][i] === '__inputs__') {
            definitions[nodeType] = [[...definition[0].slice(0, i), ...this.inputs], ...definition.slice(1)];
          } else if (definition[0][i] === '__embeds__') {
            definitions[nodeType] = [
              [
                ...definition[0].slice(0, i),
                ...this.inputs.filter((input) => input.startsWith('embeddings/')).map((input) => input.slice(11)),
              ],
              ...definition.slice(1),
            ];
          }
        }
      }
    }
    return definitions;
  };

  resetZoom = () => {
    const [minX, minY, maxX, maxY] = this.app.graph._nodes.reduce(
      (bounds, node) => {
        const nodeMinX = node.pos[0];
        const nodeMinY = node.pos[1];
        if (nodeMinX < bounds[0]) bounds[0] = nodeMinX;
        if (nodeMinY < bounds[1]) bounds[1] = nodeMinY;

        const [, , nodeMaxX, nodeMaxY] = node.getBounding();
        const nodeMaxRight = nodeMinX + nodeMaxX;
        const nodeMaxBottom = nodeMinY + nodeMaxY;
        if (nodeMaxRight > bounds[2]) bounds[2] = nodeMaxRight;
        if (nodeMaxBottom > bounds[3]) bounds[3] = nodeMaxBottom;

        return bounds;
      },
      [99999, 99999, -99999, -99999],
    );

    const padding = 50;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    const offsetX = -minX;
    const offsetY = -minY;

    this.app.canvas.setZoom(1);
    this.app.canvas.ds.offset = new Float32Array([offsetX, offsetY]);
    this.app.canvas.draw(true, true);
  };

  getNodeDefs = async () => {
    const nodeDefs = {};
    for (const [nodeType, nodeDef] of Object.entries(nodeDefinitions)) {
      if (!opaqueNodeSet.has(nodeType)) {
        if (nodeDef.input) {
          let newNodeDef = { ...nodeDef, input: {} };
          if (nodeDef.input.required) {
            newNodeDef.input.required = this.replaceSpecialValues({
              ...nodeDef.input.required,
            });
          }
          if (nodeDef.input.optional) {
            newNodeDef.input.optional = this.replaceSpecialValues({
              ...nodeDef.input.optional,
            });
          }
          nodeDefs[nodeType] = newNodeDef;
        } else {
          nodeDefs[nodeType] = nodeDef;
        }
      }
    }
    return nodeDefs;
  };

  getItems = async (itemType) => (itemType === 'queue' ? { Running: [], Pending: [] } : { History: [] });

  getSystemStats = async () => ({});

  queuePrompt = async (number, workflow) => {
    const body = {
      client_id: this.clientId,
      prompt: output,
      extra_data: { extra_pnginfo: { workflow } },
    };

    if (number === -1) {
      body.front = true;
    } else if (number != 0) {
      body.number = number;
    }

    // TODO This doesn't return anything, res will always be undefined
    const res = this.postMessageToParent({ type: 'prompt', data: body });

    if (res.status !== 200) {
      throw {
        response: await res.json(),
      };
    }

    return await res.json();
  };

  init = () => {};

  deleteItem = async (_, __) => {};

  clearItems = async (_) => {};

  interrupt = async () => {};

  getUserConfig = async () => ({ storage: 'browser', migrated: true });

  storeSetting = async () => this.createResponse({});

  createIFrameCommunication = (isReconnect) => {
    let opened = false;
    let existingSession = window.name;
    if (existingSession) {
      existingSession = '?clientId=' + existingSession;
    }

    window.addEventListener('webSocketMessage', (event) => {
      try {
        if (event.data instanceof ArrayBuffer) {
          const view = new DataView(event.data);
          const eventType = view.getUint32(0);
          const buffer = event.data.slice(4);
          switch (eventType) {
            case 1:
              const view2 = new DataView(event.data);
              const imageType = view2.getUint32(0);
              let imageMime;
              switch (imageType) {
                case 1:
                default:
                  imageMime = 'image/jpeg';
                  break;
                case 2:
                  imageMime = 'image/png';
              }
              const imageBlob = new Blob([buffer.slice(4)], {
                type: imageMime,
              });
              window.dispatchEvent(new CustomEvent('b_preview', { detail: imageBlob }));
              break;
            default:
              throw new Error(`Unknown binary websocket message of type ${eventType}`);
          }
        }
      } catch (error) {
        console.warn('Unhandled message:', event.data, error);
      }
    });
  };
}
export const api = new ComfyGraphPatcher();
