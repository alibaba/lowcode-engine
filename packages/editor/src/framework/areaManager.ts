import { PluginConfig, PluginStatus } from './definitions';
import Editor from './index';
import { clone, deepEqual } from './utils';

export default class AreaManager {
  private pluginStatus: PluginStatus;

  private config: PluginConfig[];

  private editor: Editor;

  private area: string;

  constructor(editor: Editor, area: string) {
    this.editor = editor;
    this.area = area;
    this.config = (editor && editor.config && editor.config.plugins && editor.config.plugins[this.area]) || [];
    this.pluginStatus = clone(editor.pluginStatus);
  }

  public isPluginStatusUpdate(pluginType?: string): boolean {
    const { pluginStatus } = this.editor;
    const list = pluginType ? this.config.filter((item): boolean => item.type === pluginType) : this.config;

    const isUpdate = list.some((item): boolean => !deepEqual(pluginStatus[item.pluginKey], this.pluginStatus[item.pluginKey]));
    this.pluginStatus = clone(pluginStatus);
    return isUpdate;
  }

  public getVisiblePluginList(pluginType?: string): PluginConfig[] {
    const res = this.config.filter((item): boolean => {
      return !!(!this.pluginStatus[item.pluginKey] || this.pluginStatus[item.pluginKey].visible);
    });
    return pluginType ? res.filter((item): boolean => item.type === pluginType) : res;
  }

  public getPluginConfig(): PluginConfig[] {
    return this.config;
  }
}
