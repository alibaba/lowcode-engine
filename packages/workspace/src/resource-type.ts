import { IPublicTypeResourceType } from '@alilc/lowcode-types';

export class ResourceType {
  constructor(readonly resourceTypeModel: IPublicTypeResourceType) {
  }

  get name() {
    return this.resourceTypeModel.resourceName;
  }

  get type() {
    return this.resourceTypeModel.resourceType;
  }
}