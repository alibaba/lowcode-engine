import { EditorWindow } from '@alilc/lowcode-workspace';
import { BasicContext } from '@alilc/lowcode-editor-view';

export class Context extends BasicContext {
  constructor(public editorWindow: EditorWindow) {
    super();
    this.init();
  }

  async init() {
    await this.editorWindow.resource.init(this);
    this.plugins.init();
  }
}