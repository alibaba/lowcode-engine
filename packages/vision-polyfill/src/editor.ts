import { globalContext } from '@ali/lowcode-globals';
import Editor from '@ali/lowcode-editor-core';
import { Designer } from '@ali/lowcode-designer';
import { registerSetters } from '@ali/lowcode-setters';
import OutlinePane from '@ali/lowcode-plugin-outline-pane';
import SettingsPane from '@ali/lowcode-plugin-settings-pane';
import DesignerPlugin from '@ali/lowcode-plugin-designer';
import { Skeleton } from './skeleton/skeleton';

registerSetters();

export const editor = new Editor();
globalContext.register(editor, Editor);

export const skeleton = new Skeleton(editor);
editor.set(Skeleton, skeleton);

export const designer = new Designer({ eventPipe: editor });
editor.set(Designer, designer);

skeleton.mainArea.add({
  name: 'designer',
  type: 'Widget',
  content: DesignerPlugin,
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
    area: 'leftFixedArea',
  },
});
