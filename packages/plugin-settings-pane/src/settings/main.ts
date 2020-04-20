import { EventEmitter } from 'events';
import { obx, computed } from '@ali/lowcode-globals';
import { Node, Designer, Selection } from '@ali/lowcode-designer';
import { getTreeMaster } from '@ali/lowcode-plugin-outline-pane';
import Editor from '@ali/lowcode-editor-core';
import { SettingTopEntry, generateSessionId } from './setting-entry';

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

  constructor(readonly editor: Editor) {
    const setupSelection = (selection?: Selection) => {
      if (selection) {
        this.setup(selection.getNodes());
      } else {
        this.setup([]);
      }
    };
    editor.on('designer.selection.change', setupSelection);
    this.disposeListener = () => {
      editor.removeListener('designer.selection.change', setupSelection);
    };
    (async () => {
      const designer = await editor.onceGot(Designer);
      getTreeMaster(designer).onceEnableBuiltin(() => {
        this.emitter.emit('outline-visible');
      });
      setupSelection(designer.currentSelection);
    })();
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

    this._settings = new SettingTopEntry(this.editor, nodes);
  }

  onceOutlineVisible(fn: () => void): () => void {
    this.emitter.on('outline-visible', fn);
    return () => {
      this.emitter.removeListener('outline-visible', fn);
    };
  }

  purge() {
    this.disposeListener();
    this.emitter.removeAllListeners();
  }
}
