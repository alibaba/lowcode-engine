import { Designer } from '@alilc/lowcode-designer';
import { createModuleEventBus, Editor, IEventBus, makeObservable, obx } from '@alilc/lowcode-editor-core';
import { Plugins } from '@alilc/lowcode-shell';
import { IPublicApiWorkspace, IPublicResourceList, IPublicResourceOptions } from '@alilc/lowcode-types';
import { BasicContext } from './base-context';
import { EditorWindow } from './editor-window/context';
import { Resource } from './resource';
import { ResourceType } from './resource-type';

enum event {
  ChangeWindow = 'change_window',

  ChangeActiveWindow = 'change_active_window',
}

const CHANGE_EVENT = 'resource.list.change';

export class Workspace implements IPublicApiWorkspace {
  private context: BasicContext;

  private emitter: IEventBus = createModuleEventBus('workspace');

  get skeleton() {
    return this.context.innerSkeleton;
  }

  get plugins() {
    return this.context.innerPlugins;
  }

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
    if (!this.defaultResource) {
      return;
    }
    const title = this.defaultResource.description;
    this.window = new EditorWindow(this.defaultResource, this, title);
    this.editorWindowMap.set(this.window.id, this.window);
    this.windows.push(this.window);
    this.emitChangeWindow();
    this.emitChangeActiveWindow();
  }

  private _isActive = false;

  get isActive() {
    return this._isActive;
  }

  setActive(value: boolean) {
    this._isActive = value;
  }

  windows: EditorWindow[] = [];

  editorWindowMap: Map<string, EditorWindow> = new Map<string, EditorWindow>();

  @obx.ref window: EditorWindow;

  private resourceTypeMap: Map<string, ResourceType> = new Map();

  private resourceList: Resource[] = [];

  async registerResourceType(resourceName: string, type: 'editor' | 'webview', options: IPublicResourceOptions): Promise<void> {
    if (type === 'editor') {
      const resourceType = new ResourceType(resourceName, type, options);
      this.resourceTypeMap.set(resourceName, resourceType);

      if (!this.window && this.defaultResource) {
        this.initWindow();
      }
    }
  }

  getResourceList() {
    return this.resourceList;
  }

  setResourceList(resourceList: IPublicResourceList) {
    this.resourceList = resourceList.map(d => new Resource(d, this.getResourceType(d.resourceName)));
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

  get defaultResource(): ResourceType | null {
    if (this.resourceTypeMap.size > 1) {
      return this.resourceTypeMap.values().next().value;
    }

    return null;
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

  removeEditorWindow(resourceName: string, title: string) {
    const index = this.windows.findIndex(d => (d.resourceType.name === resourceName && d.title));
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
      console.error(`${name} is not available`);
      return;
    }
    const filterWindows = this.windows.filter(d => (d.resourceType.name === name && d.title == title));
    if (filterWindows && filterWindows.length) {
      this.window = filterWindows[0];
      this.emitChangeActiveWindow();
      return;
    }
    this.window = new EditorWindow(resourceType, this, title, options);
    this.windows.push(this.window);
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
