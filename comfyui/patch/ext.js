'use strict';
import { app as r } from '/scripts/app.js';
import { ComfyWidgets as p } from '/scripts/widgets.js';
const b = (n, c) => {
  const s = { '': { options: [] } };
  for (const e of c)
    if (typeof e == 'string')
      s[''].options.push({
        title: e,
        value: e,
        callback: () => {
          (n.value = e), n.callback(e), r.graph.setDirtyCanvas(!0);
        },
      });
    else if (e.subfolder) {
      if (!s[e.subfolder]) {
        const a = {
          title: e.subfolder,
          submenu: { options: [], title: e.subfolder },
        };
        (s[e.subfolder] = a.submenu), s[''].options.push(a);
      }
      s[e.subfolder].options.push({
        title: e.name,
        callback: () => {
          (n.value = e.name), n.callback(e.name), r.graph.setDirtyCanvas(!0);
        },
      });
    } else
      s[''].options.push({
        title: e.name,
        value: e.name,
        callback: () => {
          (n.value = e.name), n.callback(e.name), r.graph.setDirtyCanvas(!0);
        },
      });
  return s[''].options;
},
  d = () => {
    const n = p.COMBO;
    p.COMBO = function(c, s, e) {
      const a = e[0],
        i = n.apply(this, arguments);
      if (a.some((l) => typeof l == 'object' && typeof l.name == 'string')) {
        let l = i.widget.value,
          f = i.widget.options.values,
          u = null;
        Object.defineProperty(i.widget.options, 'values', {
          get() {
            return (
              u || (u = b(i.widget, f)),
              (u.findIndex = function(t) {
                for (let o = 0; o < this.length; o++) {
                  const m = this[o];
                  if (t(m.title)) return o;
                }
                return -1;
              }),
              u
            );
          },
          set(t) {
            (f = t), (u = null);
          },
        }),
          Object.defineProperty(i.widget, 'value', {
            get() {
              if (i.widget) {
                const t = new Error().stack;
                if (t.includes('drawNodeWidgets') || t.includes('saveImageExtraOutput')) {
                  const o = l || a[0]?.name;
                  if (typeof o == 'string') return o.slice(o.lastIndexOf('/') + 1);
                }
              }
              return l;
            },
            set(t) {
              t?.submenu || (l = t);
            },
          });
      }
      return i;
    };
  };
r.registerExtension({ name: 'flowt.combos', init: d });
