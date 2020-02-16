import { obx, computed } from '@recore/obx';
import { ProjectSchema } from './schema';
import { EventEmitter } from 'events';
import Designer from './designer';
import DocumentModel from './document/document-model';

export default class Project {
  private emitter = new EventEmitter();
  @obx.val readonly documents: DocumentModel[] = [];
  private data: ProjectSchema = {};

  @obx.ref canvasDisplayMode: 'exclusive' | 'overview' = 'exclusive';

  // 考虑项目级别 History

  constructor(readonly designer: Designer, schema?: ProjectSchema) {
    this.data = {
      version: '1.0.0',
      componentsMap: [],
      componentsTree: [],
      ...schema
    };
  }

  @computed get activedDocuments() {
    return this.documents.filter(doc => doc.actived);
  }

  getDocument(fileName: string): DocumentContext {}

  addDocument(data: DocumentSchema): DocumentContext {
    this.documents.push(new DocumentContext(data));
  }

  /**
   * 获取项目整体 schema
   */
  get schema(): ProjectSchema {
    return {
      ...this.data,
      componentsTree: this.documents.map(doc => doc.getSchema()),
    };
  }

  /**
   * 整体设置项目 schema
   */
  set schema(schema: ProjectSchema) {

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
  ): any;

  edit(document): void {}

  /**
   * documents 列表发生变化
   */
  onDocumentsChange(fn: (documents: DocumentContext[]) => void): () => void {}
  /**
   *
   */
  // 通知标记删除，需要告知服务端
  // 项目角度编辑不是全量打开所有文档，是按需加载，哪个更新就通知更新谁，
  // 哪个删除就
}
