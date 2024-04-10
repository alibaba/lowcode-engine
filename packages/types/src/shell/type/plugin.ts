/* eslint-disable max-len */
import { IPublicTypePluginMeta, IPublicTypePluginCreater } from './';

export interface IPublicTypePlugin extends IPublicTypePluginCreater {
  pluginName: string;
  meta?: IPublicTypePluginMeta;
}
