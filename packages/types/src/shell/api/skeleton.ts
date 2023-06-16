import { IPublicModelSkeletonItem } from '../model';
import { IPublicTypeDisposable, IPublicTypeSkeletonConfig } from '../type';

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
}
