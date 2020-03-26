import { EventEmitter } from 'events';
import Designer from './designer';
import DocumentModel, { isDocumentModel } from './document/document-model';
import { ProjectSchema, RootSchema, obx, computed } from '../../../globals';

export default class Project {
  private emitter = new EventEmitter();
  @obx.val readonly documents: DocumentModel[] = [];

  private data: ProjectSchema = { version: '1.0.0', componentsMap: [], componentsTree: [] };

  @obx.ref canvasDisplayMode: 'exclusive' | 'overview' = 'exclusive';

  // TODO: 考虑项目级别 History

  constructor(readonly designer: Designer, schema?: ProjectSchema) {
    this.setSchema(schema);
  }

  @computed get currentDocument() {
    return this.documents.find(doc => doc.actived);
  }

  /**
   * 获取项目整体 schema
   */
  getSchema(): ProjectSchema {
    return {
      ...this.data,
      componentsTree: this.documents.map(doc => doc.schema),
    };
  }

  /**
   * 整体设置项目 schema
   */
  setSchema(schema?: ProjectSchema) {
    this.data = {
      version: '1.0.0',
      componentsMap: [],
      componentsTree: [],
      ...schema,
    };
    if (this.documents.length > 0) {
      this.documents.forEach(doc => doc.purge());
      this.documents.length = 0;
    }
    this.open(
      this.data.componentsTree[0] || {
        componentName: 'Page',
        fileName: '',
      },
    );
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

  open(doc: string | DocumentModel | RootSchema): void {
    if (typeof doc === 'string') {
      const got = this.documents.find(item => item.fileName === doc);
      if (got) {
        return got.open();
      }

      const data = this.data.componentsTree.find(data => data.fileName === doc);
      if (data) {
        doc = new DocumentModel(this, data);
        this.documents.push(doc);
        doc.open();
      }

      return;
    }

    if (isDocumentModel(doc)) {
      return doc.open();
    }

    doc = new DocumentModel(this, doc);
    this.documents.push(doc);
    doc.open();
  }

  checkExclusive(actived: DocumentModel) {
    this.documents.forEach(doc => {
      if (doc !== actived) {
        doc.suspense();
      }
    });
    this.emitter.emit('current-document-change', actived);
  }

  closeOthers(opened: DocumentModel) {
    this.documents.forEach(doc => {
      if (doc !== opened) {
        doc.close();
      }
    });
  }

  onCurrentDocumentChange(fn: (doc: DocumentModel) => void): () => void {
    this.emitter.on('current-document-change', fn);
    return () => {
      this.emitter.removeListener('current-document-change', fn);
    };
  }
  // 通知标记删除，需要告知服务端
  // 项目角度编辑不是全量打开所有文档，是按需加载，哪个更新就通知更新谁，
  // 哪个删除就
}
