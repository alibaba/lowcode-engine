import { render } from 'react-dom';
import { createElement } from 'react';
import { Workbench } from '@ali/lowcode-editor-skeleton';
import { globalContext, Editor } from '@ali/lowcode-editor-core';
import { Skeleton, SettingsPrimaryPane } from '@ali/lowcode-editor-skeleton';
import { Designer } from '@ali/lowcode-designer';
import { OutlineBackupPane, getTreeMaster } from '@ali/lowcode-plugin-outline-pane';
import DesignerPlugin from '@ali/lowcode-plugin-designer';
import '@ali/lowcode-editor-setters';

export * from '@ali/lowcode-types';
export * from '@ali/lowcode-utils';
export * from '@ali/lowcode-editor-core';
export * from '@ali/lowcode-editor-skeleton';
export * from '@ali/lowcode-designer';

export const editor = new Editor();
globalContext.register(editor, Editor);

export const skeleton = new Skeleton(editor);
editor.set(Skeleton, skeleton);
editor.set('skeleton', skeleton);

export const designer = new Designer({ editor: editor });
editor.set(Designer, designer);
editor.set('designer', designer);

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

const version = '0.9.0-beta';

export default function GeneralWorkbench(props: any) {
  return createElement(Workbench, {
    skeleton,
    ...props,
  });
}
window.__ctx = {
  editor,
  appHelper: editor,
};
export function init(container?: Element) {
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }
  container.id = 'lowcodeEditorPresetGeneral';

  render(
    createElement(GeneralWorkbench),
    container,
  );
}

console.log(
  `%cLowcodeEditorPresetGeneral %cv${version}`,
  "color:#000;font-weight:bold;",
  "color:green;font-weight:bold;"
);
