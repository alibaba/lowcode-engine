import { IPublicApiWorkspace, IPublicResourceList, IPublicResourceOptions } from '@alilc/lowcode-types';
import { Workspace as InnerWorkSpace } from '@alilc/lowcode-workspace';
import { Plugins } from '@alilc/lowcode-shell';
import { Window } from '../model/window';
import { workspaceSymbol } from '../symbols';
import { Resource } from '../model';

export class Workspace implements IPublicApiWorkspace {
  readonly [workspaceSymbol]: InnerWorkSpace;

  constructor(innerWorkspace: InnerWorkSpace) {
    this[workspaceSymbol] = innerWorkspace;
  }

  get resourceList() {
    return this[workspaceSymbol].getResourceList().map(d => new Resource(d));
  }

  setResourceList(resourceList: IPublicResourceList) {
    this[workspaceSymbol].setResourceList(resourceList);
  }

  onResourceListChange(fn: (resourceList: IPublicResourceList) => void): () => void {
    return this[workspaceSymbol].onResourceListChange(fn);
  }

  get isActive() {
    return this[workspaceSymbol].isActive;
  }

  get window() {
    return new Window(this[workspaceSymbol].window);
  }

  registerResourceType(name: string, type: 'editor', options: IPublicResourceOptions): void {
    this[workspaceSymbol].registerResourceType(name, type, options);
  }

  openEditorWindow(resourceName: string, title: string, extra: Object, viewName?: string) {
    this[workspaceSymbol].openEditorWindow(resourceName, title, extra, viewName);
  }

  openEditorWindowById(id: string) {
    this[workspaceSymbol].openEditorWindowById(id);
  }

  removeEditorWindow(resourceName: string, title: string) {
    this[workspaceSymbol].removeEditorWindow(resourceName, title);
  }

  removeEditorWindowById(id: string) {
    this[workspaceSymbol].removeEditorWindowById(id);
  }

  get plugins() {
    return new Plugins(this[workspaceSymbol].plugins, true);
  }

  get windows() {
    return this[workspaceSymbol].windows.map(d => new Window(d));
  }

  onChangeWindows(fn: () => void) {
    return this[workspaceSymbol].onChangeWindows(fn);
  }

  onChangeActiveWindow(fn: () => void) {
    return this[workspaceSymbol].onChangeActiveWindow(fn);
  }
}
