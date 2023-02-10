import { IPublicModelPluginContext } from '../model';
import { IPublicResourceTypeConfig } from './resource-type-config';

export interface IPublicTypeResourceType {
  resourceName: string;

  resourceType: string;

  (ctx: IPublicModelPluginContext): IPublicResourceTypeConfig;
}