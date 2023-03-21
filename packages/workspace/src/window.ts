import { uniqueId } from '@alilc/lowcode-utils';
import { createModuleEventBus, IEventBus, makeObservable, obx } from '@alilc/lowcode-editor-core';
import { Context } from './context/view-context';
import { IWorkspace } from './workspace';
import { IResource } from './resource';
import { IPublicTypeDisposable } from '../../types/es/shell/type/disposable';
import { IPublicModelWindow } from '@alilc/lowcode-types';

interface IWindowCOnfig {
  title: string | undefined;
  options?: Object;
  viewType?: string | undefined;
}

export interface IEditorWindow extends Omit<IPublicModelWindow<IResource>, 'changeViewType'> {
  readonly resource: IResource;

  editorViews: Map<string, Context>;

  changeViewType: (name: string, ignoreEmit?: boolean) => void;
}

export class EditorWindow implements IEditorWindow {
  id: string = uniqueId('window');
  icon: React.ReactElement | undefined;

  private emitter: IEventBus = createModuleEventBus('Project');

  title: string | undefined;

  url: string | undefined;

  @obx.ref editorView: Context;

  @obx editorViews: Map<string, Context> = new Map<string, Context>();

  @obx initReady = false;

  constructor(readonly resource: IResource, readonly workspace: IWorkspace, private config: IWindowCOnfig) {
    makeObservable(this);
    this.init();
    this.title = config.title;
    this.icon = resource.icon;
  }

  async importSchema(schema: any) {
    const newSchema = await this.resource.import(schema);

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
    const editorViews = this.resource.editorViews;
    for (let i = 0; i < editorViews.length; i++) {
      const name = editorViews[i].viewName;
      const saveResult = await this.editorViews.get(name)?.save();
      value[name] = saveResult;
    }
    return await this.resource.save(value);
  }

  async init() {
    await this.initViewTypes();
    await this.execViewTypesInit();
    this.url = await this.resource.url();
    this.setDefaultViewType();
    this.initReady = true;
  }

  initViewTypes = async () => {
    const editorViews = this.resource.editorViews;
    if (!editorViews) {
      return;
    }
    for (let i = 0; i < editorViews.length; i++) {
      const name = editorViews[i].viewName;
      await this.initViewType(name);
      if (!this.editorView) {
        this.changeViewType(name);
      }
    }
  };

  onChangeViewType(fn: (viewName: string) => void): IPublicTypeDisposable {
    this.emitter.on('window.change.view.type', fn);

    return () => {
      this.emitter.off('window.change.view.type', fn);
    };
  }

  execViewTypesInit = async () => {
    const editorViews = this.resource.editorViews;
    if (!editorViews) {
      return;
    }
    for (let i = 0; i < editorViews.length; i++) {
      const name = editorViews[i].viewName;
      this.changeViewType(name);
      await this.editorViews.get(name)?.init();
    }
  };

  setDefaultViewType = () => {
    this.changeViewType(this.config.viewType ?? this.resource.defaultViewType);
  };

  get resourceType() {
    return this.resource.resourceType.type;
  }

  initViewType = async (name: string) => {
    const viewInfo = this.resource.getEditorView(name);
    if (this.editorViews.get(name)) {
      return;
    }
    const editorView = new Context(this.workspace, this, viewInfo as any, this.config.options);
    this.editorViews.set(name, editorView);
  };

  changeViewType = (name: string, ignoreEmit: boolean = true) => {
    this.editorView?.setActivate(false);
    this.editorView = this.editorViews.get(name)!;

    if (!this.editorView) {
      return;
    }

    if (!ignoreEmit) {
      this.emitter.emit('window.change.view.type', name);
    }
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