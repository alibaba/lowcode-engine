import { IPublicTypeEditorView, IPublicModelResource, IPublicResourceData, IPublicResourceTypeConfig } from '@alilc/lowcode-types';
import { Logger } from '@alilc/lowcode-utils';
import { BasicContext } from './base-context';
import { ResourceType } from './resource-type';
import { Workspace as InnerWorkSpace } from './workspace';

const logger = new Logger({ level: 'warn', bizName: 'workspace:resource' });

export class Resource implements IPublicModelResource {
  resourceTypeInstance: IPublicResourceTypeConfig;

  editorViewMap: Map<string, IPublicTypeEditorView> = new Map<string, IPublicTypeEditorView>();

  constructor(readonly resourceData: IPublicResourceData, readonly resourceType: ResourceType, workspace: InnerWorkSpace) {
    this.resourceTypeInstance = resourceType.resourceTypeModel(new BasicContext(workspace, ''), {});
    if (this.resourceTypeInstance.editorViews) {
      this.resourceTypeInstance.editorViews.forEach((d: any) => {
        this.editorViewMap.set(d.viewName, d);
      });
    }
    if (!resourceType) {
      logger.error(`resourceType[${resourceType}] is unValid.`);
    }
  }

  get name() {
    return this.resourceType.name;
  }

  get description() {
    return this.resourceTypeInstance?.description;
  }

  get icon() {
    return this.resourceTypeInstance?.icon;
  }

  get type() {
    return this.resourceType.type;
  }

  get title(): string | undefined {
    return this.resourceData.title || this.resourceTypeInstance.defaultTitle;
  }

  get options() {
    return this.resourceData.options;
  }

  get category() {
    return this.resourceData?.category;
  }

  async import(schema: any) {
    return await this.resourceTypeInstance.import?.(schema);
  }
  async save(value: any) {
    return await this.resourceTypeInstance.save?.(value);
  }

  get editorViews() {
    return this.resourceTypeInstance.editorViews;
  }

  get defaultViewType() {
    return this.resourceTypeInstance.defaultViewType;
  }

  getEditorView(name: string) {
    return this.editorViewMap.get(name);
  }
}