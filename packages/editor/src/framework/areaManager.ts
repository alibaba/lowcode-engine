import Editor from './index';
import { PluginConfig, PluginStatus } from './definitions';
import { clone, deepEqual } from './utils';

export default class AreaManager {
  private pluginStatus: PluginStatus;
  private config: Array<PluginConfig>;
  constructor(private editor: Editor, private area: string) {
    this.config = (editor && editor.config && editor.config.plugins && editor.config.plugins[this.area]) || [];
    this.pluginStatus = clone(editor.pluginStatus);
  }

  isPluginStatusUpdate(): boolean {
    const { pluginStatus } = this.editor;
    const isUpdate = this.config.some(
      item => !deepEqual(pluginStatus[item.pluginKey], this.pluginStatus[item.pluginKey])
    );
    this.pluginStatus = clone(pluginStatus);
    return isUpdate;
  }

  getVisiblePluginList(): Array<PluginConfig> {
    return this.config.filter(item => {
      return !this.pluginStatus[item.pluginKey] || this.pluginStatus[item.pluginKey].visible;
    });
  }

  getPluginConfig(): Array<PluginConfig> {
    return this.config;
  }
}
