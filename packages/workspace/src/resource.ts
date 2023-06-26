import { ISkeleton } from '@alilc/lowcode-editor-skeleton';
import { IPublicTypeEditorView, IPublicResourceData, IPublicResourceTypeConfig, IBaseModelResource, IPublicEnumPluginRegisterLevel } from '@alilc/lowcode-types';
import { Logger } from '@alilc/lowcode-utils';
import { BasicContext, IBasicContext } from './context/base-context';
import { ResourceType, IResourceType } from './resource-type';
import { IWorkspace } from './workspace';

const logger = new Logger({ level: 'warn', bizName: 'workspace:resource' });

export interface IBaseResource<T> extends IBaseModelResource<T> {
  readonly resourceType: ResourceType;

  skeleton: ISkeleton;

  description?: string;

  get editorViews(): IPublicTypeEditorView[];

  get defaultViewType(): string;

  getEditorView(name: string): IPublicTypeEditorView | undefined;

  import(schema: any): Promise<any>;

  save(value: any): Promise<any>;

  url(): Promise<string | undefined>;
}

export type IResource = IBaseResource<IResource>;

export class Resource implements IResource {
  private context: IBasicContext;

  resourceTypeInstance: IPublicResourceTypeConfig;

  editorViewMap: Map<string, IPublicTypeEditorView> = new Map<string, IPublicTypeEditorView>();

  get name() {
    return this.resourceType.name;
  }

  get viewName() {
    return this.resourceData.viewName || (this.resourceData as any).viewType || this.defaultViewType;
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

  get defaultViewType() {
    return this.resourceTypeInstance.defaultViewType;
  }

  getEditorView(name: string) {
    return this.editorViewMap.get(name);
  }
}