import { computed, makeObservable, obx } from '@alilc/lowcode-editor-core';
import { Context } from '../editor-view/context';
import { WorkSpace } from '..';
import { Resource } from '../resource';

export class EditorWindow {
  constructor(public resource: Resource, public workspace: WorkSpace) {
    makeObservable(this);
    this.init();
  }

  async importSchema(schema: any) {
    const newSchema = await this.resource.import(schema);

    Object.keys(newSchema).forEach(key => {
      const view = this.editorViews.get(key);
      view?.project.importSchema(newSchema[key]);
    });
  }

  async init() {
    await this.initViewTypes();
    await this.execViewTypesInit();
    this.setDefaultViewType();
  }

  initViewTypes = async () => {
    const editorViews = this.resource.editorViews;
    for (let i = 0; i < editorViews.length; i++) {
      const name = editorViews[i].name;
      await this.initViewType(name);
      if (!this.editorView) {
        this.changeViewType(name);
      }
    }
  };

  execViewTypesInit = async () => {
    const editorViews = this.resource.editorViews;
    for (let i = 0; i < editorViews.length; i++) {
      const name = editorViews[i].name;
      this.changeViewType(name);
      await this.editorViews.get(name)?.init();
    }
  };

  setDefaultViewType = () => {
    this.changeViewType(this.resource.defaultViewType);
  };

  @obx.ref editorView: Context;

  @obx editorViews: Map<string, Context> = new Map<string, Context>();

  initViewType = async (name: string) => {
    const viewInfo = this.resource.getEditorView(name);
    if (this.editorViews.get(name)) {
      return;
    }
    const editorView = new Context(this.workspace, this, viewInfo as any);
    // await editorView.init();
    this.editorViews.set(name, editorView);
  };

  changeViewType = (name: string) => {
    this.editorView?.setActivate(false);
    this.editorView = this.editorViews.get(name)!;

    this.editorView.setActivate(true);
  };

  get project() {
    return this.editorView?.project;
  }

  get innerProject() {
    return this.editorView?.innerProject;
  }

  get innerSkeleton() {
    return this.editorView?.innerSkeleton;
  }

  get innerSetters() {
    return this.editorView?.innerSetters;
  }

  get editor() {
    return this.editorView?.editor;
  }

  get designer() {
    return this.editorView?.designer;
  }
}