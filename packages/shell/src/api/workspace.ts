import { IPublicApiWorkspace } from '@alilc/lowcode-types';
import { Workspace as InnerWorkSpace } from '@alilc/lowcode-workspace';
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
}
