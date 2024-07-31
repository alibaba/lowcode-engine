import { IPublicTypeEditorView, IPublicResourceData, IPublicResourceTypeConfig, IBaseModelResource, IPublicEnumPluginRegisterLevel } from '@alilc/lowcode-types';
import { Logger } from '@alilc/lowcode-utils';
import { BasicContext, IBasicContext } from './context/base-context';
import { IResourceType } from './resource-type';
import { IWorkspace } from './workspace';

const logger = new Logger({ level: 'warn', bizName: 'workspace:resource' });

export interface IResource extends Resource {}

export class Resource implements IBaseModelResource<IResource> {
  private context: IBasicContext;

  resourceTypeInstance: IPublicResourceTypeConfig;

  editorViewMap: Map<string, IPublicTypeEditorView> = new Map<string, IPublicTypeEditorView>();

  get name() {
    return this.resourceType.name;
  }

  get viewName() {
    return this.resourceData.viewName || (this.resourceData as any).viewType || this.defaultViewName;
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

  get id(): string | undefined {
    return this.resourceData.id;
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

  children: IResource[];

  get config() {
    return this.resourceData.config;
  }

  constructor(readonly resourceData: IPublicResourceData, readonly resourceType: IResourceType, readonly workspace: IWorkspace) {
    this.context = new BasicContext(workspace, `resource-${resourceData.resourceName || resourceType.name}`, IPublicEnumPluginRegisterLevel.Resource);
    this.resourceTypeInstance = resourceType.resourceTypeModel(this.context.innerPlugins._getLowCodePluginContext({
      pluginName: '',
    }), this.options);
    this.init();
    if (this.resourceTypeInstance.editorViews) {
      this.resourceTypeInstance.editorViews.forEach((d: any) => {
        this.editorViewMap.set(d.viewName, d);
      });
    }
    if (!resourceType) {
      logger.error(`resourceType[${resourceType}] is unValid.`);
    }
    this.children = this.resourceData?.children?.map(d => new Resource(d, this.workspace.getResourceType(d.resourceName || this.resourceType.name), this.workspace)) || [];
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

  get defaultViewName() {
    return this.resourceTypeInstance.defaultViewName || this.resourceTypeInstance.defaultViewType;
  }

  getEditorView(name: string) {
    return this.editorViewMap.get(name);
  }
}