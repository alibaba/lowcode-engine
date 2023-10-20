import { IPublicApiWorkspace, IPublicResourceList, IPublicTypeDisposable, IPublicTypeResourceType } from '@alilc/lowcode-types';
import { IWorkspace } from '@alilc/lowcode-workspace';
import { resourceSymbol, workspaceSymbol } from '../symbols';
import { Resource as ShellResource, Window as ShellWindow } from '../model';
import { Plugins } from './plugins';
import { Skeleton } from './skeleton';

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
    if (!this[workspaceSymbol].window) {
      return null;
    }
    return new ShellWindow(this[workspaceSymbol].window);
  }

  get resourceTypeList() {
    return Array.from(this[workspaceSymbol].resourceTypeMap.values()).map((d) => {
      const { name: resourceName, type: resourceType } = d;
      const {
        description,
        editorViews,
      } = d.resourceTypeModel({} as any, {});

      return {
        resourceName,
        resourceType,
        description,
        editorViews: editorViews.map(d => (
          {
            viewName: d.viewName,
            viewType: d.viewType || 'editor',
          }
        )),
      };
    });
  }

  onWindowRendererReady(fn: () => void): IPublicTypeDisposable {
    return this[workspaceSymbol].onWindowRendererReady(fn);
  }

  registerResourceType(resourceTypeModel: IPublicTypeResourceType): void {
    this[workspaceSymbol].registerResourceType(resourceTypeModel);
  }

  async openEditorWindow(): Promise<void> {
    if (typeof arguments[0] === 'string') {
      await this[workspaceSymbol].openEditorWindow(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    } else {
      await this[workspaceSymbol].openEditorWindowByResource(arguments[0]?.[resourceSymbol], arguments[1]);
    }
  }

  openEditorWindowById(id: string) {
    this[workspaceSymbol].openEditorWindowById(id);
  }

  removeEditorWindow() {
    if (typeof arguments[0] === 'string') {
      this[workspaceSymbol].removeEditorWindow(arguments[0], arguments[1]);
    } else {
      this[workspaceSymbol].removeEditorWindowByResource(arguments[0]?.[resourceSymbol]);
    }
  }

  removeEditorWindowById(id: string) {
    this[workspaceSymbol].removeEditorWindowById(id);
  }

  get plugins() {
    return new Plugins(this[workspaceSymbol].plugins, true);
  }

  get skeleton() {
    return new Skeleton(this[workspaceSymbol].skeleton, 'workspace', true);
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

  onChangeActiveEditorView(fn: () => void): IPublicTypeDisposable {
    return this[workspaceSymbol].onChangeActiveEditorView(fn);
  }
}
