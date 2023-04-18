import { IPublicTypeAssetsJson, IPublicTypeMetadataTransducer, IPublicTypeComponentAction, IPublicTypeNpmInfo, IPublicTypeDisposable } from '../type';
import { IPublicModelComponentMeta } from '../model';
import { ComponentType } from 'react';

export interface IPublicApiMaterial {

  /**
   * 获取组件 map 结构
   * get map of components
   */
  get componentsMap(): { [key: string]: IPublicTypeNpmInfo | ComponentType<any> | object } ;

  /**
   * 设置「资产包」结构
   * set data for Assets
   * @returns void
   */
  setAssets(assets: IPublicTypeAssetsJson): void;

  /**
   * 获取「资产包」结构
   * get AssetsJson data
   * @returns IPublicTypeAssetsJson
   */
  getAssets(): IPublicTypeAssetsJson | undefined;

  /**
   * 加载增量的「资产包」结构，该增量包会与原有的合并
   * load Assets incrementally, and will merge this with exiting assets
   * @param incrementalAssets
   * @returns
   */
  loadIncrementalAssets(incrementalAssets: IPublicTypeAssetsJson): void;

  /**
   * 注册物料元数据管道函数，在物料信息初始化时执行。
   * register transducer to process component meta, which will be
   * excuted during component meta`s initialization
   * @param transducer
   * @param level
   * @param id
   */
  registerMetadataTransducer(
    transducer: IPublicTypeMetadataTransducer,
    level?: number,
    id?: string | undefined
  ): void;

  /**
   * 获取所有物料元数据管道函数
   * get all registered metadata transducers
   * @returns {IPublicTypeMetadataTransducer[]}
   */
  getRegisteredMetadataTransducers(): IPublicTypeMetadataTransducer[];

  /**
   * 获取指定名称的物料元数据
   * get component meta by component name
   * @param componentName
   * @returns
   */
  getComponentMeta(componentName: string): IPublicModelComponentMeta | null;

  /**
   * test if the given object is a ComponentMeta instance or not
   * @param obj
   * @experiemental unstable API, pay extra caution when trying to use it
   */
  isComponentMeta(obj: any): boolean;

  /**
   * 获取所有已注册的物料元数据
   * get map of all component metas
   */
  getComponentMetasMap(): Map<string, IPublicModelComponentMeta>;

  /**
   * 在设计器辅助层增加一个扩展 action
   *
   * add an action button in canvas context menu area
   * @param action
   * @example
   * ```ts
   * import { plugins } from '@alilc/lowcode-engine';
   * import { IPublicModelPluginContext } from '@alilc/lowcode-types';
   *
   * const removeCopyAction = (ctx: IPublicModelPluginContext) => {
   *   return {
   *     async init() {
   *       const { removeBuiltinComponentAction } = ctx.material;
   *       removeBuiltinComponentAction('copy');
   *     }
   *   }
   * };
   * removeCopyAction.pluginName = 'removeCopyAction';
   * await plugins.register(removeCopyAction);
   * ```
   */
  addBuiltinComponentAction(action: IPublicTypeComponentAction): void;

  /**
   * 移除设计器辅助层的指定 action
   * remove a builtin action button from canvas context menu area
   * @param name
   */
  removeBuiltinComponentAction(name: string): void;

  /**
   * 修改已有的设计器辅助层的指定 action
   * modify a builtin action button in canvas context menu area
   * @param actionName
   * @param handle
   */
  modifyBuiltinComponentAction(
      actionName: string,
      handle: (action: IPublicTypeComponentAction) => void,
    ): void;

  /**
   * 监听 assets 变化的事件
   * add callback for assets changed event
   * @param fn
   */
  onChangeAssets(fn: () => void): IPublicTypeDisposable;

  /**
   * 刷新 componentMetasMap，可触发模拟器里的 components 重新构建
   * @since v1.1.7
   */
  refreshComponentMetasMap(): void;
}
