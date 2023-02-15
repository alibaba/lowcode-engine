import { IPublicTypePluginMeta } from '../type/plugin-meta';

export interface IPublicModelPluginInstance {

  /**
   * 是否 disable
   * current plugin instance is disabled or not
   */
  disabled: boolean;

  /**
   * 插件名称
   * plugin name
   */
  get pluginName(): string;

  /**
   * 依赖信息，依赖的其他插件
   * depenency info
   */
  get dep(): string[];

  /**
   * 插件配置元数据
   * meta info of this plugin
   */
  get meta(): IPublicTypePluginMeta;
}
