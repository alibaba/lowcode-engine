import undoRedo from '@ali/lowcode-plugin-undo-redo';
import zhEn from '@ali/lowcode-plugin-zh-en';
import logo from '@ali/lowcode-plugin-sample-logo';
import SamplePreview from '@ali/lowcode-plugin-sample-preview';
import Designer from '@ali/lowcode-plugin-designer';
import SettingsPane from '@ali/lowcode-plugin-settings-pane';
import componentsPane from '@ali/lowcode-plugin-components-pane';
import OutlinePane from '@ali/lowcode-plugin-outline-pane';
import EventBindDialog from '@ali/lowcode-plugin-event-bind-dialog'
import { PluginFactory } from '@ali/lowcode-editor-core';
export default {
  undoRedo: PluginFactory(undoRedo),
  zhEn: PluginFactory(zhEn),
  designer: PluginFactory(Designer),
  componentsPane: PluginFactory(componentsPane),
  settingsPane: PluginFactory(SettingsPane),
  outlinePane: PluginFactory(OutlinePane),
  eventBindDialog:PluginFactory(EventBindDialog),
  logo: PluginFactory(logo),
  samplePreview: PluginFactory(SamplePreview)
};
