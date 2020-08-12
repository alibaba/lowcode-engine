import { EventEmitter } from 'events';
import { obx, computed } from '@ali/lowcode-editor-core';
import { Designer } from '../designer';
import { DocumentModel, isDocumentModel } from '../document';
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

    if (autoOpen) {
      if (autoOpen === true) {
        // auto open first document or open a blank page
        this.open(this.data.componentsTree[0]);
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

  /**
   * 分字段设置储存数据，不记录操作记录
   */
  set(
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
    value: any,
  ): void {}

  /**
   * 分字段设置储存数据
   */
  get(
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
  ): any {}


  private documentsMap = new Map<string, DocumentModel>();
  getDocument(id: string): DocumentModel | null {
    return this.documentsMap.get(id) || null;
  }

  createDocument(data?: RootSchema): DocumentModel {
    const doc = new DocumentModel(this, data);
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
  // 通知标记删除，需要告知服务端
  // 项目角度编辑不是全量打开所有文档，是按需加载，哪个更新就通知更新谁，
  // 哪个删除就
}
