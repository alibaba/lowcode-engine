import { globalContext, Editor } from '@ali/lowcode-editor-core';
import { Designer, addBuiltinComponentAction } from '@ali/lowcode-designer';
import Outline from '@ali/lowcode-plugin-outline-pane';

import DesignerPlugin from '@ali/lowcode-plugin-designer';
import { Skeleton, SettingsPrimaryPane } from '@ali/lowcode-editor-skeleton';

import { InstanceNodeSelector } from './components';

export const editor = new Editor();
globalContext.register(editor, Editor);

export const skeleton = new Skeleton(editor);
editor.set(Skeleton, skeleton);

export const designer = new Designer({ editor: editor });
editor.set(Designer, designer);

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

// 实例节点选择器，线框高亮
addBuiltinComponentAction({
  name: 'instance-node-selector',
  content: InstanceNodeSelector,
  important: true,
  condition: 'always',
});
