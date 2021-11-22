import { isObject } from 'lodash';
import { css } from '@ali/lowcode-utils';

const { toCss } = css;
const engine = (window as any).VisualEngine;
const { Trunk, Viewport } = engine;

export const NativeNodeCache: any = {};

function ucfirst(s: string) {
  return s.charAt(0).toUpperCase() + s.substring(1);
}

export function shallowEqual(obj: { [key: string]: string }, tObj: { [key: string]: string }) {
  for (const i in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, i) && obj[i] !== tObj[i]) {
      return false;
    }
  }
  return true;
}

export function createNodeStyleSheet(props: any) {
  if (props && props.fieldId) {
    let styleProp = props.__style__;

    if (isObject(styleProp)) {
      styleProp = toCss(styleProp);
    }

    if (typeof styleProp === 'string') {
      const s = document.createElement('style');
      const cssId = `_style_pesudo_${ props.fieldId}`;
      const cssClass = `_css_pesudo_${ props.fieldId}`;

      props.className = cssClass;
      s.setAttribute('type', 'text/css');
      s.setAttribute('id', cssId);
      document.getElementsByTagName('head')[0].appendChild(s);

      s.appendChild(
        document.createTextNode(
          styleProp
            .replace(/(\d+)rpx/g, (a, b) => {
              return `${b / 2}px`;
            })
            .replace(/:root/g, `.${ cssClass}`),
        ),
      );
      return s;
    }
  }
}

export function setNativeNode(leaf: any, node: Rax.RaxNode) {
  const id = leaf.getId();
  if (NativeNodeCache[id] === node) {
    return;
  }
  NativeNodeCache[id] = node;
  leaf.mountChange();
}

export function getView(componentName: string) {
  // let view = new Trunk().getPrototypeView(componentName);
  let view = Trunk.getPrototypeView(componentName);
  if (!view) {
    return null;
  }
  const viewport = Viewport.getViewport();
  if (viewport) {
    const [mode, device] = viewport.split('-', 2).map(ucfirst);
    if (view.hasOwnProperty(device)) {
      view = view[device];
    }

    if (view.hasOwnProperty(mode)) {
      view = view[mode];
    }
  }

  return view;
}
