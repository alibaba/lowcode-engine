import undoRedo from '@ali/lowcode-plugin-undo-redo';
import logo from '@ali/lowcode-plugin-logo';
import save from '@ali/lowcode-plugin-save';
import Designer from '@ali/lowcode-plugin-designer';
import SettingsPane from '@ali/lowcode-plugin-settings-pane';
import componentsPane from '@ali/lowcode-plugin-components-pane';
import OutlinePane from '@ali/lowcode-plugin-outline-pane';
import { PluginFactory } from '@ali/lowcode-editor-core';

export default {
  logo: PluginFactory(logo),
  save: PluginFactory(save),
  undoRedo: PluginFactory(undoRedo),
  designer: PluginFactory(Designer),
  componentsPane: PluginFactory(componentsPane),
  settingsPane: PluginFactory(SettingsPane),
  OutlinePane: PluginFactory(OutlinePane),
};
