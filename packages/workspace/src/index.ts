import { Editor } from '@alilc/lowcode-editor-core';
import {
  Skeleton as InnerSkeleton,
} from '@alilc/lowcode-editor-skeleton';
import { IPublicResourceOptions } from '@alilc/lowcode-types';
import { EditorWindow } from './editor-window/context';
import { Resource } from './resource';

export { Resource } from './resource';
export * from './editor-window/context';
export * from './layouts/workbench';

export class Workspace {
  readonly editor = new Editor();
  readonly skeleton = new InnerSkeleton(this.editor);

  constructor() {
    if (this.defaultResource) {
      this.window = new EditorWindow(this.defaultResource, this);
    }
  }

  private _isActive = false;

  get isActive() {
    return this._isActive;
  }

  setActive(value: boolean) {
    this._isActive = value;
  }

  editorWindows: [];

  window: EditorWindow;

  private resources: Map<string, Resource> = new Map();

  registerResourceType(resourceName: string, resourceType: 'editor' | 'webview', options: IPublicResourceOptions): void {
    if (resourceType === 'editor') {
      const resource = new Resource(options);
      this.resources.set(resourceName, resource);

      if (!this.window) {
        this.window = new EditorWindow(this.defaultResource, this);
      }
    }
  }

  get defaultResource() {
    if (this.resources.size === 1) {
      return this.resources.values().next().value;
    }

    return null;
  }

  removeResourceType(resourceName: string) {
    if (this.resources.has(resourceName)) {
      this.resources.delete(resourceName);
    }
  }

  openEditorWindow() {}
}
