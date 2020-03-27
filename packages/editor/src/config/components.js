import componentsPane from '@ali/lowcode-plugin-components-pane';
import Settings from '../../../plugin-settings';
import undoRedo from '@ali/lowcode-plugin-undo-redo';
import Designer from '../plugins/designer';
import logo from '../plugins/logo';
import save from '../plugins/save';
import OutlineTree from '../../../plugin-outline-tree';

import { PluginFactory } from '@ali/lowcode-editor-core';

export default {
  logo: PluginFactory(logo),
  save: PluginFactory(save),
  designer: PluginFactory(Designer),
  settings: PluginFactory(Settings),
  outlineTree: PluginFactory(OutlineTree),
  undoRedo: PluginFactory(undoRedo),
  componentsPane: PluginFactory(componentsPane)
};
