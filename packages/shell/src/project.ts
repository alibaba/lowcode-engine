import {
  BuiltinSimulatorHost,
  Project as InnerProject,
  TransformStage,
} from '@alilc/lowcode-designer';
import { globalContext } from '@alilc/lowcode-editor-core';
import {
  RootSchema,
  ProjectSchema,
  IEditor,
  IPublicApiProject,
  IPublicApiSimulatorHost,
  IPublicModelDocumentModel,
  PropsTransducer,
} from '@alilc/lowcode-types';


import DocumentModel from './document-model';
import SimulatorHost from './simulator-host';
import { editorSymbol, projectSymbol, simulatorHostSymbol, simulatorRendererSymbol, documentSymbol } from './symbols';

const innerProjectSymbol = Symbol('project');
export default class Project implements IPublicApiProject {
  private readonly [editorSymbol]: IEditor;
  private readonly [innerProjectSymbol]: InnerProject;
  private [simulatorHostSymbol]: BuiltinSimulatorHost;
  private [simulatorRendererSymbol]: any;
  get [projectSymbol]() {
    if (this.workspaceMode) {
      return this[innerProjectSymbol];
    }
    const workSpace = globalContext.get('workSpace');
    if (workSpace.isActive) {
      return workSpace.window.innerProject;
    }

    return this[innerProjectSymbol];
  }

  constructor(project: InnerProject, public workspaceMode: boolean = false) {
    this[innerProjectSymbol] = project;
    this[editorSymbol] = project?.designer.editor;
  }

  static create(project: InnerProject) {
    return new Project(project);
  }

  /**
   * 获取当前的 document
   * @returns
   */
  get currentDocument(): IPublicModelDocumentModel | null {
    return this.getCurrentDocument();
  }

  /**
   * 获取当前 project 下所有 documents
   * @returns
   */
  get documents(): IPublicModelDocumentModel[] {
    return this[projectSymbol].documents.map((doc) => DocumentModel.create(doc)!);
  }

  /**
   * 获取模拟器的 host
   */
  get simulatorHost(): IPublicApiSimulatorHost | null {
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
  createDocument(data?: RootSchema): IPublicModelDocumentModel | null {
    const doc = this[projectSymbol].createDocument(data);
    return DocumentModel.create(doc);
  }

  /**
   * 删除一个 document
   * @param doc
   */
  removeDocument(doc: IPublicModelDocumentModel) {
    this[projectSymbol].removeDocument((doc as any)[documentSymbol]);
  }

  /**
   * 根据 fileName 获取 document
   * @param fileName
   * @returns
   */
  getDocumentByFileName(fileName: string): IPublicModelDocumentModel | null {
    return DocumentModel.create(this[projectSymbol].getDocumentByFileName(fileName));
  }

  /**
   * 根据 id 获取 document
   * @param id
   * @returns
   */
  getDocumentById(id: string): IPublicModelDocumentModel | null {
    return DocumentModel.create(this[projectSymbol].getDocument(id));
  }

  /**
   * 导出 project
   * @returns
   */
  exportSchema(stage: TransformStage = TransformStage.Render) {
    return this[projectSymbol].getSchema(stage);
  }

  /**
   * 导入 project
   * @param schema 待导入的 project 数据
   */
  importSchema(schema?: ProjectSchema): void {
    this[projectSymbol].load(schema, true);
    // this[editorSymbol].emit(Events.IMPORT_SCHEMA, schema);
  }

  /**
   * 获取当前的 document
   * @returns
   */
  getCurrentDocument(): IPublicModelDocumentModel | null {
    return DocumentModel.create(this[projectSymbol].currentDocument);
  }

  /**
   * 增加一个属性的管道处理函数
   * @param transducer
   * @param stage
   */
  addPropsTransducer(transducer: PropsTransducer, stage: TransformStage): void {
    this[projectSymbol].designer.addPropsReducer(transducer, stage);
  }

  /**
   * 绑定删除文档事件
   * @param fn
   * @returns
   */
  onRemoveDocument(fn: (data: { id: string}) => void): any {
    return this[editorSymbol].on('designer.document.remove', (data: { id: string }) => fn(data));
  }

  /**
   * 当前 project 内的 document 变更事件
   */
  onChangeDocument(fn: (doc: IPublicModelDocumentModel) => void) {
    const offFn = this[projectSymbol].onCurrentDocumentChange((originalDoc) => {
      fn(DocumentModel.create(originalDoc)!);
    });
    if (this[projectSymbol].currentDocument) {
      fn(DocumentModel.create(this[projectSymbol].currentDocument)!);
    }
    return offFn;
  }

  /**
   * 当前 project 的模拟器 ready 事件
   */
  onSimulatorHostReady(fn: (host: IPublicApiSimulatorHost) => void) {
    const offFn = this[projectSymbol].onSimulatorReady((simulator: BuiltinSimulatorHost) => {
      this[simulatorHostSymbol] = simulator;
      fn(SimulatorHost.create(simulator)!);
    });
    if (this[simulatorHostSymbol]) {
      fn(SimulatorHost.create(this[simulatorHostSymbol])!);
    }
    return offFn;
  }

  /**
   * 当前 project 的渲染器 ready 事件
   */
  onSimulatorRendererReady(fn: () => void) {
    const offFn = this[projectSymbol].onRendererReady((renderer: any) => {
      this[simulatorRendererSymbol] = renderer;
      fn();
    });
    if (this[simulatorRendererSymbol]) {
      fn();
    }
    return offFn;
  }

  /**
   * 设置多语言语料
   * 数据格式参考 https://github.com/alibaba/lowcode-engine/blob/main/specs/lowcode-spec.md#2434%E5%9B%BD%E9%99%85%E5%8C%96%E5%A4%9A%E8%AF%AD%E8%A8%80%E7%B1%BB%E5%9E%8Baa
   * @param value object
   * @returns
   */
  setI18n(value: object): void {
    this[projectSymbol].set('i18n', value);
  }
}
