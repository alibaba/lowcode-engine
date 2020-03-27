import { PluginConfig, PluginStatus, PluginClass, HOCPlugin } from './definitions';
import Editor from './index';
export default class AreaManager {
    private pluginStatus;
    private config;
    private editor;
    private area;
    constructor(editor: Editor, area: string);
    isPluginStatusUpdate(pluginType?: string, notUpdateStatus?: boolean): boolean;
    getVisiblePluginList(pluginType?: string): PluginConfig[];
    getPlugin(pluginKey: string): HOCPlugin | void;
    getPluginConfig(pluginKey?: string): PluginConfig[] | PluginConfig | undefined;
    getPluginClass(pluginKey: string): PluginClass | void;
    getPluginStatus(pluginKey: string): PluginStatus | void;
}
