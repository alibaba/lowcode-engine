import Editor from './index';
import { PluginConfig, PluginStatus } from './definitions';
import { clone, deepEqual, transformToPromise } from './utils';

export default class AreaManager {
  private pluginStatus: PluginStatus;
  private config: Array<PluginConfig>;
  constructor(private editor: Editor, private area: string) {
    this.config = (editor && editor.config && editor.config.plugins && editor.config.plugins[this.area]) || [];
    this.pluginStatus = clone(editor.pluginStatus);
  }

  isPluginStatusUpdate(pluginType?: string): boolean {
    const { pluginStatus } = this.editor;
    const list = pluginType ? this.config.filter(item => item.type === pluginType) : this.config;

    const isUpdate = list.some(item => !deepEqual(pluginStatus[item.pluginKey], this.pluginStatus[item.pluginKey]));
    this.pluginStatus = clone(pluginStatus);
    return isUpdate;
  }

  getVisiblePluginList(pluginType?: string): Array<PluginConfig> {
    const res = this.config.filter(item => {
      return !this.pluginStatus[item.pluginKey] || this.pluginStatus[item.pluginKey].visible;
    });
    return pluginType ? res.filter(item => item.type === pluginType) : res;
  }

  getPluginConfig(): Array<PluginConfig> {
    return this.config;
  }
}
