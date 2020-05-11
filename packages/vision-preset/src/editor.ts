import { isJSBlock, isJSSlot } from '@ali/lowcode-types';
import { isPlainObject } from '@ali/lowcode-utils';
import { globalContext, Editor } from '@ali/lowcode-editor-core';
import { Designer, TransformStage, addBuiltinComponentAction } from '@ali/lowcode-designer';
// import { registerSetters } from '@ali/lowcode-setters';
import Outline from '@ali/lowcode-plugin-outline-pane';
import { toCss } from '@ali/vu-css-style';

import DesignerPlugin from '@ali/lowcode-plugin-designer';
import { Skeleton, SettingsPrimaryPane } from '@ali/lowcode-editor-skeleton';

import { i18nReducer } from './i18n-reducer';
import { InstanceNodeSelector } from './components';

export const editor = new Editor();
globalContext.register(editor, Editor);

export const skeleton = new Skeleton(editor);
editor.set(Skeleton, skeleton);

export const designer = new Designer({ editor: editor });
editor.set(Designer, designer);

designer.addPropsReducer((props, node) => {
  // run initials
  const initials = node.componentMeta.getMetadata().experimental?.initials;
  if (initials) {
    const newProps: any = {};
    initials.forEach((item) => {
      // FIXME! this implements SettingTarget
      const v = item.initial(node as any, props[item.name]);
      if (v !== undefined) {
        newProps[item.name] = v;
      }
    });
    return newProps;
  }
  return props;
}, TransformStage.Init);

designer.addPropsReducer(i18nReducer, TransformStage.Render);

function upgradePropsReducer(props: any) {
  if (!isPlainObject(props)) {
    return props;
  }
  const newProps: any = {};
  Object.entries<any>(props).forEach(([key, val]) => {
    if (/^__slot__/.test(key) && val === true) {
      return;
    }
    if (isJSBlock(val)) {
      if (val.value.componentName === 'Slot') {
        val = {
          type: 'JSSlot',
          title: (val.value.props as any)?.slotTitle,
          value: val.value.children
        };
      } else {
        val = val.value;
      }
    }
    // todo: type: variable
    newProps[key] = val;
  });
  return newProps;
}
designer.addPropsReducer(upgradePropsReducer, TransformStage.Init);

// 设计器组件样式处理
function stylePropsReducer(props: any, node: any) {
  if (props && typeof props === 'object' && props.__style__) {
    const doc = designer.currentDocument?.simulator?.contentDocument;
    if (!doc) {
      return;
    }
    const cssId = '_style_pesudo_' + node.id.replace(/\$/g, '_');
    const cssClass = '_css_pesudo_' + node.id.replace(/\$/g, '_');
    const dom = doc.getElementById(cssId);
    if (dom) {
      dom.parentNode?.removeChild(dom);
    }
    let styleProp = props.__style__;
    if (typeof styleProp === 'object') {
      styleProp = toCss(styleProp);
    }
    if (typeof styleProp === 'string') {
      const s = doc.createElement('style');
      props.className = cssClass;
      s.setAttribute('type', 'text/css');
      s.setAttribute('id', cssId);
      doc.getElementsByTagName('head')[0].appendChild(s);

      s.appendChild(doc.createTextNode(styleProp.replace(/:root/g, '.' + cssClass)));
    }
  }
  return props;
}
designer.addPropsReducer(stylePropsReducer, TransformStage.Render);

skeleton.add({
  area: 'mainArea',
  name: 'designer',
  type: 'Widget',
  content: DesignerPlugin,
});
skeleton.add({
  area: 'rightArea',
  name: 'settingsPane',
  type: 'Panel',
  content: SettingsPrimaryPane,
});
skeleton.add({
  area: 'leftArea',
  name: 'outlinePane',
  type: 'PanelDock',
  content: Outline,
  panelProps: {
    area: 'leftFixedArea',
  },
});

// skeleton.add({
//   name: 'sourceEditor',
//   type: 'PanelDock',
//   props: {
//     align: 'top',
//     icon: 'code',
//     description: '组件库',
//   },
//   panelProps: {
//     width: 500
//     // area: 'leftFixedArea'
//   },
//   content: SourceEditor,
// });

// 实例节点选择器，线框高亮
addBuiltinComponentAction({
  name: 'instance-node-selector',
  content: InstanceNodeSelector,
  important: true,
  condition: 'always'
});
