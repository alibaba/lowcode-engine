import { IPublicTypeEditorView, IPublicModelResource, IPublicResourceData, IPublicResourceTypeConfig } from '@alilc/lowcode-types';
import { Logger } from '@alilc/lowcode-utils';
import { BasicContext } from './context/base-context';
import { ResourceType } from './resource-type';
import { Workspace as InnerWorkSpace } from './workspace';

const logger = new Logger({ level: 'warn', bizName: 'workspace:resource' });

export class Resource implements IPublicModelResource {
  private context: BasicContext;

  resourceTypeInstance: IPublicResourceTypeConfig;

  editorViewMap: Map<string, IPublicTypeEditorView> = new Map<string, IPublicTypeEditorView>();

  get name() {
    return this.resourceType.name;
  }

  get viewName() {
    return this.resourceData.viewName || (this.resourceData as any).viewType;
  }

  get description() {
    return this.resourceTypeInstance?.description;
  }

  get icon() {
    return this.resourceData.icon || this.resourceTypeInstance?.icon;
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

  get skeleton() {
    return this.context.innerSkeleton;
  }

  get children(): Resource[] {
    return this.resourceData?.children?.map(d => new Resource(d, this.resourceType, this.workspace)) || [];
  }

  constructor(readonly resourceData: IPublicResourceData, readonly resourceType: ResourceType, readonly workspace: InnerWorkSpace) {
    this.context = new BasicContext(workspace, `resource-${resourceData.resourceName || resourceType.name}`);
    this.resourceTypeInstance = resourceType.resourceTypeModel(this.context, this.options);
    this.init();
    if (this.resourceTypeInstance.editorViews) {
      this.resourceTypeInstance.editorViews.forEach((d: any) => {
        this.editorViewMap.set(d.viewName, d);
      });
    }
    if (!resourceType) {
      logger.error(`resourceType[${resourceType}] is unValid.`);
    }
  }

  async init() {
    await this.resourceTypeInstance.init?.();
    await this.context.innerPlugins.init();
  }

  async import(schema: any) {
    return await this.resourceTypeInstance.import?.(schema);
  }

  async url() {
    return await this.resourceTypeInstance.url?.();
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