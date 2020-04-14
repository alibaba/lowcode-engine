import { PluginConfig, PluginStatus, PluginClass, HOCPlugin } from './definitions';
import Editor from './index';
import { clone, deepEqual } from './utils';

export default class AreaManager {
  private pluginStatus: PluginStatus;

  private config: PluginConfig[];

  constructor(private editor: Editor, private name: string) {
    this.config = (editor && editor.config && editor.config.plugins && editor.config.plugins[name]) || [];
    this.pluginStatus = clone(editor.pluginStatus);
  }

  setVisible(flag: boolean) {

  }

  isEnable() {

  }

  isVisible() {

  }

  isEmpty() {

  }

  isPluginStatusUpdate(pluginType?: string, notUpdateStatus?: boolean): boolean {
    const { pluginStatus } = this.editor;
    const list = pluginType ? this.config.filter((item): boolean => item.type === pluginType) : this.config;

    const isUpdate = list.some(
      (item): boolean => !deepEqual(pluginStatus[item.pluginKey], this.pluginStatus[item.pluginKey]),
    );
    if (!notUpdateStatus) {
      this.pluginStatus = clone(pluginStatus);
    }
    return isUpdate;
  }

  getVisiblePluginList(pluginType?: string): PluginConfig[] {
    const res = this.config.filter((item): boolean => {
      return !!(!this.pluginStatus[item.pluginKey] || this.pluginStatus[item.pluginKey].visible);
    });
    return pluginType ? res.filter((item): boolean => item.type === pluginType) : res;
  }

  getPlugin(pluginKey: string): HOCPlugin | void {
    if (pluginKey) {
      return this.editor && this.editor.plugins && this.editor.plugins[pluginKey];
    }
  }

  getPluginConfig(pluginKey?: string): PluginConfig[] | PluginConfig | undefined {
    if (pluginKey) {
      return this.config.find(item => item.pluginKey === pluginKey);
    }
    return this.config;
  }

  getPluginClass(pluginKey: string): PluginClass | void {
    if (pluginKey) {
      return this.editor && this.editor.components && this.editor.components[pluginKey];
    }
  }

  getPluginStatus(pluginKey: string): PluginStatus | void {
    if (pluginKey) {
      return this.editor && this.editor.pluginStatus && this.editor.pluginStatus[pluginKey];
    }
  }
}
