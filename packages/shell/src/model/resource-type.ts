import { IPublicModelResourceType } from '@alilc/lowcode-types';
import { ResourceType as InnerResourceType } from '@alilc/lowcode-workspace';
import { resourceTypeSymbol } from '../symbols';

export class ResourceType implements IPublicModelResourceType {
  readonly [resourceTypeSymbol]: InnerResourceType;
  constructor(resourceType: InnerResourceType) {
    this[resourceTypeSymbol] = resourceType;
  }

  get name() {
    return this[resourceTypeSymbol].name;
  }

  get description() {
    return this[resourceTypeSymbol].options.description;
  }

  get icon() {
    return this[resourceTypeSymbol].options.icon;
  }
}