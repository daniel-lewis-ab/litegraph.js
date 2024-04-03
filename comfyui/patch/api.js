'use strict';
import { extensions as h } from './extensions.js';
import { nodeDefinitions as l } from './object_info.js';
import { app as f } from '/scripts/app.js';
import { opaque as u } from './opaque.js';
const m = 500,
  d = {
    'http://localhost:3000': 'http://localhost:8080',
  },
  c = [],
  g = new Set(u);
class ComfyApiPatch extends EventTarget {
  constructor() {
    super(),
      (this.registeredEvents = new Set([
        'status',
        'progress',
        'executing',
        'executed',
        'execution_start',
        'execution_error',
        'execution_cached',
      ])),
      (this.models = [{ name: '' }]),
      (this.inputs = []),
      (this.api_host = location.host),
      (this.api_base = location.pathname.split('/').slice(0, -1).join('/'));
  }
  i = (t) => {
    const e = new DataView(t).getUint32(0),
      s = t.slice(4);
    let a;
    if ((e === 1 ? (a = 'image/jpeg') : e === 2 && (a = 'image/png'), !a)) return;
    const i = new Blob([s], { type: a });
    this.dispatchEvent(new CustomEvent('b_preview', { detail: i }));
  };
  e = (t, o) => {
    window.parent.postMessage({ internal: { type: t, data: o } }, '*');
  };
  r = (t) => {
    const o = t.data;
    if (o instanceof ArrayBuffer) {
      this.i(o);
      return;
    }
    if (
      (o.event &&
        this.registeredEvents.has(o.event) &&
        this.dispatchEvent(
          new CustomEvent(o.event, {
            detail: o.event === 'executing' ? o.data.node : o.data,
          }),
        ),
      o.event === 'validation_error' &&
        ((this.app.lastNodeErrors = o.data?.node_errors || []),
        this.app.lastNodeErrors.length > 0 && this.app.canvas.draw(!0, !0)),
      o.internal)
    ) {
      const e = o.internal;
      if (e.type === 'load_prompt' && e.data && e.data.prompt) {
        const s = () => {
          if (e.data.prompt.viewport) {
            const { x: a, y: i, scale: r } = e.data.prompt.viewport;
            this.app.canvas.setZoom(r),
              (this.app.canvas.ds.offset = new Float32Array([a, i])),
              this.app.canvas.draw(!0, !0);
          }
          e.data.read_only ? ((this.readOnly = !0), this.n()) : setInterval(this.p, m), this.s(), this.d();
        };
        this.app
          .loadGraphData(e.data.prompt, !0)
          .then(() => {
            s(), this.e('prompt_loaded');
          })
          .catch(() => {
            s(), this.e('prompt_load_error');
          });
      }
      if (
        (e.type === 'get_prompt' &&
          this.app
            .graphToPrompt()
            .then((s) => {
              this.e('got_prompt', s), this.c(s);
            })
            .catch(() => this.e('prompt_gen_error')),
        e.type === 'refresh_defs' &&
          (e.data.models && (this.models = e.data.models),
          e.data.inputs && (this.inputs = e.data.inputs),
          this.getNodeDefs().then((s) => {
            this.app.registerNodesFromDefs(s).then(() => {
              this.s();
            });
          })),
        e.type === 'export' &&
          this.app
            .graphToPrompt()
            .then((s) => this.e('download_prompt', s.workflow))
            .catch((s) => this.e('prompt_gen_error', s?.message)),
        e.type === 'import')
      ) {
        const s = document.getElementById('comfy-file-input');
        s && s.click();
      }
      if ((e.type === 'clear' && (this.app.clean(), this.app.graph.clear()), e.type === 'undo')) {
        const s = new KeyboardEvent('keydown', { key: 'z', ctrlKey: !0 });
        window.dispatchEvent(s);
      }
      if (e.type === 'redo') {
        const s = new KeyboardEvent('keydown', { key: 'y', ctrlKey: !0 });
        window.dispatchEvent(s);
      }
      e.type === 'zoomIn' && this.app.canvas.setZoom(this.app.canvas.ds.scale + 0.2),
        e.type === 'zoomOut' && this.app.canvas.setZoom(this.app.canvas.ds.scale - 0.2),
        e.type === 'resetZoom' && this.o(),
        e.type === 'openEditorSettings' && this.app.ui.settings.show(),
        e.type === 'arrange' && this.app.graph.arrange();
    }
  };
  d = async () => {
    try {
      if (c.length === 0) return;
      f.graph.clear();
      const t = await this.getNodeDefs();
      for (const o in t) {
        const e = t[o];
        for (const s of c)
          if (e.category.startsWith(s)) {
            const a = window.LiteGraph.createNode(o);
            if (!a) break;
            console.log('Added', e.category + '/' + o), this.app.graph.add(a);
            break;
          }
      }
      this.app.graph.arrange();
    } catch (t) {
      console.error(t);
    }
  };
  n = () => {
    const t = () => null,
      o = Object.getPrototypeOf(this.app.graph);
    Object.assign(o, {
      getNodeOnPos: () => null,
      getGroupOnPos: () => null,
      processContextMenu: t,
    }),
      Object.setPrototypeOf(this.app.graph, o);
    const e = Object.getPrototypeOf(this.app.canvas);
    Object.assign(e, {
      processContextMenu: t,
      showSearchBox: t,
      showLinkMenu: t,
      processKey: t,
    }),
      Object.setPrototypeOf(this.app.canvas, e),
      Array.from(document.querySelectorAll('[type="file"]')).forEach((s) => s.remove()),
      Array.from(document.querySelectorAll('.comfy-modal')).forEach((s) => s.remove()),
      Array.from(document.querySelectorAll('.comfy-menu')).forEach((s) => s.remove()),
      Array.from(document.querySelectorAll('.comfy-settings-dialog')).forEach((s) => s.remove()),
      Array.from(document.querySelectorAll('input')).forEach((s) => {
        s.style.pointerEvents = 'none';
      }),
      Array.from(document.querySelectorAll('textarea')).forEach((s) => {
        s.style.pointerEvents = 'none';
      }),
      Array.from(document.querySelectorAll('select')).forEach((s) => {
        s.style.pointerEvents = 'none';
      }),
      document.addEventListener(
        'drop',
        (s) => {
          s.preventDefault(), s.stopImmediatePropagation();
        },
        !0,
      ),
      document.addEventListener(
        'paste',
        (s) => {
          s.preventDefault(), s.stopImmediatePropagation();
        },
        !0,
      ),
      document.addEventListener(
        'copy',
        (s) => {
          s.preventDefault(), s.stopImmediatePropagation();
        },
        !0,
      ),
      this.o();
  };
  p = () => {
    const [t, o] = this.app.canvas.ds.offset,
      e = this.app.canvas.ds.scale,
      s = this.app.graph.serialize();
    (s.viewport = { x: t, y: o, scale: e }), this.e('graph_data', s);
  };
  s = async () => {
    const t = await this.getNodeDefs();
    for (const o in window.LiteGraph.registered_node_types) {
      const e = window.LiteGraph.registered_node_types[o],
        s = t[o];
      s && (e.nodeData = s);
    }
    for (let o in this.app.graph._nodes) {
      const e = this.app.graph._nodes[o],
        s = t[e.type];
      if ((typeof e.refreshComboInNode == 'function' && e.refreshComboInNode(t), !!s))
        for (const a in e.widgets) {
          const i = e.widgets[a];
          i.type == 'combo' && s.input.required[i.name] !== void 0 && (i.options.values = s.input.required[i.name][0]);
        }
    }
  };
  c = (t) => {
    (this.app.lastNodeErrors = null), this.app.canvas.draw(!0, !0);
    for (const o of t.workflow.nodes) {
      const e = this.app.graph.getNodeById(o.id);
      if (e.widgets) for (const s of e.widgets) s.afterQueued && s.afterQueued();
    }
  };
  h = (t) => {
    t.length > 0 && this.e('missing_nodes', Array.from(new Set(t.filter((o) => typeof o == 'string'))));
  };
  l = () => {
    this.app.showMissingNodesError = this.h;
  };
  initWithApp = async (t) => {
    (this.app = t), this.l(), window.addEventListener('message', this.r), this.e('loaded');
  };
  apiURL(t) {
    if (t.startsWith('/view')) {
      const o = new URLSearchParams(t.split('?')[1]);
      if (o.get('file_url')) return o.get('file_url');
      if (o.get('filename')) {
        let e = o.get('filename');
        if ((o.get('subfolder') && (e = o.get('subfolder') + '/' + e), d[window.location.origin]))
          return d[window.location.origin] + '/uploads/resolve?p=' + encodeURIComponent(e);
      }
    }
    return this.api_base + t;
  }
  t = (t, o) => ({ status: o ? 500 : 200, json: () => Promise.resolve(t) });
  f = (t, o) =>
    new Promise((e) => {
      const s = o || 'editor';
      try {
        const a = (i) => {
          const r = i.data;
          if (r && r.internal) {
            const n = r.internal;
            typeof n.data == 'object' &&
              n.data.name === t.name &&
              (n.type === 'upload_done'
                ? e(this.t({ name: t.name, subfolder: s }))
                : n.type === 'upload_rejected' && e(this.t(null, !0)),
              window.removeEventListener('message', a));
          }
        };
        window.addEventListener('message', a), this.e('upload', { file: t, subdir: s });
      } catch (a) {
        console.error(a), e(this.t(null, !0));
      }
    });
  fetchApi = async (t, o) =>
    t === '/mtb/debug'
      ? this.t({})
      : (t === '/upload/image' || t === '/upload/mask') && !this.readOnly
        ? /\.DS_Store|__MACOSX/.test(o.body.get('image')?.name)
          ? this.t({
              file: o.body.get('image')?.name,
              subfolder: o.body.get('subfolder') || 'editor',
            })
          : await this.f(o.body.get('image'), o.body.get('subfolder'))
        : t === '/impact/wildcards/list'
          ? this.t([])
          : t === '/jovimetrix/config'
            ? this.t({})
            : fetch(this.apiURL(t), o);
  addEventListener = (t, o, e) => {
    super.addEventListener(t, o, e), this.registeredEvents.add(t);
  };
  getExtensions = async () => {
    const t = h.filter((o) => !o.endsWith('impact-sam-editor.js')).map((o) => '/comfy' + o);
    return t;
  };
  getEmbeddings = async () => [];
  a = (t) => {
    for (const o in t) {
      const e = t[o];
      if (Array.isArray(e) && Array.isArray(e[0]))
        for (let s = 0; s < e[0].length; s++)
          e[0][s] === '__models__'
            ? (t[o] = [[...e[0].slice(0, s), ...this.models], ...e.slice(1)])
            : e[0][s] === '__inputs__'
              ? (t[o] = [[...e[0].slice(0, s), ...this.inputs], ...e.slice(1)])
              : e[0][s] === '__embeds__' &&
                (t[o] = [
                  [
                    ...e[0].slice(0, s),
                    ...this.inputs.filter((a) => a.startsWith('embeddings/')).map((a) => a.slice(11)),
                  ],
                  ...e.slice(1),
                ]);
    }
    return t;
  };
  o = () => {
    const t = this.app.graph._nodes.reduce(
        (a, i) => {
          i.pos[0] < a[0] && (a[0] = i.pos[0]), i.pos[1] < a[1] && (a[1] = i.pos[1]);
          const r = i.getBounding(),
            n = i.pos[0] + r[2],
            p = i.pos[1] + r[3];
          return n > a[2] && (a[2] = n), p > a[3] && (a[3] = p), a;
        },
        [99999, 99999, -99999, -99999],
      ),
      o = 50;
    (t[0] -= o), (t[1] -= o), (t[2] += o), (t[3] += o);
    const e = -t[0],
      s = -t[1];
    this.app.canvas.setZoom(1), (this.app.canvas.ds.offset = new Float32Array([e, s])), this.app.canvas.draw(!0, !0);
  };
  getNodeDefs = async () => {
    const t = {};
    for (const [o, e] of Object.entries(l))
      if (!g.has(o))
        if (e.input) {
          let s = { ...e, input: {} };
          e.input.required && (s.input.required = this.a({ ...e.input.required })),
            e.input.optional && (s.input.optional = this.a({ ...e.input.optional })),
            (t[o] = s);
        } else t[o] = e;
    return t;
  };
  getItems = async (t) => (t === 'queue' ? { Running: [], Pending: [] } : { History: [] });
  getSystemStats = async () => ({});
  queuePrompt = async (_, __) => {};
  init = () => {};
  deleteItem = async (_, __) => {};
  clearItems = async (_) => {};
  interrupt = async () => {};
  getUserConfig = async () => ({ storage: 'browser', migrated: !0 });
  storeSetting = async () => this.t({});
}
export const patchApi = new ComfyApiPatch();
