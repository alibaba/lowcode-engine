import { IPublicModelSkeletonItem } from '../model';
import { IPublicTypeConfigTransducer, IPublicTypeDisposable, IPublicTypeSkeletonConfig, IPublicTypeWidgetConfigArea } from '../type';

export interface IPublicApiSkeleton {

  /**
   * 增加一个面板实例
   * add a new panel
   * @param config
   * @param extraConfig
   * @returns
   */
  add(config: IPublicTypeSkeletonConfig, extraConfig?: Record<string, any>): IPublicModelSkeletonItem | undefined;

  /**
   * 移除一个面板实例
   * remove a panel
   * @param config
   * @returns
   */
  remove(config: IPublicTypeSkeletonConfig): number | undefined;

  /**
   * 获取某个区域下的所有面板实例
   * @param areaName IPublicTypeWidgetConfigArea
   */
  getAreaItems(areaName: IPublicTypeWidgetConfigArea): IPublicModelSkeletonItem[] | undefined;

  /**
   * 获取面板实例
   * @param name 面板名称
   * @since v1.1.10
   */
  getPanel(name: string): IPublicModelSkeletonItem | undefined;

  /**
   * 展示指定 Panel 实例
   * show panel by name
   * @param name
   */
  showPanel(name: string): void;

  /**
   * 隐藏面板
   * hide panel by name
   * @param name
   */
  hidePanel(name: string): void;

  /**
   * 展示指定 Widget 实例
   * show widget by name
   * @param name
   */
  showWidget(name: string): void;

  /**
   * 将 widget 启用
   * enable widget by name
   * @param name
   */
  enableWidget(name: string): void;

  /**
   * 隐藏指定 widget 实例
   * hide widget by name
   * @param name
   */
  hideWidget(name: string): void;

  /**
   * 将 widget 禁用掉，禁用后，所有鼠标事件都会被禁止掉。
   * disable widget，and make it not responding any click event.
   * @param name
   */
  disableWidget(name: string): void;

  /**
   * 显示某个 Area
   * show area
   * @param areaName name of area
   */
  showArea(areaName: string): void;

  /**
   * 隐藏某个 Area
   * hide area
   * @param areaName name of area
   */
  hideArea(areaName: string): void;

  /**
   * 监听 Panel 实例显示事件
   * set callback for panel shown event
   * @param listener
   * @returns
   */
  onShowPanel(listener: (...args: any[]) => void): IPublicTypeDisposable;

  /**
   * 监听 Panel 实例隐藏事件
   * set callback for panel hidden event
   * @param listener
   * @returns
   */
  onHidePanel(listener: (...args: any[]) => void): IPublicTypeDisposable;

  /**
   * 监听 Widget 显示事件
   * set callback for widget shown event
   * @param listener
   * @returns
   */
  onShowWidget(listener: (...args: any[]) => void): IPublicTypeDisposable;

  /**
   * 监听 Widget 隐藏事件
   * set callback for widget hidden event
   * @param listener
   * @returns
   */
  onHideWidget(listener: (...args: any[]) => void): IPublicTypeDisposable;

  /**
   * 注册一个面板的配置转换器（transducer）。
   * Registers a configuration transducer for a panel.
   * @param {IPublicTypeConfigTransducer} transducer
   *   - 要注册的转换器函数。该函数接受一个配置对象（类型为 IPublicTypeSkeletonConfig）作为输入，并返回修改后的配置对象。
   *   - The transducer function to be registered. This function takes a configuration object (of type IPublicTypeSkeletonConfig) as input and returns a modified configuration object.
   *
   * @param {number} level
   *   - 转换器的优先级。优先级较高的转换器会先执行。
   *   - The priority level of the transducer. Transducers with higher priority levels are executed first.
   *
   * @param {string} [id]
   *   - （可选）转换器的唯一标识符。用于在需要时引用或操作特定的转换器。
   *   - (Optional) A unique identifier for the transducer. Used for referencing or manipulating a specific transducer when needed.
   */
  registerConfigTransducer(transducer: IPublicTypeConfigTransducer, level: number, id?: string): void;
}
