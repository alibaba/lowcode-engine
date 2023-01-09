import { IPublicModelResource, IPublicResourceData } from '@alilc/lowcode-types';
import { Logger } from '@alilc/lowcode-utils';
import { ResourceType } from './resource-type';

const logger = new Logger({ level: 'warn', bizName: 'workspace:resource' });

export class Resource implements IPublicModelResource {
  constructor(readonly resourceData: IPublicResourceData, readonly resourceType: ResourceType) {
    if (!resourceType) {
      logger.error(`resourceType[${resourceType}] is unValid.`);
    }
  }

  get icon() {
    return this.resourceType?.icon;
  }

  get type() {
    return this.resourceData.resourceName;
  }

  get title() {
    return this.resourceData.title;
  }

  get options() {
    return this.resourceData.options;
  }
}