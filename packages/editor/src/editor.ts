import { globalContext, Editor } from '@ali/lowcode-editor-core';
import { Designer } from '@ali/lowcode-designer';
import DesignerPlugin from '@ali/lowcode-plugin-designer';
import { Skeleton, SettingsPrimaryPane } from '@ali/lowcode-editor-skeleton';

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

export * from '@ali/lowcode-types';
export * from '@ali/lowcode-designer';
export * from '@ali/lowcode-editor-skeleton'
