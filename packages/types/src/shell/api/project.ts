import { IPublicTypeProjectSchema, IPublicTypeDisposable, IPublicTypeRootSchema, IPublicTypePropsTransducer } from '../type';
import { IPublicEnumTransformStage } from '../enum';
import { IPublicApiSimulatorHost } from './';
import { IPublicModelDocumentModel } from '../model';

export interface IPublicApiProject {

  /**
   * 获取当前的 document
   * get current document
   */
  get currentDocument(): IPublicModelDocumentModel | null;

  /**
   * 获取当前 project 下所有 documents
   * get all documents of this project
   * @returns
   */
  get documents(): IPublicModelDocumentModel[];

  /**
   * 获取模拟器的 host
   * get simulator host
   */
  get simulatorHost(): IPublicApiSimulatorHost | null;

  /**
   * 打开一个 document
   * open a document
   * @param doc
   * @returns
   */
  openDocument(doc?: string | IPublicTypeRootSchema | undefined): IPublicModelDocumentModel | null;

  /**
   * 创建一个 document
   * create a document
   * @param data
   * @returns
   */
  createDocument(data?: IPublicTypeRootSchema): IPublicModelDocumentModel | null;

  /**
   * 删除一个 document
   * remove a document
   * @param doc
   */
  removeDocument(doc: IPublicModelDocumentModel): void;

  /**
   * 根据 fileName 获取 document
   * get a document by filename
   * @param fileName
   * @returns
   */
  getDocumentByFileName(fileName: string): IPublicModelDocumentModel | null;

  /**
   * 根据 id 获取 document
   * get a document by id
   * @param id
   * @returns
   */
  getDocumentById(id: string): IPublicModelDocumentModel | null;

  /**
   * 导出 project
   * export project to schema
   * @returns
   */
  exportSchema(stage: IPublicEnumTransformStage): IPublicTypeProjectSchema;

  /**
   * 导入 project schema
   * import schema to project
   * @param schema 待导入的 project 数据
   */
  importSchema(schema?: IPublicTypeProjectSchema): void;

  /**
   * 获取当前的 document
   * get current document
   * @returns
   */
  getCurrentDocument(): IPublicModelDocumentModel | null;

  /**
   * 增加一个属性的管道处理函数
   * add a transducer to process prop
   * @param transducer
   * @param stage
   */
  addPropsTransducer(
      transducer: IPublicTypePropsTransducer,
      stage: IPublicEnumTransformStage,
    ): void;

  /**
   * 绑定删除文档事件
   * set callback for event onDocumentRemoved
   * @param fn
   * @since v1.0.16
   */
  onRemoveDocument(fn: (data: { id: string }) => void): IPublicTypeDisposable;

  /**
   * 当前 project 内的 document 变更事件
   * set callback for event onDocumentChanged
   */
  onChangeDocument(fn: (doc: IPublicModelDocumentModel) => void): IPublicTypeDisposable;

  /**
   * 当前 project 的模拟器 ready 事件
   * set callback for event onSimulatorHostReady
   */
  onSimulatorHostReady(fn: (host: IPublicApiSimulatorHost) => void): IPublicTypeDisposable;

  /**
   * 当前 project 的渲染器 ready 事件
   * set callback for event onSimulatorRendererReady
   */
  onSimulatorRendererReady(fn: () => void): IPublicTypeDisposable;

  /**
   * 设置多语言语料
   * 数据格式参考 https://github.com/alibaba/lowcode-engine/blob/main/specs/lowcode-spec.md#2434%E5%9B%BD%E9%99%85%E5%8C%96%E5%A4%9A%E8%AF%AD%E8%A8%80%E7%B1%BB%E5%9E%8Baa
   *
   * set I18n data for this project
   * @param value object
   * @since v1.0.17
   */
  setI18n(value: object): void;
}
