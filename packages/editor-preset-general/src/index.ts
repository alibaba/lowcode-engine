import { render } from 'react-dom';
import { createElement } from 'react';
import builtinSetters from '@ali/lowcode-editor-setters';
import DesignerPlugin from '@ali/lowcode-plugin-designer';
import { Designer, LiveEditing } from '@ali/lowcode-designer';
import { globalContext, Editor, registerSetter } from '@ali/lowcode-editor-core';
import { OutlinePane, OutlineBackupPane, getTreeMaster } from '@ali/lowcode-plugin-outline-pane';
import { Workbench, Skeleton, SettingsPrimaryPane, registerDefaults } from '@ali/lowcode-editor-skeleton';

import { version } from '../package.json';
import { liveEditingRule, liveEditingSaveHander } from './live-editing';

export * from '@ali/lowcode-types';
export * from '@ali/lowcode-utils';
export * from '@ali/lowcode-editor-core';
export * from '@ali/lowcode-editor-skeleton';
export * from '@ali/lowcode-designer';

registerSetter(builtinSetters);

export const editor = new Editor();
globalContext.register(editor, Editor);

export const skeleton = new Skeleton(editor);
editor.set(Skeleton, skeleton);
editor.set('skeleton', skeleton);
registerDefaults();

export const designer = new Designer({ editor });
editor.set(Designer, designer);
editor.set('designer', designer);

skeleton.add({
  area: 'leftArea',
  name: 'outline',
  type: 'PanelDock',
  props: {
    align: 'top',
    icon: 'shuxingkongjian',
    description: '大纲树',
  },
  panelProps: {
    area: 'leftFixedArea',
  },
  contentProps: {},
  content: OutlinePane,
});
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
    },
  },
  content: OutlineBackupPane,
});

export function GeneralWorkbench(props: any) {
  return createElement(Workbench, {
    skeleton,
    ...props,
  });
}

export default GeneralWorkbench;

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

  render(createElement(GeneralWorkbench), container);
}

console.log(`%cLowcodeEngine %cv${version}`, 'color:#000;font-weight:bold;', 'color:green;font-weight:bold;');

LiveEditing.addLiveEditingSpecificRule(liveEditingRule);
LiveEditing.addLiveEditingSaveHandler(liveEditingSaveHander);
