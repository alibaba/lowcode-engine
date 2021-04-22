import { EventEmitter } from 'events';
import { Node, Designer, Selection, SettingTopEntry } from '@ali/lowcode-designer';
import { Editor, obx, computed } from '@ali/lowcode-editor-core';

function generateSessionId(nodes: Node[]) {
  return nodes
    .map((node) => node.id)
    .sort()
    .join(',');
}

export class SettingsMain {
  private emitter = new EventEmitter();

  private _sessionId = '';

  @obx.ref private _settings?: SettingTopEntry;

  @computed get length(): number | undefined {
    return this._settings?.nodes.length;
  }

  @computed get componentMeta() {
    return this._settings?.componentMeta;
  }

  get settings() {
    return this._settings;
  }

  private disposeListener: () => void;

  private designer?: Designer;

  constructor(readonly editor: Editor) {
    this.init();
  }

  private async init() {
    const setupSelection = (selection?: Selection) => {
      if (selection) {
        this.setup(selection.getNodes());
      } else {
        this.setup([]);
      }
    };
    this.editor.on('designer.selection.change', setupSelection);
    this.disposeListener = () => {
      this.editor.removeListener('designer.selection.change', setupSelection);
    };
    const designer = await this.editor.onceGot(Designer);
    this.designer = designer;
    setupSelection(designer.currentSelection);
  }

  private setup(nodes: Node[]) {
    // check nodes change
    const sessionId = generateSessionId(nodes);
    if (sessionId === this._sessionId) {
      return;
    }
    this._sessionId = sessionId;
    if (nodes.length < 1) {
      this._settings = undefined;
      return;
    }

    if (!this.designer) {
      this.designer = nodes[0].document.designer;
    }

    this._settings?.purge();
    this._settings = this.designer.createSettingEntry(nodes);
  }

  purge() {
    this.disposeListener();
    this.emitter.removeAllListeners();
  }
}
