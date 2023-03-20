import { IPublicTypeResourceType } from '@alilc/lowcode-types';

export interface IResourceType extends Omit<IPublicTypeResourceType, 'resourceName' | 'resourceType'> {
  name: string;

  type: 'editor' | 'webview';

  resourceTypeModel: IPublicTypeResourceType;
}

export class ResourceType implements IResourceType {
  constructor(readonly resourceTypeModel: IPublicTypeResourceType) {
  }

  get name() {
    return this.resourceTypeModel.resourceName;
  }

  get type() {
    return this.resourceTypeModel.resourceType;
  }
}