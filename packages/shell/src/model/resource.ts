import { IPublicModelResource } from '@alilc/lowcode-types';
import { Resource as InnerResource } from '@alilc/lowcode-workspace';
import { resourceSymbol } from '../symbols';
import { ResourceType } from './resource-type';

export class Resource implements IPublicModelResource {
  readonly [resourceSymbol]: InnerResource;

  constructor(resource: InnerResource) {
    this[resourceSymbol] = resource;
  }

  get title() {
    return this[resourceSymbol].title;
  }

  get icon() {
    return this[resourceSymbol].icon;
  }

  get options() {
    return this[resourceSymbol].options;
  }

  get resourceType() {
    return new ResourceType(this[resourceSymbol].resourceType);
  }
}