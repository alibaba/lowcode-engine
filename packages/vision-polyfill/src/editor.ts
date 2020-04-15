import Editor from '@ali/lowcode-editor-core';
import OutlinePane from '@ali/lowcode-plugin-outline-pane';
import SettingsPane from '@ali/lowcode-plugin-settings-pane';
import Designer from '@ali/lowcode-plugin-designer';
import { registerSetters } from '@ali/lowcode-setters';
import { Skeleton } from './skeleton/skeleton';

registerSetters();

export const editor = new Editor();

export const skeleton = new Skeleton(editor);

export const designer = new Designer();

editor.set('designer', designer)

skeleton.mainArea.add({
  name: 'designer',
  type: 'Widget',
  content: Designer,
});
skeleton.rightArea.add({
  name: 'settingsPane',
  type: 'Panel',
  content: SettingsPane,
});
skeleton.leftArea.add({
  name: 'outlinePane',
  type: 'PanelDock',
  props: {
    align: 'top',
    icon: 'shuxingkongjian',
    description: '大纲树',
  },
  content: OutlinePane,
  panelProps: {
    area: 'leftFixedArea'
  }
});

// editor-core
//  1. di 实现
//  2. general bus: pub/sub
// editor-skeleton/workbench 视图实现
//  1. skeleton 区域划分 panes
//  provide fixed left pane
//  provide float left pane
