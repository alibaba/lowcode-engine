import { Designer, LowCodePluginManager } from '@alilc/lowcode-designer';
import { createModuleEventBus, Editor, IEventBus, makeObservable, obx } from '@alilc/lowcode-editor-core';
import { Plugins } from '@alilc/lowcode-shell';
import { IPublicApiWorkspace, IPublicResourceList, IPublicTypeResourceType } from '@alilc/lowcode-types';
import { BasicContext } from './context/base-context';
import { EditorWindow } from './window';
import { Resource } from './resource';
import { ResourceType } from './resource-type';

enum event {
  ChangeWindow = 'change_window',

  ChangeActiveWindow = 'change_active_window',
}

const CHANGE_EVENT = 'resource.list.change';

interface IWorkspace extends Omit<IPublicApiWorkspace<
LowCodePluginManager
>, 'resourceList'> {}

export class Workspace implements IWorkspace {
  context: BasicContext;

  private emitter: IEventBus = createModuleEventBus('workspace');

  private _isActive = false;

  private resourceTypeMap: Map<string, ResourceType> = new Map();

  private resourceList: Resource[] = [];

  get skeleton() {
    return this.context.innerSkeleton;
  }

  get plugins() {
    return this.context.innerPlugins;
  }

  get isActive() {
    return this._isActive;
  }

  get defaultResourceType(): ResourceType | null {
    if (this.resourceTypeMap.size >= 1) {
      return Array.from(this.resourceTypeMap.values())[0];
    }

    return null;
  }

  @obx.ref windows: EditorWindow[] = [];

  editorWindowMap: Map<string, EditorWindow> = new Map<string, EditorWindow>();

  @obx.ref window: EditorWindow;

  constructor(
    readonly registryInnerPlugin: (designer: Designer, editor: Editor, plugins: Plugins) => Promise<void>,
    readonly shellModelFactory: any,
  ) {
    this.init();
    makeObservable(this);
  }

  init() {
    this.initWindow();
    this.context = new BasicContext(this, '');
  }

  initWindow() {
    if (!this.defaultResourceType) {
      return;
    }
    const title = this.defaultResourceType.name;
    const resource = new Resource({}, this.defaultResourceType, this);
    this.window = new EditorWindow(resource, this, {
      title,
    });
    this.editorWindowMap.set(this.window.id, this.window);
    this.windows.push(this.window);
    this.emitChangeWindow();
    this.emitChangeActiveWindow();
  }

  setActive(value: boolean) {
    this._isActive = value;
  }

  async registerResourceType(resourceTypeModel: IPublicTypeResourceType): Promise<void> {
    const resourceType = new ResourceType(resourceTypeModel);
    this.resourceTypeMap.set(resourceTypeModel.resourceName, resourceType);

    if (!this.window && this.defaultResourceType) {
      this.initWindow();
    }
  }

  getResourceList() {
    return this.resourceList;
  }

  setResourceList(resourceList: IPublicResourceList) {
    this.resourceList = resourceList.map(d => new Resource(d, this.getResourceType(d.resourceName), this));
    this.emitter.emit(CHANGE_EVENT, resourceList);
  }

  onResourceListChange(fn: (resourceList: IPublicResourceList) => void): () => void {
    this.emitter.on(CHANGE_EVENT, fn);
    return () => {
      this.emitter.off(CHANGE_EVENT, fn);
    };
  }

  getResourceType(resourceName: string): ResourceType {
    return this.resourceTypeMap.get(resourceName)!;
  }

  removeResourceType(resourceName: string) {
    if (this.resourceTypeMap.has(resourceName)) {
      this.resourceTypeMap.delete(resourceName);
    }
  }

  removeEditorWindowById(id: string) {
    const index = this.windows.findIndex(d => (d.id === id));
    this.remove(index);
  }

  private remove(index: number) {
    const window = this.windows[index];
    this.windows.splice(index, 1);
    if (this.window === window) {
      this.window = this.windows[index] || this.windows[index + 1] || this.windows[index - 1];
      this.emitChangeActiveWindow();
    }
    this.emitChangeWindow();
  }

  removeEditorWindow(resourceName: string) {
    const index = this.windows.findIndex(d => (d.resource.name === resourceName && d.title));
    this.remove(index);
  }

  openEditorWindowById(id: string) {
    const window = this.editorWindowMap.get(id);
    if (window) {
      this.window = window;
      this.emitChangeActiveWindow();
    }
  }

  openEditorWindow(name: string, title: string, options: Object, viewType?: string) {
    const resourceType = this.resourceTypeMap.get(name);
    if (!resourceType) {
      console.error(`${name} resourceType is not available`);
      return;
    }
    const filterWindows = this.windows.filter(d => (d.resource.name === name && d.resource.title == title));
    if (filterWindows && filterWindows.length) {
      this.window = filterWindows[0];
      this.emitChangeActiveWindow();
      return;
    }
    const resource = new Resource({
      resourceName: name,
      title,
      options,
    }, resourceType, this);
    this.window = new EditorWindow(resource, this, {
      title,
      options,
      viewType,
    });
    this.windows = [...this.windows, this.window];
    this.editorWindowMap.set(this.window.id, this.window);
    this.emitChangeWindow();
    this.emitChangeActiveWindow();
  }

  onChangeWindows(fn: () => void) {
    this.emitter.on(event.ChangeWindow, fn);
    return () => {
      this.emitter.removeListener(event.ChangeWindow, fn);
    };
  }

  emitChangeWindow() {
    this.emitter.emit(event.ChangeWindow);
  }

  emitChangeActiveWindow() {
    this.emitter.emit(event.ChangeActiveWindow);
  }

  onChangeActiveWindow(fn: () => void) {
    this.emitter.on(event.ChangeActiveWindow, fn);
    return () => {
      this.emitter.removeListener(event.ChangeActiveWindow, fn);
    };
  }
}
