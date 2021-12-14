import { Project as InnerProject, PropsReducer, TransformStage } from '@ali/lowcode-designer';
import { RootSchema, ProjectSchema } from '@ali/lowcode-types';
import DocumentModel from './document-model';
import { projectSymbol } from './symbols';

export default class Project {
  private readonly [projectSymbol]: InnerProject;

  constructor(project: InnerProject) {
    this[projectSymbol] = project;
  }

  static create(project: InnerProject) {
    return new Project(project);
  }

  /**
   * 打开一个 document
   * @param doc
   * @returns
   */
  openDocument(doc?: string | RootSchema | undefined) {
    const documentModel = this[projectSymbol].open(doc);
    if (!documentModel) return null;
    return DocumentModel.create(documentModel);
  }

  createDocument(data?: RootSchema): DocumentModel | null {
    const doc = this[projectSymbol].createDocument(data);
    return DocumentModel.create(doc);
  }

  getDocumentByFileName(fileName: string): DocumentModel | null {
    return DocumentModel.create(this[projectSymbol].getDocumentByFileName(fileName));
  }

  getDocumentById(id: string): DocumentModel | null {
    return DocumentModel.create(this[projectSymbol].getDocument(id));
  }

  getDocuments(): DocumentModel[] {
    return this[projectSymbol].documents.map((doc) => DocumentModel.create(doc)!);
  }

  exportSchema() {
    return this[projectSymbol].getSchema();
  }

  importSchema(schema?: ProjectSchema) {
    this[projectSymbol].load(schema, true);
  }

  getCurrentDocument(): DocumentModel | null {
    return DocumentModel.create(this[projectSymbol].currentDocument);
  }

  addPropsTransducer(reducer: PropsReducer, stage: TransformStage) {
    this[projectSymbol].designer.addPropsReducer(reducer, stage);
  }

  /**
   * 当前 project 内的 document 变更事件
   */
  onChangeDocument(fn: (doc: DocumentModel) => void) {
    // TODO: 思考一下是否要实现补偿触发能力
    return this[projectSymbol].onCurrentDocumentChange((originalDoc) => {
      fn(DocumentModel.create(originalDoc)!);
    });
  }

  /**
   * 当前 project 的模拟器 ready 事件
   */
  onSimulatorReady(fn: () => void) {
    // TODO: 补充 simulator 实例
    // TODO: 思考一下是否要实现补偿触发能力
    return this[projectSymbol].onSimulatorReady(() => {
      fn();
    });
  }

  /**
   * 当前 project 的渲染器 ready 事件
   */
  onRendererReady(fn: () => void) {
    // TODO: 补充 renderer 实例
    // TODO: 思考一下是否要实现补偿触发能力
    return this[projectSymbol].onRendererReady(() => {
      fn();
    });
  }
}
