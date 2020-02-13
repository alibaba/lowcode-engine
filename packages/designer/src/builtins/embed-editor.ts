import MediumEditor from 'medium-editor';
import { computed, obx } from '@ali/recore';
import { current } from './current';
import ElementNode from '../document/node/element-node';

class EmbedEditor {
  @obx container?: HTMLDivElement | null;
  private _editor?: any;
  @computed getEditor(): any | null {
    if (this._editor) {
      this._editor.destroy();
      this._editor = null;
    }
    const win = current.document!.contentWindow;
    const doc = current.document!.ownerDocument;
    if (!win || !doc || !this.container) {
      return null;
    }

    const rect = this.container.getBoundingClientRect();

    this._editor = new MediumEditor([], {
      contentWindow: win,
      ownerDocument: doc,
      toolbar: {
        diffLeft: rect.left,
        diffTop: rect.top - 10,
      },
      elementsContainer: this.container,
    });
    return this._editor;
  }

  @obx.ref editing?: [ElementNode, string, HTMLElement];

  edit(node: ElementNode, prop: string, el: HTMLElement) {
    const ed = this.getEditor();
    if (!ed) {
      return;
    }
    this.exitAndSave();
    console.info(el);
    this.editing = [node, prop, el];
    ed.origElements = el;
    ed.setup();
  }

  exitAndSave() {
    this.editing = undefined;
    // removeElements
    // get content save to
  }

  mount(container?: HTMLDivElement | null) {
    this.container = container;
  }
}

export default new EmbedEditor();
