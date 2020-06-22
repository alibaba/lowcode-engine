import { isJSBlock, isJSExpression, isJSSlot, isI18nData } from '@ali/lowcode-types';
import { isPlainObject, hasOwnProperty } from '@ali/lowcode-utils';
import { globalContext, Editor } from '@ali/lowcode-editor-core';
import { Designer, LiveEditing, TransformStage, Node } from '@ali/lowcode-designer';
import Outline, { OutlineBackupPane, getTreeMaster } from '@ali/lowcode-plugin-outline-pane';
import { toCss } from '@ali/vu-css-style';
import logger from '@ali/vu-logger';
import bus from './bus';
import { VE_EVENTS } from './base/const';

import DesignerPlugin from '@ali/lowcode-plugin-designer';
import { Skeleton, SettingsPrimaryPane } from '@ali/lowcode-editor-skeleton';

import { deepValueParser } from './deep-value-parser';
import { liveEditingRule, liveEditingSaveHander } from './vc-live-editing';

export const editor = new Editor();
globalContext.register(editor, Editor);

export const skeleton = new Skeleton(editor);
editor.set(Skeleton, skeleton);
editor.set('skeleton', skeleton);

export const designer = new Designer({ editor: editor });
editor.set(Designer, designer);
editor.set('designer', designer);

designer.project.onCurrentDocumentChange((doc) => {
  doc.onRendererReady(() => {
    bus.emit(VE_EVENTS.VE_PAGE_PAGE_READY);
  });
});

// 节点 props 初始化
designer.addPropsReducer((props, node) => {
  // run initials
  const initials = node.componentMeta.getMetadata().experimental?.initials;
  if (initials) {
    const newProps: any = {};
    initials.forEach((item) => {
      // FIXME! this implements SettingTarget
      try {
        // FIXME! item.name could be 'xxx.xxx'
        const v = item.initial(node as any, props[item.name]);
        if (v !== undefined) {
          newProps[item.name] = v;
        }
      } catch (e) {
        if (hasOwnProperty(props, item.name)) {
          newProps[item.name] = props[item.name];
        }
      }
    });
    return newProps;
  }
  return props;
}, TransformStage.Init);


function filterReducer(props: any, node: Node): any {
  const filters = node.componentMeta.getMetadata().experimental?.filters;
  if (filters && filters.length) {
    const newProps = { ...props };
    filters.forEach((item) => {
      // FIXME! item.name could be 'xxx.xxx'
      if (!hasOwnProperty(newProps, item.name)) {
        return;
      }
      try {
        if (item.filter(node.getProp(item.name) as any, props[item.name]) === false) {
          delete newProps[item.name];
        }
      } catch (e) {
        console.warn(e);
        logger.trace(e);
      }
    });
    return newProps;
  }
  return props;
}
designer.addPropsReducer(filterReducer, TransformStage.Save);
designer.addPropsReducer(filterReducer, TransformStage.Render);

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
// 升级 Props
designer.addPropsReducer(upgradePropsReducer, TransformStage.Init);

function compatiableReducer(props: any) {
  if (!isPlainObject(props)) {
    return props;
  }
  const newProps: any = {};
  Object.entries<any>(props).forEach(([key, val]) => {
    if (isJSSlot(val)) {
      val.value
      val = {
        type: 'JSBlock',
        value: {
          componentName: 'Slot',
          children: val.value,
          props: {
            slotTitle: val.title,
          },
        },
      }
    }
    newProps[key] = val;
  });
  return newProps;
}
// Dirty fix: will remove this reducer
designer.addPropsReducer(compatiableReducer, TransformStage.Save);

// 设计器组件样式处理
function stylePropsReducer(props: any, node: any) {
  if (props && typeof props === 'object' && props.__style__) {
    const cssId = '_style_pesudo_' + node.id.replace(/\$/g, '_');
    const cssClass = '_css_pesudo_' + node.id.replace(/\$/g, '_');
    const styleProp = props.__style__;
    appendStyleNode(props, styleProp, cssClass, cssId);
  }
  if (props && typeof props === 'object' && props.pageStyle) {
    const cssId = '_style_pesudo_engine-document';
    const cssClass = 'engine-document';
    const styleProp = props.pageStyle;
    appendStyleNode(props, styleProp, cssClass, cssId);
  }
  if (props && typeof props === 'object' && props.containerStyle) {
    const cssId = '_style_pesudo_' + node.id;
    const cssClass = '_css_pesudo_' + node.id.replace(/\$/g, '_');
    const styleProp = props.containerStyle;
    appendStyleNode(props, styleProp, cssClass, cssId);
  }
  return props;
}

function appendStyleNode(props: any, styleProp: any, cssClass: string, cssId: string) {
  const doc = designer.currentDocument?.simulator?.contentDocument;
  if (!doc) {
    return;
  }
  const dom = doc.getElementById(cssId);
  if (dom) {
    dom.parentNode?.removeChild(dom);
  }
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
designer.addPropsReducer(stylePropsReducer, TransformStage.Render);

// 国际化 & Expression 渲染时处理
designer.addPropsReducer(deepValueParser, TransformStage.Render);

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
skeleton.add({
  area: 'rightArea',
  name: 'backupOutline',
  type: 'Panel',
  props: {
    condition: () => {
      return designer.dragon.dragging && !getTreeMaster(designer).hasVisibleTreeBoard();
    }
  },
  content: OutlineBackupPane,
});

LiveEditing.addLiveEditingSpecificRule(liveEditingRule);
LiveEditing.addLiveEditingSaveHandler(liveEditingSaveHander);
