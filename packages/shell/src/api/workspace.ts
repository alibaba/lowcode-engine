import { IPublicApiWorkspace, IPublicResourceList, IPublicTypeDisposable, IPublicTypeResourceType } from '@alilc/lowcode-types';
import { IWorkspace } from '@alilc/lowcode-workspace';
import { workspaceSymbol } from '../symbols';
import { Resource as ShellResource, Window as ShellWindow } from '../model';
import { Plugins } from './plugins';

export class Workspace implements IPublicApiWorkspace {
  readonly [workspaceSymbol]: IWorkspace;

  constructor(innerWorkspace: IWorkspace) {
    this[workspaceSymbol] = innerWorkspace;
  }

  get resourceList() {
    return this[workspaceSymbol].getResourceList().map((d) => new ShellResource(d));
  }

  setResourceList(resourceList: IPublicResourceList) {
    this[workspaceSymbol].setResourceList(resourceList);
  }

  onResourceListChange(fn: (resourceList: IPublicResourceList) => void): IPublicTypeDisposable {
    return this[workspaceSymbol].onResourceListChange(fn);
  }

  get isActive() {
    return this[workspaceSymbol].isActive;
  }

  get window() {
    return new ShellWindow(this[workspaceSymbol].window);
  }

  registerResourceType(resourceTypeModel: IPublicTypeResourceType): void {
    this[workspaceSymbol].registerResourceType(resourceTypeModel);
  }

  openEditorWindow(resourceName: string, title: string, extra: object, viewName?: string, sleep?: boolean): void {
    this[workspaceSymbol].openEditorWindow(resourceName, title, extra, viewName, sleep);
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
    return this[workspaceSymbol].windows.map((d) => new ShellWindow(d));
  }

  onChangeWindows(fn: () => void): IPublicTypeDisposable {
    return this[workspaceSymbol].onChangeWindows(fn);
  }

  onChangeActiveWindow(fn: () => void): IPublicTypeDisposable {
    return this[workspaceSymbol].onChangeActiveWindow(fn);
  }
}
