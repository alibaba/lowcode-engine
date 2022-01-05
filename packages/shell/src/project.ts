import {
  BuiltinSimulatorHost,
  Project as InnerProject,
  PropsReducer as PropsTransducer,
  TransformStage,
} from '@ali/lowcode-designer';
import { RootSchema, ProjectSchema } from '@ali/lowcode-types';
import DocumentModel from './document-model';
import SimulatorHost from './simulator-host';
import { projectSymbol, simulatorHostSymbol, simulatorRendererSymbol } from './symbols';

export default class Project {
  private readonly [projectSymbol]: InnerProject;
  private [simulatorHostSymbol]: BuiltinSimulatorHost;
  private [simulatorRendererSymbol]: any;

  constructor(project: InnerProject) {
    this[projectSymbol] = project;
  }

  static create(project: InnerProject) {
    return new Project(project);
  }

  /**
   * 获取当前 project 下所有 documents
   * @returns
   */
  get documents(): DocumentModel[] {
    return this[projectSymbol].documents.map((doc) => DocumentModel.create(doc)!);
  }

  /**
   * 获取模拟器的 host
   */
  get simulatorHost() {
    return SimulatorHost.create(this[projectSymbol].simulator as any || this[simulatorHostSymbol]);
  }

  /**
   * @deprecated use .simulatorHost instead.
   */
  get simulator() {
    return this.simulatorHost;
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

  /**
   * 创建一个 document
   * @param data
   * @returns
   */
  createDocument(data?: RootSchema): DocumentModel | null {
    const doc = this[projectSymbol].createDocument(data);
    return DocumentModel.create(doc);
  }

  /**
   * 根据 fileName 获取 document
   * @param fileName
   * @returns
   */
  getDocumentByFileName(fileName: string): DocumentModel | null {
    return DocumentModel.create(this[projectSymbol].getDocumentByFileName(fileName));
  }

  /**
   * 根据 id 获取 document
   * @param id
   * @returns
   */
  getDocumentById(id: string): DocumentModel | null {
    return DocumentModel.create(this[projectSymbol].getDocument(id));
  }

  /**
   * 导出 project
   * @returns
   */
  exportSchema() {
    return this[projectSymbol].getSchema();
  }

  /**
   * 导入 project
   * @param schema 待导入的 project 数据
   */
  importSchema(schema?: ProjectSchema) {
    this[projectSymbol].load(schema, true);
  }

  /**
   * 获取当前的 document
   * @returns
   */
  getCurrentDocument(): DocumentModel | null {
    return DocumentModel.create(this[projectSymbol].currentDocument);
  }

  /**
   * 增加一个属性的管道处理函数
   * @param transducer
   * @param stage
   */
  addPropsTransducer(transducer: PropsTransducer, stage: TransformStage) {
    this[projectSymbol].designer.addPropsReducer(transducer, stage);
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
  onSimulatorHostReady(fn: (host: SimulatorHost) => void) {
    if (this[simulatorHostSymbol]) {
      fn(SimulatorHost.create(this[simulatorHostSymbol])!);
      return () => {};
    }
    return this[projectSymbol].onSimulatorReady((simulator: BuiltinSimulatorHost) => {
      this[simulatorHostSymbol] = simulator;
      fn(SimulatorHost.create(simulator)!);
    });
  }

  /**
   * 当前 project 的渲染器 ready 事件
   */
  onSimulatorRendererReady(fn: () => void) {
    if (this[simulatorRendererSymbol]) {
      fn();
      return () => {};
    }
    // TODO: 补充 renderer 实例
    return this[projectSymbol].onRendererReady((renderer: any) => {
      this[simulatorRendererSymbol] = renderer;
      fn();
    });
  }
}
