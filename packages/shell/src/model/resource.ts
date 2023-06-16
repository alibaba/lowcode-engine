import { IPublicModelResource } from '@alilc/lowcode-types';
import { IResource } from '@alilc/lowcode-workspace';
import { resourceSymbol } from '../symbols';

export class Resource implements IPublicModelResource {
  readonly [resourceSymbol]: IResource;

  constructor(resource: IResource) {
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

  get name() {
    return this[resourceSymbol].resourceType.name;
  }

  get config() {
    return this[resourceSymbol].config;
  }

  get type() {
    return this[resourceSymbol].resourceType.type;
  }

  get category() {
    return this[resourceSymbol].category;
  }

  get children() {
    return this[resourceSymbol].children.map((child) => new Resource(child));
  }

  get viewName() {
    return this[resourceSymbol].viewName;
  }
}