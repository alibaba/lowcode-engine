import { IPublicTypePluginMeta } from '../type/plugin-meta';

export interface IPublicModelPluginInstance {
  pluginName: string;

  dep: string[];

  disabled: boolean;

  meta: IPublicTypePluginMeta;
}