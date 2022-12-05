import { makeObservable, obx } from '@alilc/lowcode-editor-core';
import { Resource } from './resource';

export class EditorWindow {
  constructor(public resource: Resource) {
    // debugger
    makeObservable(this);
    this.editorView = resource.getEditorView(this.resource.defaultViewType);
  }

  @obx editorView;

  changeViewType(name: string) {
    this.editorView = this.resource.getEditorView(name);
  }
}