import { AssetsJson } from '../../assets';
import { MetadataTransducer, ComponentAction } from '../../metadata';
import { IPublicModelComponentMeta } from '../model/component-meta';


export interface IPublicApiMaterial {

  /**
   * 设置「资产包」结构
   * @param assets
   * @returns
   */
  setAssets(assets: AssetsJson): void;

  /**
   * 获取「资产包」结构
   * @returns
   */
  getAssets(): any;

  /**
   * 加载增量的「资产包」结构，该增量包会与原有的合并
   * @param incrementalAssets
   * @returns
   */
  loadIncrementalAssets(incrementalAssets: AssetsJson): void;

  /**
   * 注册物料元数据管道函数
   * @param transducer
   * @param level
   * @param id
   */
  registerMetadataTransducer(
    transducer: MetadataTransducer,
    level?: number,
    id?: string | undefined
  ): void;

  /**
   * 获取所有物料元数据管道函数
   * @returns
   */
  getRegisteredMetadataTransducers(): MetadataTransducer[];

  /**
   * 获取指定名称的物料元数据
   * @param componentName
   * @returns
   */
  getComponentMeta(componentName: string): IPublicModelComponentMeta | null;

  /**
   * test if the given object is a ComponentMeta instance or not
   * @param obj
   * @returns
   */
  isComponentMeta(obj: any): boolean;

  /**
   * 获取所有已注册的物料元数据
   * @returns
   */
  getComponentMetasMap(): Map<string, IPublicModelComponentMeta>;

  /**
   * 在设计器辅助层增加一个扩展 action
   * @param action
   */
  addBuiltinComponentAction(action: ComponentAction): void;

  /**
   * 移除设计器辅助层的指定 action
   * @param name
   */
  removeBuiltinComponentAction(name: string): void;

  /**
   * 修改已有的设计器辅助层的指定 action
   * @param actionName
   * @param handle
   */
  modifyBuiltinComponentAction(actionName: string, handle: (action: ComponentAction) => void): void;

  /**
   * 监听 assets 变化的事件
   * @param fn
   */
  onChangeAssets(fn: () => void): void;
}
