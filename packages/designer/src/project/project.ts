import { EventEmitter } from 'events';
import { obx, computed, makeObservable, action } from '@alilc/lowcode-editor-core';
import { Designer } from '../designer';
import { DocumentModel, isDocumentModel } from '../document';
import {
  ProjectSchema,
  RootSchema,
  ComponentsMap,
  TransformStage,
  isLowCodeComponentType,
  isProCodeComponentType,
} from '@alilc/lowcode-types';
import { ISimulatorHost } from '../simulator';

export class Project {
  private emitter = new EventEmitter();

  @obx.shallow readonly documents: DocumentModel[] = [];

  private data: ProjectSchema = {
    version: '1.0.0',
    componentsMap: [],
    componentsTree: [],
    i18n: {},
  };

  private _simulator?: ISimulatorHost;

  /**
   * 模拟器
   */
  get simulator(): ISimulatorHost | null {
    return this._simulator || null;
  }

  // TODO: 考虑项目级别 History

  constructor(readonly designer: Designer, schema?: ProjectSchema) {
    makeObservable(this);
    this.load(schema);
  }

  @computed get currentDocument() {
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

  private getComponentsMap(): ComponentsMap {
    return this.documents.reduce((compomentsMap: ComponentsMap, curDoc: DocumentModel) => {
      const curComponentsMap = curDoc.getComponentsMap();
      if (Array.isArray(curComponentsMap)) {
        curComponentsMap.forEach((item) => {
          const found = compomentsMap.find((eItem) => {
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
          compomentsMap.push(item);
        });
      }
      return compomentsMap;
    }, [] as ComponentsMap);
  }

  /**
   * 获取项目整体 schema
   */
  getSchema(stage: TransformStage = TransformStage.Save): ProjectSchema {
    return {
      ...this.data,
      componentsMap: this.getComponentsMap(),
      componentsTree: this.documents
        .filter((doc) => !doc.isBlank())
        .map((doc) => doc.export(stage)),
      i18n: this.i18n,
    };
  }

  /**
   * 替换当前document的schema,并触发渲染器的render
   * @param schema
   */
  setSchema(schema?: ProjectSchema) {
    // FIXME: 这里的行为和 getSchema 并不对等，感觉不太对
    const doc = this.documents.find((doc) => doc.active);
    doc && doc.import(schema?.componentsTree[0]);
    this.simulator?.rerender();
  }

  /**
   * 整体设置项目 schema
   *
   * @param autoOpen true 自动打开文档 string 指定打开的文件
   */
  @action
  load(schema?: ProjectSchema, autoOpen?: boolean | string) {
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
          // slice(1)这个贼不雅，默认任务fileName 是类'/fileName'的形式
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

  removeDocument(doc: DocumentModel) {
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
  set(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    key:
      | 'version'
      | 'componentsTree'
      | 'componentsMap'
      | 'utils'
      | 'constants'
      | 'i18n'
      | 'css'
      | 'dataSource'
      | string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    value: any,
  ): void {
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
  get(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    key:
      | 'version'
      | 'componentsTree'
      | 'componentsMap'
      | 'utils'
      | 'constants'
      | 'i18n'
      | 'css'
      | 'dataSource'
      | 'config'
      | string,
  ): any {
    if (key === 'config') {
      return this.config;
    }
    if (key === 'i18n') {
      return this.i18n;
    }
    return Reflect.get(this.data, key);
  }

  private documentsMap = new Map<string, DocumentModel>();

  getDocument(id: string): DocumentModel | null {
    // 此处不能使用 this.documentsMap.get(id)，因为在乐高 rollback 场景，document.id 会被改成其他值
    return this.documents.find((doc) => doc.id === id) || null;
  }

  getDocumentByFileName(fileName: string): DocumentModel | null {
    return this.documents.find((doc) => doc.fileName === fileName) || null;
  }

  @action
  createDocument(data?: RootSchema): DocumentModel {
    const doc = new DocumentModel(this, data || this?.data?.componentsTree?.[0]);
    this.documents.push(doc);
    this.documentsMap.set(doc.id, doc);
    return doc;
  }

  open(doc?: string | DocumentModel | RootSchema): DocumentModel | null {
    if (!doc) {
      const got = this.documents.find((item) => item.isBlank());
      if (got) {
        return got.open();
      }
      doc = this.createDocument();
      return doc.open();
    }
    if (typeof doc === 'string') {
      const got = this.documents.find((item) => item.fileName === doc || item.id === doc);
      if (got) {
        return got.open();
      }

      const data = this.data.componentsTree.find((data) => data.fileName === doc);
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

  /**
   * 提供给模拟器的参数
   */
  @computed get simulatorProps(): object {
    let { simulatorProps } = this.designer;
    if (typeof simulatorProps === 'function') {
      simulatorProps = simulatorProps(this);
    }
    return {
      ...simulatorProps,
      project: this,
      onMount: this.mountSimulator.bind(this),
    };
  }

  private mountSimulator(simulator: ISimulatorHost) {
    // TODO: 多设备 simulator 支持
    this._simulator = simulator;
    this.designer.editor.set('simulator', simulator);
    this.emitter.emit('lowcode_engine_simulator_ready', simulator);
  }

  setRendererReady(renderer: any) {
    this.emitter.emit('lowcode_engine_renderer_ready', renderer);
  }

  onSimulatorReady(fn: (args: any) => void): () => void {
    this.emitter.on('lowcode_engine_simulator_ready', fn);
    return () => {
      this.emitter.removeListener('lowcode_engine_simulator_ready', fn);
    };
  }

  onRendererReady(fn: (args: any) => void): () => void {
    this.emitter.on('lowcode_engine_renderer_ready', fn);
    return () => {
      this.emitter.removeListener('lowcode_engine_renderer_ready', fn);
    };
  }

  onCurrentDocumentChange(fn: (doc: DocumentModel) => void): () => void {
    this.emitter.on('current-document.change', fn);
    return () => {
      this.emitter.removeListener('current-document.change', fn);
    };
  }
}
