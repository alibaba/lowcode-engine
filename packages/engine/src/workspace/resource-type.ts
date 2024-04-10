import { IPublicTypeResourceType } from '@alilc/lowcode-types';

export interface IResourceType extends ResourceType {}

export class ResourceType implements Omit<IPublicTypeResourceType, 'resourceName' | 'resourceType'> {
  constructor(readonly resourceTypeModel: IPublicTypeResourceType) {
  }

  get name() {
    return this.resourceTypeModel.resourceName;
  }

  get type() {
    return this.resourceTypeModel.resourceType;
  }
}
