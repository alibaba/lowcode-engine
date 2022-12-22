import { IPublicTypeProjectSchema, IPublicTypeDisposable, IPublicTypeRootSchema, IPublicTypePropsTransducer } from '../type';
import { IPublicEnumTransformStage } from '../enum';
import { IPublicApiSimulatorHost } from './';
import { IPublicModelDocumentModel } from '../model';


export interface IPublicApiProject {
  /**
   * 获取当前的 document
   * @returns
   */
  get currentDocument(): IPublicModelDocumentModel | null;

  /**
  * 获取当前 project 下所有 documents
  * @returns
  */
  get documents(): IPublicModelDocumentModel[];

  /**
   * 获取模拟器的 host
   */
  get simulatorHost(): IPublicApiSimulatorHost | null;

  /**
  * 打开一个 document
  * @param doc
  * @returns
  */
  openDocument(doc?: string | IPublicTypeRootSchema | undefined): IPublicModelDocumentModel | null;

  /**
   * 创建一个 document
   * @param data
   * @returns
   */
  createDocument(data?: IPublicTypeRootSchema): IPublicModelDocumentModel | null;


  /**
   * 删除一个 document
   * @param doc
   */
  removeDocument(doc: IPublicModelDocumentModel): void;

  /**
   * 根据 fileName 获取 document
   * @param fileName
   * @returns
   */
  getDocumentByFileName(fileName: string): IPublicModelDocumentModel | null;

  /**
   * 根据 id 获取 document
   * @param id
   * @returns
   */
  getDocumentById(id: string): IPublicModelDocumentModel | null;

  /**
   * 导出 project
   * @returns
   */
  exportSchema(stage: IPublicEnumTransformStage): IPublicTypeProjectSchema;

  /**
  * 导入 project
  * @param schema 待导入的 project 数据
  */
  importSchema(schema?: IPublicTypeProjectSchema): void;

  /**
   * 获取当前的 document
   * @returns
   */
  getCurrentDocument(): IPublicModelDocumentModel | null;

  /**
   * 增加一个属性的管道处理函数
   * @param transducer
   * @param stage
   */
  addPropsTransducer(
      transducer: IPublicTypePropsTransducer,
      stage: IPublicEnumTransformStage,
    ): void;

  /**
   * 绑定删除文档事件
   * @param fn
   * @returns
   */
  onRemoveDocument(fn: (data: { id: string }) => void): any;

  /**
   * 当前 project 内的 document 变更事件
   */
  onChangeDocument(fn: (doc: IPublicModelDocumentModel) => void): IPublicTypeDisposable;

  /**
   * 当前 project 的模拟器 ready 事件
   */
  onSimulatorHostReady(fn: (host: IPublicApiSimulatorHost) => void): IPublicTypeDisposable;

  /**
   * 当前 project 的渲染器 ready 事件
   */
  onSimulatorRendererReady(fn: () => void): IPublicTypeDisposable;

  /**
   * 设置多语言语料
   * 数据格式参考 https://github.com/alibaba/lowcode-engine/blob/main/specs/lowcode-spec.md#2434%E5%9B%BD%E9%99%85%E5%8C%96%E5%A4%9A%E8%AF%AD%E8%A8%80%E7%B1%BB%E5%9E%8Baa
   * @param value object
   * @returns
   */
  setI18n(value: object): void;
}
