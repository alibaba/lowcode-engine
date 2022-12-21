import { makeObservable, obx } from '@alilc/lowcode-editor-core';
import { EditorViewOptions, EditorWindow, ViewFunctions } from '@alilc/lowcode-workspace';
import { flow } from 'mobx';
import { BasicContext } from '../base-context';

export class Context extends BasicContext {
  name = 'editor-view';

  instance: ViewFunctions;

  constructor(public workspace: any, public editorWindow: EditorWindow, public editorView: EditorViewOptions) {
    super(workspace, editorView.viewName, editorWindow);
    this.name = editorView.viewName;
    this.instance = editorView(this.innerPlugins._getLowCodePluginContext({
      pluginName: 'any',
    }));
    makeObservable(this);
  }

  @obx _activate = false;

  setActivate = (_activate: boolean) => {
    this._activate = _activate;
    this.innerHotkey.activate(this._activate);
  };

  get active() {
    return this._activate;
  }

  @obx isInit: boolean = false;

  init = flow(function* (this: any) {
    yield this.registerInnerPlugins();
    yield this.instance?.init();
    yield this.innerPlugins.init();
    this.isInit = true;
  });

  async save() {
    return await this.instance?.save?.();
  }
}