import { IPublicApiWorkspace } from '@alilc/lowcode-types';
import { Workspace as InnerWorkSpace } from '@alilc/lowcode-workspace';
import { Plugins } from '@alilc/lowcode-shell';
import { Window } from '../model/window';
import { workspaceSymbol } from '../symbols';

export class Workspace implements IPublicApiWorkspace {
  readonly [workspaceSymbol]: InnerWorkSpace;

  constructor(innerWorkspace: InnerWorkSpace) {
    this[workspaceSymbol] = innerWorkspace;
  }

  get isActive() {
    return this[workspaceSymbol].isActive;
  }

  get window() {
    return new Window(this[workspaceSymbol].window);
  }

  registerResourceType(resourceName: string, resourceType: 'editor', options: any): void {
    this[workspaceSymbol].registerResourceType(resourceName, resourceType, options);
  }

  openEditorWindow(resourceName: string, title: string, viewType?: string) {
    this[workspaceSymbol].openEditorWindow(resourceName, title, viewType);
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
