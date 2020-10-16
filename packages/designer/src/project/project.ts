import { EventEmitter } from 'events';
import { obx, computed } from '@ali/lowcode-editor-core';
import { Designer } from '../designer';
import { DocumentModel, isDocumentModel, isPageSchema } from '../document';
import { ProjectSchema, RootSchema } from '@ali/lowcode-types';
import { ISimulatorHost } from '../simulator';

export class Project {
  private emitter = new EventEmitter();

  @obx.val readonly documents: DocumentModel[] = [];

  private data: ProjectSchema = { version: '1.0.0', componentsMap: [], componentsTree: [] };

  private _simulator?: ISimulatorHost;

  /**
   * 模拟器
   */
  get simulator(): ISimulatorHost | null {
    return this._simulator || null;
  }

  // TODO: 考虑项目级别 History

  constructor(readonly designer: Designer, schema?: ProjectSchema) {
    this.load(schema);
  }

  @computed get currentDocument() {
    return this.documents.find((doc) => doc.actived);
  }

  @obx private _config: any = {};
  @computed get config(): any {
    // TODO: parse layout Component
    return this._config;
  }
  set config(value: any) {
    this._config = value;
  }

  /**
   * 获取项目整体 schema
   */
  getSchema(): ProjectSchema {
    return {
      ...this.data,
      // todo: future change this filter
      componentsTree: this.documents.filter((doc) => !doc.isBlank()).map((doc) => doc.schema),
    };
  }

  /**
   * 替换当前document的schema,并触发渲染器的render
   * @param schema
   */
  setSchema(schema?: ProjectSchema) {
    const doc = this.documents.find((doc) => doc.actived);
    doc && doc.import(schema?.componentsTree[0]);
  }

  /**
   * 整体设置项目 schema
   *
   * @param autoOpen true 自动打开文档 string 指定打开的文件
   */
  load(schema?: ProjectSchema, autoOpen?: boolean | string) {
    this.unload();
    // load new document
    this.data = {
      version: '1.0.0',
      componentsMap: [],
      componentsTree: [],
      ...schema,
    };
    this.config = schema?.config;

    if (autoOpen) {
      if (autoOpen === true) {
        // auto open first document or open a blank page
        // this.open(this.data.componentsTree[0]);
        const documentInstances = this.data.componentsTree.map((data) => this.createDocument(data));
        // TODO: 暂时先读 config tabBar 里的值，后面看整个 layout 结构是否能作为引擎规范
        if (this.config?.layout?.props?.tabBar?.items?.length > 0) {
          documentInstances.find((i) => i.fileName === this.config.layout.props.tabBar.items[0].path?.slice(1))?.open();
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
    this.documents.forEach((doc) => doc.remove());
  }

  removeDocument(doc: DocumentModel) {
    const index = this.documents.indexOf(doc);
    if (index < 0) {
      return;
    }
    this.documents.splice(index, 1);
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
      | 'config'
      | string,
    value: any,
  ): void {
    if (key === 'config') {
      this.config = value;
    }
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
  }


  private documentsMap = new Map<string, DocumentModel>();
  getDocument(id: string): DocumentModel | null {
    return this.documentsMap.get(id) || null;
  }

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
      const got = this.documents.find((item) => item.fileName === doc);
      if (got) {
        return got.open();
      }

      const data = this.data.componentsTree.find((data) => data.fileName === doc);
      if (data) {
        doc = this.createDocument(data);
        return doc.open();
      }

      return null;
    }

    if (isDocumentModel(doc)) {
      return doc.open();
    } else if (isPageSchema(doc)) {
      const foundDoc = this.documents.find(curDoc => curDoc?.rootNode?.id && curDoc?.rootNode?.id === doc?.id);
      if (foundDoc) {
        foundDoc.remove();
      }
    }

    doc = this.createDocument(doc);
    return doc.open();
  }

  checkExclusive(actived: DocumentModel) {
    this.documents.forEach((doc) => {
      if (doc !== actived) {
        doc.suspense();
      }
    });
    this.emitter.emit('current-document.change', actived);
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
    let simulatorProps = this.designer.simulatorProps;
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
  }

  setRendererReady(renderer: any) {
    this.emitter.emit('lowcode_engine_renderer_ready', renderer);
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
