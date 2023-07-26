import { obx, computed, makeObservable, action, IEventBus, createModuleEventBus } from '@alilc/lowcode-editor-core';
import { IDesigner } from '../designer';
import { DocumentModel, isDocumentModel } from '../document';
import type { IDocumentModel } from '../document';
import { IPublicEnumTransformStage } from '@alilc/lowcode-types';
import type {
  IBaseApiProject,
  IPublicTypeProjectSchema,
  IPublicTypeRootSchema,
  IPublicTypeComponentsMap,
  IPublicTypeSimulatorRenderer,
} from '@alilc/lowcode-types';
import { isLowCodeComponentType, isProCodeComponentType } from '@alilc/lowcode-utils';
import { ISimulatorHost } from '../simulator';

export interface IProject extends Omit<IBaseApiProject<
  IDocumentModel
>,
  'simulatorHost' |
  'importSchema' |
  'exportSchema' |
  'openDocument' |
  'getDocumentById' |
  'getCurrentDocument' |
  'addPropsTransducer' |
  'onRemoveDocument' |
  'onChangeDocument' |
  'onSimulatorHostReady' |
  'onSimulatorRendererReady' |
  'setI18n' |
  'setConfig' |
  'currentDocument' |
  'selection' |
  'documents' |
  'createDocument' |
  'getDocumentByFileName'
> {

  get designer(): IDesigner;

  get simulator(): ISimulatorHost | null;

  get currentDocument(): IDocumentModel | null | undefined;

  get documents(): IDocumentModel[];

  get i18n(): {
    [local: string]: {
      [key: string]: any;
    };
  };

  mountSimulator(simulator: ISimulatorHost): void;

  open(doc?: string | IDocumentModel | IPublicTypeRootSchema): IDocumentModel | null;

  getDocumentByFileName(fileName: string): IDocumentModel | null;

  createDocument(data?: IPublicTypeRootSchema): IDocumentModel;

  load(schema?: IPublicTypeProjectSchema, autoOpen?: boolean | string): void;

  getSchema(
    stage?: IPublicEnumTransformStage,
  ): IPublicTypeProjectSchema;

  getDocument(id: string): IDocumentModel | null;

  onCurrentDocumentChange(fn: (doc: IDocumentModel) => void): () => void;

  onSimulatorReady(fn: (args: any) => void): () => void;

  onRendererReady(fn: () => void): () => void;

  /**
   * 分字段设置储存数据，不记录操作记录
   */
  set<T extends keyof IPublicTypeProjectSchema>(key: T, value: IPublicTypeProjectSchema[T]): void;
  set(key: string, value: unknown): void;

  /**
   * 分字段获取储存数据
   */
  get<T extends keyof IPublicTypeProjectSchema>(key: T): IPublicTypeProjectSchema[T];
  get<T>(key: string): T;
  get(key: string): unknown;

  checkExclusive(activeDoc: DocumentModel): void;

  setRendererReady(renderer: IPublicTypeSimulatorRenderer<any, any>): void;
}

export class Project implements IProject {
  private emitter: IEventBus = createModuleEventBus('Project');

  @obx.shallow readonly documents: IDocumentModel[] = [];

  private data: IPublicTypeProjectSchema = {
    version: '1.0.0',
    componentsMap: [],
    componentsTree: [],
    i18n: {},
  };

  private _simulator?: ISimulatorHost;

  private isRendererReady: boolean = false;

  /**
   * 模拟器
   */
  get simulator(): ISimulatorHost | null {
    return this._simulator || null;
  }

  @computed get currentDocument(): IDocumentModel | null | undefined {
    return this.documents.find((doc) => doc.active);
  }

  @obx private _config: any = {};
  @computed get config(): any {
    // TODO: parse layout Component
    return this._config;
  }
  set config(value: any) {
    this._config = value;
  }

  @obx.ref private _i18n: any = {};
  @computed get i18n(): any {
    return this._i18n;
  }
  set i18n(value: any) {
    this._i18n = value || {};
  }

  private documentsMap = new Map<string, DocumentModel>();

  constructor(readonly designer: IDesigner, schema?: IPublicTypeProjectSchema, readonly viewName = 'global') {
    makeObservable(this);
    this.load(schema);
  }

  private getComponentsMap(): IPublicTypeComponentsMap {
    return this.documents.reduce<IPublicTypeComponentsMap>((
      componentsMap: IPublicTypeComponentsMap,
      curDoc: IDocumentModel,
    ): IPublicTypeComponentsMap => {
      const curComponentsMap = curDoc.getComponentsMap();
      if (Array.isArray(curComponentsMap)) {
        curComponentsMap.forEach((item) => {
          const found = componentsMap.find((eItem) => {
            if (
              isProCodeComponentType(eItem) &&
              isProCodeComponentType(item) &&
              eItem.package === item.package &&
              eItem.componentName === item.componentName
            ) {
              return true;
            } else if (
              isLowCodeComponentType(eItem) &&
              eItem.componentName === item.componentName
            ) {
              return true;
            }
            return false;
          });
          if (found) return;
          componentsMap.push(item);
        });
      }
      return componentsMap;
    }, [] as IPublicTypeComponentsMap);
  }

  /**
   * 获取项目整体 schema
   */
  getSchema(
    stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Save,
  ): IPublicTypeProjectSchema {
    return {
      ...this.data,
      componentsMap: this.getComponentsMap(),
      componentsTree: this.documents
        .filter((doc) => !doc.isBlank())
        .map((doc) => doc.export(stage) || {} as IPublicTypeRootSchema),
      i18n: this.i18n,
    };
  }

  /**
   * 替换当前 document 的 schema，并触发渲染器的 render
   * @param schema
   */
  setSchema(schema?: IPublicTypeProjectSchema) {
    // FIXME: 这里的行为和 getSchema 并不对等，感觉不太对
    const doc = this.documents.find((doc) => doc.active);
    doc && schema?.componentsTree[0] && doc.import(schema?.componentsTree[0]);
    this.simulator?.rerender();
  }

  /**
   * 整体设置项目 schema
   *
   * @param autoOpen true 自动打开文档 string 指定打开的文件
   */
  @action
  load(schema?: IPublicTypeProjectSchema, autoOpen?: boolean | string) {
    this.unload();
    // load new document
    this.data = {
      version: '1.0.0',
      componentsMap: [],
      componentsTree: [],
      i18n: {},
      ...schema,
    };
    this.config = schema?.config || this.config;
    this.i18n = schema?.i18n || this.i18n;

    if (autoOpen) {
      if (autoOpen === true) {
        // auto open first document or open a blank page
        // this.open(this.data.componentsTree[0]);
        const documentInstances = this.data.componentsTree.map((data) => this.createDocument(data));
        // TODO: 暂时先读 config tabBar 里的值，后面看整个 layout 结构是否能作为引擎规范
        if (this.config?.layout?.props?.tabBar?.items?.length > 0) {
          // slice(1) 这个贼不雅，默认任务 fileName 是类'/fileName'的形式
          documentInstances
            .find((i) => i.fileName === this.config.layout.props.tabBar.items[0].path?.slice(1))
            ?.open();
        } else {
          documentInstances[0].open();
        }
      } else {
        // auto open should be string of fileName
        this.open(autoOpen);
      }
    }
  }

  /**
   * 卸载当前项目数据
   */
  unload() {
    if (this.documents.length < 1) {
      return;
    }
    for (let i = this.documents.length - 1; i >= 0; i--) {
      this.documents[i].remove();
    }
  }

  removeDocument(doc: IDocumentModel) {
    const index = this.documents.indexOf(doc);
    if (index < 0) {
      return;
    }
    this.documents.splice(index, 1);
    this.documentsMap.delete(doc.id);
  }

  /**
   * 分字段设置储存数据，不记录操作记录
   */
  set<T extends keyof IPublicTypeProjectSchema>(key: T, value: IPublicTypeProjectSchema[T]): void;
  set(key: string, value: unknown): void;
  set(key: string, value: unknown): void {
    if (key === 'config') {
      this.config = value;
    }
    if (key === 'i18n') {
      this.i18n = value;
    }
    Object.assign(this.data, { [key]: value });
  }

  /**
   * 分字段设置储存数据
   */
  get<T extends keyof IPublicTypeRootSchema>(key: T): IPublicTypeRootSchema[T];
  get<T>(key: string): T;
  get(key: string): unknown;
  get(key: string): any {
    if (key === 'config') {
      return this.config;
    }
    if (key === 'i18n') {
      return this.i18n;
    }
    return Reflect.get(this.data, key);
  }

  getDocument(id: string): IDocumentModel | null {
    // 此处不能使用 this.documentsMap.get(id)，因为在乐高 rollback 场景，document.id 会被改成其他值
    return this.documents.find((doc) => doc.id === id) || null;
  }

  getDocumentByFileName(fileName: string): IDocumentModel | null {
    return this.documents.find((doc) => doc.fileName === fileName) || null;
  }

  @action
  createDocument(data?: IPublicTypeRootSchema): IDocumentModel {
    const doc = new DocumentModel(this, data || this?.data?.componentsTree?.[0]);
    this.documents.push(doc);
    this.documentsMap.set(doc.id, doc);
    return doc;
  }

  open(doc?: string | IDocumentModel | IPublicTypeRootSchema): IDocumentModel | null {
    if (!doc) {
      const got = this.documents.find((item) => item.isBlank());
      if (got) {
        return got.open();
      }
      doc = this.createDocument();
      return doc.open();
    }
    if (typeof doc === 'string' || typeof doc === 'number') {
      const got = this.documents.find((item) => item.fileName === String(doc) || String(item.id) === String(doc));
      if (got) {
        return got.open();
      }

      const data = this.data.componentsTree.find((data) => data.fileName === String(doc));
      if (data) {
        doc = this.createDocument(data);
        return doc.open();
      }

      return null;
    } else if (isDocumentModel(doc)) {
      return doc.open();
    }
    //  else if (isPageSchema(doc)) {
    // 暂时注释掉，影响了 diff 功能
    // const foundDoc = this.documents.find(curDoc => curDoc?.rootNode?.id && curDoc?.rootNode?.id === doc?.id);
    // if (foundDoc) {
    //   foundDoc.remove();
    // }
    // }

    doc = this.createDocument(doc);
    return doc.open();
  }

  checkExclusive(activeDoc: DocumentModel) {
    this.documents.forEach((doc) => {
      if (doc !== activeDoc) {
        doc.suspense();
      }
    });
    this.emitter.emit('current-document.change', activeDoc);
  }

  closeOthers(opened: DocumentModel) {
    this.documents.forEach((doc) => {
      if (doc !== opened) {
        doc.close();
      }
    });
  }

  mountSimulator(simulator: ISimulatorHost) {
    // TODO: 多设备 simulator 支持
    this._simulator = simulator;
    this.emitter.emit('lowcode_engine_simulator_ready', simulator);
  }

  setRendererReady(renderer: any) {
    this.isRendererReady = true;
    this.emitter.emit('lowcode_engine_renderer_ready', renderer);
  }

  onSimulatorReady(fn: (args: any) => void): () => void {
    if (this._simulator) {
      fn(this._simulator);
      return () => {};
    }
    this.emitter.on('lowcode_engine_simulator_ready', fn);
    return () => {
      this.emitter.removeListener('lowcode_engine_simulator_ready', fn);
    };
  }

  onRendererReady(fn: () => void): () => void {
    if (this.isRendererReady) {
      fn();
    }
    this.emitter.on('lowcode_engine_renderer_ready', fn);
    return () => {
      this.emitter.removeListener('lowcode_engine_renderer_ready', fn);
    };
  }

  onCurrentDocumentChange(fn: (doc: IDocumentModel) => void): () => void {
    this.emitter.on('current-document.change', fn);
    return () => {
      this.emitter.removeListener('current-document.change', fn);
    };
  }
}
