import { globalContext } from '@ali/lowcode-globals';
import Editor from '@ali/lowcode-editor-core';
import { Designer } from '@ali/lowcode-designer';
import { registerSetters } from '@ali/lowcode-setters';
import Outline from '@ali/lowcode-plugin-outline-pane';
import SettingsPane from '@ali/lowcode-plugin-settings-pane';
import DesignerPlugin from '@ali/lowcode-plugin-designer';
import { Skeleton } from './skeleton/skeleton';


import Preview from '@ali/lowcode-plugin-sample-preview';

registerSetters();

export const editor = new Editor();
globalContext.register(editor, Editor);

export const skeleton = new Skeleton(editor);
editor.set(Skeleton, skeleton);

export const designer = new Designer({ eventPipe: editor });
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
  content: SettingsPane,
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
