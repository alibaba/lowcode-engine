import { isJSBlock, isJSExpression, isJSSlot } from '@ali/lowcode-types';
import { isPlainObject, hasOwnProperty, cloneDeep, isI18NObject, isUseI18NSetter, convertToI18NObject, isString } from '@ali/lowcode-utils';
import { globalContext, Editor } from '@ali/lowcode-editor-core';
import { Designer, LiveEditing, TransformStage, Node, getConvertedExtraKey, LowCodePluginManager } from '@ali/lowcode-designer';
import Outline, { OutlineBackupPane, getTreeMaster } from '@ali/lowcode-plugin-outline-pane';

import DesignerPlugin from '@ali/lowcode-plugin-designer';
import { Skeleton, SettingsPrimaryPane, registerDefaults } from '@ali/lowcode-editor-skeleton';

export const editor = new Editor();
globalContext.register(editor, Editor);

export const skeleton = new Skeleton(editor);
editor.set(Skeleton, skeleton);
editor.set('skeleton', skeleton);
registerDefaults();

export const designer = new Designer({ editor });
editor.set(Designer, designer);
editor.set('designer', designer);

export const plugins = (new LowCodePluginManager(editor)).toProxy();
editor.set('plugins', plugins);


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