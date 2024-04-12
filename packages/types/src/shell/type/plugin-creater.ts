import { IPublicTypePluginConfig } from './';
import { IPublicModelPluginContext } from '../model';

export type IPublicTypePluginCreater = (
  ctx: IPublicModelPluginContext, options: any
) => IPublicTypePluginConfig;
