import { isJSBlock, isJSExpression, isJSSlot } from '@ali/lowcode-types';
import { isPlainObject, hasOwnProperty, cloneDeep, isI18NObject, isUseI18NSetter, convertToI18NObject, isString } from '@ali/lowcode-utils';
import { globalContext, Editor } from '@ali/lowcode-editor-core';
import { Designer, LiveEditing, TransformStage, Node, getConvertedExtraKey } from '@ali/lowcode-designer';
import Outline, { OutlineBackupPane, getTreeMaster } from '@ali/lowcode-plugin-outline-pane';
import { toCss } from '@ali/vu-css-style';
import logger from '@ali/vu-logger';
import bus from './bus';
import { VE_EVENTS } from './base/const';

import DesignerPlugin from '@ali/lowcode-plugin-designer';
import { Skeleton, SettingsPrimaryPane, registerDefaults } from '@ali/lowcode-editor-skeleton';

import { deepValueParser } from './deep-value-parser';
import { liveEditingRule, liveEditingSaveHander } from './vc-live-editing';
import { isVariable } from './utils';

export const editor = new Editor();
globalContext.register(editor, Editor);

export const skeleton = new Skeleton(editor);
editor.set(Skeleton, skeleton);
editor.set('skeleton', skeleton);
registerDefaults();

export const designer = new Designer({ editor });
editor.set(Designer, designer);
editor.set('designer', designer);

designer.project.onCurrentDocumentChange((doc) => {
  bus.emit(VE_EVENTS.VE_PAGE_PAGE_READY);
});

interface Variable {
  type: 'variable';
  variable: string;
  value: any;
}

function upgradePropsReducer(props: any) {
  if (!props || !isPlainObject(props)) {
    return props;
  }
  if (isJSBlock(props)) {
    if (props.value.componentName === 'Slot') {
      return {
        type: 'JSSlot',
        title: (props.value.props as any)?.slotTitle,
        name: (props.value.props as any)?.slotName,
        value: props.value.children,
      };
    } else {
      return props.value;
    }
  }
  if (isVariable(props)) {
    return {
      type: 'JSExpression',
      value: props.variable,
      mock: props.value,
    };
  }
  const newProps: any = {};
  Object.keys(props).forEach((key) => {
    if (/^__slot__/.test(key) && props[key] === true) {
      return;
    }
    newProps[key] = upgradePropsReducer(props[key]);
  });
  return newProps;
}

// 升级 Props
designer.addPropsReducer(upgradePropsReducer, TransformStage.Upgrade);

function getCurrentFieldIds() {
  const fieldIds: any = [];
  const nodesMap = designer?.currentDocument?.nodesMap || new Map();
  nodesMap.forEach((curNode: any) => {
    const fieldId = nodesMap?.get(curNode.id)?.getPropValue('fieldId');
    if (fieldId) {
      fieldIds.push(fieldId);
    }
  });
  return fieldIds;
}

// 节点 props 初始化
designer.addPropsReducer((props, node) => {
  // debugger;
  // run initials
  const newProps: any = {
    ...props,
  };
  if (newProps.fieldId) {
    const fieldIds = getCurrentFieldIds();

    // 全局的关闭 uniqueIdChecker 信号，在 ve-utils 中实现
    if (fieldIds.indexOf(props.fieldId) >= 0 && !(window as any).__disable_unique_id_checker__) {
      newProps.fieldId = undefined;
    }
  }
  const initials = node.componentMeta.getMetadata().experimental?.initials;
  if (initials) {
    const getRealValue = (propValue: any) => {
      if (isVariable(propValue)) {
        return propValue.value;
      }
      if (isJSExpression(propValue)) {
        return propValue.mock;
      }
      return propValue;
    };
    initials.forEach((item) => {
      // FIXME! this implements SettingTarget
      try {
        // FIXME! item.name could be 'xxx.xxx'
        const ov = newProps[item.name];
        const v = item.initial(node as any, getRealValue(ov));
        if (ov === undefined && v !== undefined) {
          newProps[item.name] = v;
        }
        // 兼容 props 中的属性为 i18n 类型，但是仅提供了一个字符串值，非变量绑定
        if (isUseI18NSetter(node.componentMeta.prototype, item.name) &&
          !isI18NObject(ov) &&
          !isJSExpression(ov) &&
          !isJSBlock(ov) &&
          !isJSSlot(ov) &&
          !isVariable(ov) &&
          isString(v)) {
          newProps[item.name] = convertToI18NObject(v);
        }
      } catch (e) {
        if (hasOwnProperty(props, item.name)) {
          newProps[item.name] = props[item.name];
        }
      }
      if (newProps[item.name] && !node.props.has(item.name)) {
        node.props.add(newProps[item.name], item.name, false, { skipSetSlot: true });
      }
    });
  }
  return newProps;
}, TransformStage.Init);

designer.addPropsReducer((props: any, node: Node) => {
  // live 模式下解析 lifeCycles
  if (node.isRoot() && props && props.lifeCycles) {
    if (editor.get('designMode') === 'live') {
      const lifeCycleMap = {
        didMount: 'componentDidMount',
        willUnmount: 'componentWillUnMount',
      };
      const lifeCycles = props.lifeCycles;
      Object.keys(lifeCycleMap).forEach(key => {
        if (lifeCycles[key]) {
          lifeCycles[lifeCycleMap[key]] = lifeCycles[key];
        }
      });
      return props;
    }
    return {
      ...props,
      lifeCycles: {},
    };
  }
  return props;
}, TransformStage.Render);

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
        if (item.filter(node.settingEntry.getProp(item.name), props[item.name]) === false) {
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

function compatiableReducer(props: any) {
  if (!props || !isPlainObject(props)) {
    return props;
  }
  // 为了能降级到老版本，建议在后期版本去掉以下代码
  if (isJSSlot(props)) {
    return {
      type: 'JSBlock',
      value: {
        componentName: 'Slot',
        children: props.value,
        props: {
          slotTitle: props.title,
          slotName: props.name,
        },
      },
    };
  }
  if (isJSExpression(props) && !props.events) {
    return {
      type: 'variable',
      value: props.mock,
      variable: props.value,
    };
  }
  const newProps: any = {};
  Object.entries<any>(props).forEach(([key, val]) => {
    newProps[key] = compatiableReducer(val);
  });
  return newProps;
}
// FIXME: Dirty fix, will remove this reducer
designer.addPropsReducer(compatiableReducer, TransformStage.Save);
// 兼容历史版本的 Page 组件
designer.addPropsReducer((props: any, node: Node) => {
  const lifeCycleNames = ['didMount', 'willUnmount'];
  if (node.isRoot()) {
    lifeCycleNames.forEach((key) => {
      if (props[key]) {
        const lifeCycles = node.props.getPropValue(getConvertedExtraKey('lifeCycles')) || {};
        lifeCycles[key] = props[key];
        node.props.setPropValue(getConvertedExtraKey('lifeCycles'), lifeCycles);
      }
    });
  }
  return props;
}, TransformStage.Save);

// designer.addPropsReducer((props: any, node: Node) => {
//   const lifeCycleNames = ['didMount', 'willUnmount'];
//   const lifeCycleMap = {
//     didMount: 'componentDidMount',
//     willUnmount: 'componentWillUnMount',
//   };
//   if (node.componentName === 'Page') {
//     debugger;
//     lifeCycleNames.forEach(key => {
//       if (props[key]) {
//         const lifeCycles = node.props.getPropValue(getConvertedExtraKey('lifeCycles')) || {};
//         lifeCycles[lifeCycleMap[key]] = props[key];
//         node.props.setPropValue(getConvertedExtraKey('lifeCycles'), lifeCycles);
//       } else if (node.props.getPropValue(getConvertedExtraKey('lifeCycles'))) {
//         const lifeCycles = node.props.getPropValue(getConvertedExtraKey('lifeCycles')) || {};
//         lifeCycles[lifeCycleMap[key]] = lifeCycles[key];
//         node.props.setPropValue(getConvertedExtraKey('lifeCycles'), lifeCycles);
//       }
//     });
//   }
//   return props;
// }, TransformStage.Init);

// 设计器组件样式处理
function stylePropsReducer(props: any, node: any) {
  if (props && typeof props === 'object' && props.__style__) {
    const cssId = `_style_pesudo_${ node.id.replace(/\$/g, '_')}`;
    const cssClass = `_css_pesudo_${ node.id.replace(/\$/g, '_')}`;
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
    const cssId = `_style_pesudo_${ node.id}`;
    const cssClass = `_css_pesudo_${ node.id.replace(/\$/g, '_')}`;
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

    s.appendChild(doc.createTextNode(styleProp.replace(/(\d+)rpx/g, (a, b) => {
      return `${b / 2}px`;
    }).replace(/:root/g, `.${ cssClass}`)));
  }
}
designer.addPropsReducer(stylePropsReducer, TransformStage.Render);
// 国际化 & Expression 渲染时处理
designer.addPropsReducer(deepValueParser, TransformStage.Render);

// 清除空的 props value
function removeEmptyProps(props: any, node: Node) {
  if (node.isRoot() && props.dataSource) {
    const online = cloneDeep(props.dataSource.online);
    online.forEach((item: any) => {
      const newParam: any = {};
      if (Array.isArray(item?.options?.params)) {
        item.options.params.forEach((element: any) => {
          if (element.name) {
            newParam[element.name] = element.value;
          }
        });
        item.options.params = newParam;
      }
    });
    props.dataSource.list = online;
  }
  return props;
}

// Init 的时候没有拿到 dataSource, 只能在 Render 和 Save 的时候都调用一次，理论上执行时机在 Init
// Render 和 Save 都要各调用一次，感觉也是有问题的，是不是应该在 Render 执行一次就行了？见上 filterReducer 也是一样的处理方式。
designer.addPropsReducer(removeEmptyProps, TransformStage.Render);
designer.addPropsReducer(removeEmptyProps, TransformStage.Save);

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
  props: {
    ignoreRoot: true,
  },
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
    },
  },
  content: OutlineBackupPane,
});

LiveEditing.addLiveEditingSpecificRule(liveEditingRule);
LiveEditing.addLiveEditingSaveHandler(liveEditingSaveHander);
