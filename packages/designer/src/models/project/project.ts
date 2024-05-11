import { type EventDisposable, type Project as ProjectDescriptor } from '@alilc/lowcode-shared';
import { type DocumentModel, type DocumentSchema } from '../document';

export interface ProjectSchema extends ProjectDescriptor {}

const initialSchemaTemplate: ProjectSchema = {
  version: '1.0.0',
  componentsMap: [],
  componentsTree: [],
  i18n: {},
};

/**
 * 项目类
 * 负责项目的管理
 */
export class Project {
  #schema: ProjectSchema;

  #currentDocument: DocumentModel | null = null;
  #documents: DocumentModel[] = [];

  constructor(schema: ProjectSchema = initialSchemaTemplate) {
    this.#schema = schema;
  }

  /**
   * 获取当前的 document
   * get current document
   */
  get currentDocument(): DocumentModel | null {
    return this.#currentDocument;
  }

  /**
   * 获取当前 project 下所有 documents
   * get all documents of this project
   */
  get documents(): DocumentModel[] {
    return this.#documents;
  }

  load(schema: ProjectSchema, openDocument: boolean | string = false) {}

  /**
   * 打开一个 document
   * open a document
   * @param doc
   * @returns
   */
  openDocument(doc?: string | DocumentSchema): DocumentModel | null;

  /**
   * 创建一个 document
   * create a document
   * @param data
   * @returns
   */
  createDocument(data: DocumentSchema): DocumentModel | null;

  /**
   * 删除一个 document
   * remove a document
   * @param doc
   */
  removeDocument(doc: DocumentModel): void;

  /**
   * 获取当前的 document
   * get current document
   */
  getCurrentDocument(): DocumentModel | null;

  /**
   * 根据 fileName 获取 document
   * get a document by filename
   * @param fileName
   */
  getDocumentByFileName(fileName: string): DocumentModel | null;

  /**
   * 根据 id 获取 document
   * get a document by id
   * @param id
   */
  getDocumentById(id: string): DocumentModel | null;

  /**
   * 导出 project
   * export project to schema
   * @returns
   */
  exportSchema(stage: IPublicEnumTransformStage): ProjectSchema;

  /**
   * 导入 project schema
   * import schema to project
   * @param schema 待导入的 project 数据
   */
  importSchema(schema?: ProjectSchema): void;

  /**
   * 绑定删除文档事件
   * set callback for event onDocumentRemoved
   */
  onRemoveDocument(fn: (data: { id: string }) => void): EventDisposable;

  /**
   * 当前 project 内的 document 变更事件
   * set callback for event onDocumentChanged
   */
  onChangeDocument(fn: (doc: DocumentModel) => void): EventDisposable;

  /**
   * 设置多语言语料
   *
   * set I18n data for this project
   * @param value object
   */
  setI18n(value: object): void;
}
