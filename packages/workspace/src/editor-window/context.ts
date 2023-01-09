import { uniqueId } from '@alilc/lowcode-utils';
import { makeObservable, obx } from '@alilc/lowcode-editor-core';
import { Context } from '../editor-view/context';
import { Workspace } from '../workspace';
import { ResourceType } from '../resource-type';

export class EditorWindow {
  id: string = uniqueId('window');
  icon: React.ReactElement | undefined;

  constructor(readonly resourceType: ResourceType, readonly workspace: Workspace, public title: string | undefined = '', private options: Object = {}) {
    makeObservable(this);
    this.init();
    this.icon = resourceType.icon;
  }

  async importSchema(schema: any) {
    const newSchema = await this.resourceType.import(schema);

    if (!newSchema) {
      return;
    }

    Object.keys(newSchema).forEach(key => {
      const view = this.editorViews.get(key);
      view?.project.importSchema(newSchema[key]);
    });
  }

  async save() {
    const value: any = {};
    const editorViews = this.resourceType.editorViews;
    for (let i = 0; i < editorViews.length; i++) {
      const name = editorViews[i].viewName;
      const saveResult = await this.editorViews.get(name)?.save();
      value[name] = saveResult;
    }
    return await this.resourceType.save(value);
  }

  async init() {
    await this.initViewTypes();
    await this.execViewTypesInit();
    this.setDefaultViewType();
  }

  initViewTypes = async () => {
    const editorViews = this.resourceType.editorViews;
    for (let i = 0; i < editorViews.length; i++) {
      const name = editorViews[i].viewName;
      await this.initViewType(name);
      if (!this.editorView) {
        this.changeViewType(name);
      }
    }
  };

  execViewTypesInit = async () => {
    const editorViews = this.resourceType.editorViews;
    for (let i = 0; i < editorViews.length; i++) {
      const name = editorViews[i].viewName;
      this.changeViewType(name);
      await this.editorViews.get(name)?.init();
    }
  };

  setDefaultViewType = () => {
    this.changeViewType(this.resourceType.defaultViewType);
  };

  @obx.ref editorView: Context;

  @obx editorViews: Map<string, Context> = new Map<string, Context>();

  initViewType = async (name: string) => {
    const viewInfo = this.resourceType.getEditorView(name);
    if (this.editorViews.get(name)) {
      return;
    }
    const editorView = new Context(this.workspace, this, viewInfo as any, this.options);
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

  get innerHotkey() {
    return this.editorView?.innerHotkey;
  }

  get editor() {
    return this.editorView?.editor;
  }

  get designer() {
    return this.editorView?.designer;
  }

  get innerPlugins() {
    return this.editorView?.innerPlugins;
  }
}