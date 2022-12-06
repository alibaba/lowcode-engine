import { IWidgetBaseConfig } from '../../editor-skeleton';


export interface IPublicApiSkeleton {
  /**
   * 增加一个面板实例
   * @param config
   * @param extraConfig
   * @returns
   */
  add(config: IWidgetBaseConfig, extraConfig?: Record<string, any>): any;

  /**
  * 移除一个面板实例
  * @param config
  * @returns
  */
  remove(config: IWidgetBaseConfig): number | undefined;

  /**
   * 显示面板
   * @param name
   */
  showPanel(name: string): void;

  /**
   * 隐藏面板
   * @param name
   */
  hidePanel(name: string): void;

  /**
   * 显示 widget
   * @param name
   */
  showWidget(name: string): void;

  /**
   * enable widget
   * @param name
   */
  enableWidget(name: string): void;

  /**
   * 隐藏 widget
   * @param name
   */
  hideWidget(name: string): void;

  /**
   * disable widget，不可点击
   * @param name
   */
  disableWidget(name: string): void;

  /**
   * show area
   * @param areaName name of area
   */
  showArea(areaName: string): void;

  /**
   * hide area
   * @param areaName name of area
   */
  hideArea(areaName: string): void;

  /**
   * 监听 panel 显示事件
   * @param listener
   * @returns
   */
  onShowPanel(listener: (...args: unknown[]) => void): () => void;

  /**
   * 监听 panel 隐藏事件
   * @param listener
   * @returns
   */
  onHidePanel(listener: (...args: unknown[]) => void): () => void;

  /**
   * 监听 widget 显示事件
   * @param listener
   * @returns
   */
  onShowWidget(listener: (...args: unknown[]) => void): () => void;

  /**
   * 监听 widget 隐藏事件
   * @param listener
   * @returns
   */
  onHideWidget(listener: (...args: unknown[]) => void): () => void;
}
