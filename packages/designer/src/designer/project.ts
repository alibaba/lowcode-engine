import { obx } from '@recore/obx';
import { DocumentSchema, ProjectSchema } from './schema';
import { EventEmitter } from 'events';

export default class Project {
  @obx documents: DocumentContext[];
  displayMode: 'exclusive' | 'split'; // P2
  private emitter = new EventEmitter();
  private data: ProjectSchema = {};
  constructor(schema: ProjectSchema) {
    this.data = { ...schema };
  }

  getDocument(fileName: string): DocumentContext {}

  addDocument(data: DocumentSchema): DocumentContext {
    this.documents.push(new DocumentContext(data));
  }

  /**
   * 获取项目整体 schema
   */
  getSchema(): ProjectSchema {
    return {
      ...this.data,
      componentsTree: this.documents.map(doc => doc.getSchema()),
    };
  }
  /**
   * 整体设置项目 schema
   */
  setSchema(schema: ProjectSchema): void {}

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
}
