// import { LowCodePluginManager } from "@alilc/lowcode-designer";
// import { Editor, Hotkey } from "@alilc/lowcode-editor-core";
// import { Material } from "@alilc/lowcode-shell";

// import {
//   Skeleton as InnerSkeleton,
//   SettingsPrimaryPane,
//   registerDefaults,
//   Workbench,
// } from '@alilc/lowcode-editor-skeleton';
import { EditorViewOptions } from '@alilc/lowcode-workspace';
import { BasicContext } from './base-context';

export class Context extends BasicContext {
  constructor(public editorView: EditorViewOptions) {
    super();
    this.init();
  }

  async init() {
    await this.editorView?.init(this);
    this.plugins.init();
  }
}