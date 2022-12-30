import { Designer } from '@alilc/lowcode-designer';
import { createModuleEventBus, Editor, IEventBus, makeObservable, obx } from '@alilc/lowcode-editor-core';
import { Plugins } from '@alilc/lowcode-shell';
import { IPublicApiWorkspace, IPublicResourceOptions } from '@alilc/lowcode-types';
import { BasicContext } from './base-context';
import { EditorWindow } from './editor-window/context';
import { Resource } from './resource';

enum event {
  ChangeWindow = 'change_window',

  ChangeActiveWindow = 'change_active_window',
}

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
    const title = this.defaultResource.title;
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

  private resources: Map<string, Resource> = new Map();

  async registerResourceType(resourceName: string, resourceType: 'editor' | 'webview', options: IPublicResourceOptions): Promise<void> {
    if (resourceType === 'editor') {
      const resource = new Resource(options);
      this.resources.set(resourceName, resource);

      if (!this.window && this.defaultResource) {
        this.initWindow();
      }
    }
  }

  get defaultResource(): Resource | null {
    if (this.resources.size > 1) {
      return this.resources.values().next().value;
    }

    return null;
  }

  removeResourceType(resourceName: string) {
    if (this.resources.has(resourceName)) {
      this.resources.delete(resourceName);
    }
  }

  removeEditorWindowById(id: string) {
    const index = this.windows.findIndex(d => (d.id === id));
    this.remove(index);
  }

  private remove(index: number) {
    const window = this.windows[index];
    this.windows = this.windows.splice(index - 1, 1);
    if (this.window === window) {
      this.window = this.windows[index] || this.windows[index + 1] || this.windows[index - 1];
      this.emitChangeActiveWindow();
    }
    this.emitChangeWindow();
  }

  removeEditorWindow(resourceName: string, title: string) {
    const index = this.windows.findIndex(d => (d.resourceName === resourceName && d.title));
    this.remove(index);
  }

  openEditorWindowById(id: string) {
    const window = this.editorWindowMap.get(id);
    if (window) {
      this.window = window;
      this.emitChangeActiveWindow();
    }
  }

  openEditorWindow(resourceName: string, title: string, viewType?: string) {
    const resource = this.resources.get(resourceName);
    if (!resource) {
      console.error(`${resourceName} is not available`);
      return;
    }
    const filterWindows = this.windows.filter(d => (d.resourceName === resourceName && d.title == title));
    if (filterWindows && filterWindows.length) {
      this.window = filterWindows[0];
      this.emitChangeActiveWindow();
      return;
    }
    this.window = new EditorWindow(resource, this, title);
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
