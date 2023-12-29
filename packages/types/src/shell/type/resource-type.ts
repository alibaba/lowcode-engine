import { IPublicModelPluginContext } from '../model';
import { IPublicResourceTypeConfig } from './resource-type-config';

export interface IPublicTypeResourceType {
  resourceName: string;

  resourceType: 'editor' | 'webview' | string;

  (ctx: IPublicModelPluginContext, options: Object): IPublicResourceTypeConfig;
}