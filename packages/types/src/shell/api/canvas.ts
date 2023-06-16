import { IPublicModelDragon, IPublicModelDropLocation, IPublicModelScrollTarget, IPublicModelScroller, IPublicModelActiveTracker, IPublicModelClipboard } from '../model';
import { IPublicTypeLocationData, IPublicTypeScrollable } from '../type';

/**
 * canvas - 画布 API
 * @since v1.1.0
 */
export interface IPublicApiCanvas {

  /**
   * 创一个滚动控制器 Scroller，赋予一个视图滚动的基本能力，
   *
   * a Scroller is a controller that gives a view (IPublicTypeScrollable) the ability scrolling
   * to some cordination by api scrollTo.
   *
   * when a scroller is inited, will need to pass is a scrollable, which has a scrollTarget.
   * and when scrollTo(options: { left?: number; top?: number }) is called, scroller will
   * move scrollTarget`s top-left corner to (options.left, options.top) that passed in.
   * @since v1.1.0
   */
  createScroller(scrollable: IPublicTypeScrollable): IPublicModelScroller;

  /**
   * 创建一个 ScrollTarget，与 Scroller 一起发挥作用，详见 createScroller 中的描述
   *
   * this works with Scroller, refer to createScroller`s description
   * @since v1.1.0
   */
  createScrollTarget(shell: HTMLDivElement): IPublicModelScrollTarget;

  /**
   * 创建一个文档插入位置对象，该对象用来描述一个即将插入的节点在文档中的位置
   *
   * create a drop location for document, drop location describes a location in document
   * @since v1.1.0
   */
  createLocation(locationData: IPublicTypeLocationData): IPublicModelDropLocation;

  /**
   * 获取拖拽操作对象的实例
   *
   * get dragon instance, you can use this to obtain draging related abilities and lifecycle hooks
   * @since v1.1.0
   */
  get dragon(): IPublicModelDragon | null;

  /**
   * 获取活动追踪器实例
   *
   * get activeTracker instance, which is a singleton running in engine.
   * it tracks document`s current focusing node/node[], and notify it`s subscribers that when
   * focusing node/node[] changed.
   * @since v1.1.0
   */
  get activeTracker(): IPublicModelActiveTracker | null;

  /**
   * 是否处于 LiveEditing 状态
   *
   * check if canvas is in liveEditing state
   * @since v1.1.0
   */
  get isInLiveEditing(): boolean;

  /**
   * 获取全局剪贴板实例
   *
   * get clipboard instance
   *
   * @since v1.1.0
   */
  get clipboard(): IPublicModelClipboard;
}
