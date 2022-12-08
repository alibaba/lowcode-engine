import { Editor } from '@alilc/lowcode-editor-core';
import {
  Skeleton as InnerSkeleton,
} from '@alilc/lowcode-editor-skeleton';
import { EditorWindow } from './editor-window/context';
import { Resource } from './resource';
export { Resource } from './resource';
export * from './editor-window/context';
export * from './layouts/workbench';

export class WorkSpace {
  constructor() {
    this.editor = new Editor();
    this.skeleton = new InnerSkeleton(this.editor);
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

  registerResourceType(resourceName: string, resourceType: 'editor' | 'webview', options: ResourceOptions): void {
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

export interface ResourceOptions {
  description: string;
  defaultViewType?: string;
  editorViews?: EditorViewOptions[];
  init: (ctx: any) => Promise<void>;
  dispose: (ctx: any) => Promise<void>;
  import: (ctx: any) => Promise<any>;
}

export interface EditorViewOptions {
  name: string;
  init: (ctx: any) => Promise<void>;
  save: (ctx: any) => Promise<void>;
}