import { IDesigner, ILowCodePluginManager, LowCodePluginManager } from '@alilc/lowcode-designer';
import { createModuleEventBus, Editor, IEditor, IEventBus, makeObservable, obx } from '@alilc/lowcode-editor-core';
import { IPublicApiPlugins, IPublicApiWorkspace, IPublicEnumPluginRegisterLevel, IPublicResourceList, IPublicTypeDisposable, IPublicTypeResourceType, IShellModelFactory } from '@alilc/lowcode-types';
import { BasicContext } from './context/base-context';
import { EditorWindow, WINDOW_STATE } from './window';
import type { IEditorWindow } from './window';
import { IResource, Resource } from './resource';
import { IResourceType, ResourceType } from './resource-type';

enum EVENT {
  CHANGE_WINDOW = 'change_window',

  CHANGE_ACTIVE_WINDOW = 'change_active_window',

  WINDOW_RENDER_READY = 'window_render_ready',

  CHANGE_ACTIVE_EDITOR_VIEW = 'change_active_editor_view',
}

const CHANGE_EVENT = 'resource.list.change';

export interface IWorkspace extends Omit<IPublicApiWorkspace<
  LowCodePluginManager,
  IEditorWindow
>, 'resourceList' | 'plugins'> {
  readonly registryInnerPlugin: (designer: IDesigner, editor: Editor, plugins: IPublicApiPlugins) => Promise<IPublicTypeDisposable>;

  readonly shellModelFactory: IShellModelFactory;

  enableAutoOpenFirstWindow: boolean;

  window: IEditorWindow;

  plugins: ILowCodePluginManager;

  resourceTypeMap: Map<string, ResourceType>;

  getResourceList(): IResource[];

  getResourceType(resourceName: string): IResourceType;

  checkWindowQueue(): void;

  emitWindowRendererReady(): void;

  initWindow(): void;

  setActive(active: boolean): void;

  onChangeActiveEditorView(fn: () => void): IPublicTypeDisposable;

  emitChangeActiveEditorView(): void;
}

export class Workspace implements IWorkspace {
  context: BasicContext;

  enableAutoOpenFirstWindow: boolean;

  resourceTypeMap: Map<string, ResourceType> = new Map();

  private emitter: IEventBus = createModuleEventBus('workspace');

  private _isActive = false;

  private resourceList: IResource[] = [];

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

  @obx.ref windows: IEditorWindow[] = [];

  editorWindowMap: Map<string, IEditorWindow> = new Map<string, IEditorWindow>();

  @obx.ref window: IEditorWindow;

  windowQueue: {
    name: string;
    title: string;
    options: Object;
    viewType?: string;
  }[] = [];

  constructor(
    readonly registryInnerPlugin: (designer: IDesigner, editor: IEditor, plugins: IPublicApiPlugins) => Promise<IPublicTypeDisposable>,
    readonly shellModelFactory: any,
  ) {
    this.context = new BasicContext(this, '', IPublicEnumPluginRegisterLevel.Workspace);
    this.context.innerHotkey.activate(true);
    makeObservable(this);
  }

  checkWindowQueue() {
    if (!this.windowQueue || !this.windowQueue.length) {
      return;
    }

    const windowInfo = this.windowQueue.shift();
    if (windowInfo) {
      this.openEditorWindow(windowInfo.name, windowInfo.title, windowInfo.options, windowInfo.viewType);
    }
  }

  async initWindow() {
    if (!this.defaultResourceType || this.enableAutoOpenFirstWindow === false) {
      return;
    }
    const resourceName = this.defaultResourceType.name;
    const resource = new Resource({
      resourceName,
      options: {},
    }, this.defaultResourceType, this);
    this.window = new EditorWindow(resource, this, {
      title: resource.title,
    });
    await this.window.init();
    this.editorWindowMap.set(this.window.id, this.window);
    this.windows = [...this.windows, this.window];
    this.emitChangeWindow();
    this.emitChangeActiveWindow();
  }

  setActive(value: boolean) {
    this._isActive = value;
  }

  async registerResourceType(resourceTypeModel: IPublicTypeResourceType): Promise<void> {
    const resourceType = new ResourceType(resourceTypeModel);
    this.resourceTypeMap.set(resourceTypeModel.resourceName, resourceType);

    if (!this.window && this.defaultResourceType && this._isActive) {
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

  onWindowRendererReady(fn: () => void): IPublicTypeDisposable {
    this.emitter.on(EVENT.WINDOW_RENDER_READY, fn);
    return () => {
      this.emitter.off(EVENT.WINDOW_RENDER_READY, fn);
    };
  }

  emitWindowRendererReady() {
    this.emitter.emit(EVENT.WINDOW_RENDER_READY);
  }

  getResourceType(resourceName: string): IResourceType {
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
    if (index < 0) {
      return;
    }
    const window = this.windows[index];
    this.windows.splice(index, 1);
    this.window?.updateState(WINDOW_STATE.destroyed);
    if (this.window === window) {
      this.window = this.windows[index] || this.windows[index + 1] || this.windows[index - 1];
      if (this.window?.sleep) {
        this.window.init();
      }
      this.emitChangeActiveWindow();
    }
    this.emitChangeWindow();
    this.window?.updateState(WINDOW_STATE.active);
  }

  removeEditorWindow(resourceName: string, title: string) {
    const index = this.windows.findIndex(d => (d.resource?.name === resourceName && d.title === title));
    this.remove(index);
  }

  async openEditorWindowById(id: string) {
    const window = this.editorWindowMap.get(id);
    this.window?.updateState(WINDOW_STATE.inactive);
    if (window) {
      this.window = window;
      if (window.sleep) {
        await window.init();
      }
      this.emitChangeActiveWindow();
    }
    this.window?.updateState(WINDOW_STATE.active);
  }

  async openEditorWindow(name: string, title: string, options: Object, viewType?: string, sleep?: boolean) {
    if (this.window && !this.window?.initReady && !sleep) {
      this.windowQueue.push({
        name, title, options, viewType,
      });
      return;
    }
    const resourceType = this.resourceTypeMap.get(name);
    if (!resourceType) {
      console.error(`${name} resourceType is not available`);
      return;
    }
    this.window?.updateState(WINDOW_STATE.inactive);
    const filterWindows = this.windows.filter(d => (d.resource?.name === name && d.resource.title == title));
    if (filterWindows && filterWindows.length) {
      this.window = filterWindows[0];
      if (!sleep && this.window.sleep) {
        await this.window.init();
      } else {
        this.checkWindowQueue();
      }
      this.emitChangeActiveWindow();
      this.window?.updateState(WINDOW_STATE.active);
      return;
    }
    const resource = new Resource({
      resourceName: name,
      title,
      options,
    }, resourceType, this);
    const window = new EditorWindow(resource, this, {
      title,
      options,
      viewType,
      sleep,
    });
    this.windows = [...this.windows, window];
    this.editorWindowMap.set(window.id, window);
    if (!sleep) {
      this.window = window;
      await this.window.init();
    }
    this.emitChangeWindow();
    this.emitChangeActiveWindow();
    this.window?.updateState(WINDOW_STATE.active);
  }

  onChangeWindows(fn: () => void) {
    this.emitter.on(EVENT.CHANGE_WINDOW, fn);
    return () => {
      this.emitter.removeListener(EVENT.CHANGE_WINDOW, fn);
    };
  }

  onChangeActiveEditorView(fn: () => void) {
    this.emitter.on(EVENT.CHANGE_ACTIVE_EDITOR_VIEW, fn);
    return () => {
      this.emitter.removeListener(EVENT.CHANGE_ACTIVE_EDITOR_VIEW, fn);
    };
  }

  emitChangeActiveEditorView() {
    this.emitter.emit(EVENT.CHANGE_ACTIVE_EDITOR_VIEW);
  }

  emitChangeWindow() {
    this.emitter.emit(EVENT.CHANGE_WINDOW);
  }

  emitChangeActiveWindow() {
    this.emitter.emit(EVENT.CHANGE_ACTIVE_WINDOW);
    this.emitChangeActiveEditorView();
  }

  onChangeActiveWindow(fn: () => void) {
    this.emitter.on(EVENT.CHANGE_ACTIVE_WINDOW, fn);
    return () => {
      this.emitter.removeListener(EVENT.CHANGE_ACTIVE_WINDOW, fn);
    };
  }
}
