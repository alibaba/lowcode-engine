import { isJSBlock } from '@ali/lowcode-types';
import { isPlainObject } from '@ali/lowcode-utils';
import { globalContext, Editor } from '@ali/lowcode-editor-core';
import { Designer, TransformStage, addBuiltinComponentAction } from '@ali/lowcode-designer';
import { registerSetters } from '@ali/lowcode-setters';
import Outline from '@ali/lowcode-plugin-outline-pane';
import DesignerPlugin from '@ali/lowcode-plugin-designer';
import { Skeleton, SettingsPrimaryPane } from '@ali/lowcode-editor-skeleton';

import Preview from '@ali/lowcode-plugin-sample-preview';
import SourceEditor from '@ali/lowcode-plugin-source-editor';
import { i18nReducer } from './i18n-reducer';
import { InstanceNodeSelector } from './components';
import { Divider } from '@alifd/next';

registerSetters();

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
  area: 'topArea',
  type: 'Dock',
  name: 'preview',
  props: {
    align: 'right',
  },
  content: Preview,
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
});
