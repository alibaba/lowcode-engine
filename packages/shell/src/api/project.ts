import {
  BuiltinSimulatorHost,
  IProject as InnerProject,
} from '@alilc/lowcode-designer';
import { globalContext } from '@alilc/lowcode-editor-core';
import {
  IPublicTypeRootSchema,
  IPublicTypeProjectSchema,
  IPublicModelEditor,
  IPublicApiProject,
  IPublicApiSimulatorHost,
  IPublicModelDocumentModel,
  IPublicTypePropsTransducer,
  IPublicEnumTransformStage,
  IPublicTypeDisposable,
  IPublicTypeAppConfig,
} from '@alilc/lowcode-types';
import { DocumentModel as ShellDocumentModel } from '../model';
import { SimulatorHost } from './simulator-host';
import { editorSymbol, projectSymbol, simulatorHostSymbol, documentSymbol } from '../symbols';
import { getLogger } from '@alilc/lowcode-utils';

const logger = getLogger({ level: 'warn', bizName: 'shell-project' });

const innerProjectSymbol = Symbol('innerProject');
export class Project implements IPublicApiProject {
  private readonly [innerProjectSymbol]: InnerProject;
  private [simulatorHostSymbol]: BuiltinSimulatorHost;
  get [projectSymbol](): InnerProject {
    if (this.workspaceMode) {
      return this[innerProjectSymbol];
    }
    const workspace = globalContext.get('workspace');
    if (workspace.isActive) {
      if (!workspace.window?.innerProject) {
        logger.error('project api 调用时机出现问题，请检查');
        return this[innerProjectSymbol];
      }
      return workspace.window.innerProject;
    }

    return this[innerProjectSymbol];
  }

  get [editorSymbol](): IPublicModelEditor {
    return this[projectSymbol]?.designer.editor;
  }

  constructor(project: InnerProject, public workspaceMode: boolean = false) {
    this[innerProjectSymbol] = project;
  }

  static create(project: InnerProject, workspaceMode: boolean = false) {
    return new Project(project, workspaceMode);
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
    return this[projectSymbol].documents.map((doc) => ShellDocumentModel.create(doc)!);
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
  openDocument(doc?: string | IPublicTypeRootSchema | undefined) {
    const documentModel = this[projectSymbol].open(doc);
    if (!documentModel) {
      return null;
    }
    return ShellDocumentModel.create(documentModel);
  }

  /**
   * 创建一个 document
   * @param data
   * @returns
   */
  createDocument(data?: IPublicTypeRootSchema): IPublicModelDocumentModel | null {
    const doc = this[projectSymbol].createDocument(data);
    return ShellDocumentModel.create(doc);
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
    const innerDocumentModel = this[projectSymbol].getDocumentByFileName(fileName);
    return ShellDocumentModel.create(innerDocumentModel);
  }

  /**
   * 根据 id 获取 document
   * @param id
   * @returns
   */
  getDocumentById(id: string): IPublicModelDocumentModel | null {
    return ShellDocumentModel.create(this[projectSymbol].getDocument(id));
  }

  /**
   * 导出 project
   * @returns
   */
  exportSchema(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Render) {
    return this[projectSymbol].getSchema(stage);
  }

  /**
   * 导入 project
   * @param schema 待导入的 project 数据
   */
  importSchema(schema?: IPublicTypeProjectSchema): void {
    this[projectSymbol].load(schema, true);
  }

  /**
   * 获取当前的 document
   * @returns
   */
  getCurrentDocument(): IPublicModelDocumentModel | null {
    return ShellDocumentModel.create(this[projectSymbol].currentDocument);
  }

  /**
   * 增加一个属性的管道处理函数
   * @param transducer
   * @param stage
   */
  addPropsTransducer(
      transducer: IPublicTypePropsTransducer,
      stage: IPublicEnumTransformStage,
    ): void {
    this[projectSymbol].designer.addPropsReducer(transducer, stage);
  }

  /**
   * 绑定删除文档事件
   * @param fn
   * @returns
   */
  onRemoveDocument(fn: (data: { id: string}) => void): IPublicTypeDisposable {
    return this[editorSymbol].eventBus.on(
        'designer.document.remove',
        (data: { id: string }) => fn(data),
      );
  }

  /**
   * 当前 project 内的 document 变更事件
   */
  onChangeDocument(fn: (doc: IPublicModelDocumentModel) => void): IPublicTypeDisposable {
    const offFn = this[projectSymbol].onCurrentDocumentChange((originalDoc) => {
      fn(ShellDocumentModel.create(originalDoc)!);
    });
    if (this[projectSymbol].currentDocument) {
      fn(ShellDocumentModel.create(this[projectSymbol].currentDocument)!);
    }
    return offFn;
  }

  /**
   * 当前 project 的模拟器 ready 事件
   */
  onSimulatorHostReady(fn: (host: IPublicApiSimulatorHost) => void): IPublicTypeDisposable {
    const offFn = this[projectSymbol].onSimulatorReady((simulator: BuiltinSimulatorHost) => {
      fn(SimulatorHost.create(simulator)!);
    });
    return offFn;
  }

  /**
   * 当前 project 的渲染器 ready 事件
   */
  onSimulatorRendererReady(fn: () => void): IPublicTypeDisposable {
    const offFn = this[projectSymbol].onRendererReady(() => {
      fn();
    });
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

  /**
   * 设置项目配置
   * @param value object
   * @returns
   */
  setConfig<T extends keyof IPublicTypeAppConfig>(key: T, value: IPublicTypeAppConfig[T]): void;
  setConfig(value: IPublicTypeAppConfig): void;
  setConfig(...params: any[]): void {
    if (params.length === 2) {
      const oldConfig = this[projectSymbol].get('config');
      this[projectSymbol].set('config', {
        ...oldConfig,
        [params[0]]: params[1],
      });
    } else {
      this[projectSymbol].set('config', params[0]);
    }
  }
}
