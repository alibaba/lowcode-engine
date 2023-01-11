import { IPublicTypePluginConfig } from './';
import { IPublicModelPluginContext } from '../model';

// eslint-disable-next-line max-len
export type IPublicTypePluginCreater = (ctx: IPublicModelPluginContext, options: any) => IPublicTypePluginConfig;
