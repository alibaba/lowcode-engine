import { INode, IDesigner, Selection, SettingTopEntry } from '@alilc/lowcode-designer';
import { Editor, obx, computed, makeObservable, action, IEventBus, createModuleEventBus } from '@alilc/lowcode-editor-core';

function generateSessionId(nodes: INode[]) {
  return nodes
    .map((node) => node.id)
    .sort()
    .join(',');
}

export class SettingsMain {
  private emitter: IEventBus = createModuleEventBus('SettingsMain');

  private _sessionId = '';

  @obx.ref private _settings?: SettingTopEntry;

  @computed get length(): number | undefined {
    return this._settings?.nodes.length;
  }

  @computed get componentMeta() {
    return this._settings?.componentMeta;
  }

  @computed get settings() {
    return this._settings;
  }

  private disposeListener: () => void;

  private _designer?: IDesigner;

  get designer(): IDesigner | undefined {
    return this._designer;
  }

  constructor(readonly editor: Editor) {
    makeObservable(this);
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
    this.editor.eventBus.on('designer.selection.change', setupSelection);
    this.disposeListener = () => {
      this.editor.removeListener('designer.selection.change', setupSelection);
    };
    const designer = await this.editor.onceGot('designer');
    this._designer = designer;
    setupSelection(designer.currentSelection);
  }

  @action
  private setup(nodes: INode[]) {
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

    if (!this._designer) {
      this._designer = nodes[0].document.designer;
    }
    // 当节点只有一个时，复用 node 上挂载的 settingEntry，不会产生平行的两个实例，这样在整个系统中对
    // 某个节点操作的 SettingTopEntry 只有一个实例，后续的 getProp() 也会拿到相同的 SettingField 实例
    if (nodes.length === 1) {
      this._settings = nodes[0].settingEntry;
    } else {
      this._settings = this._designer.createSettingEntry(nodes);
    }
  }

  purge() {
    this.disposeListener();
    this.emitter.removeAllListeners();
  }
}
