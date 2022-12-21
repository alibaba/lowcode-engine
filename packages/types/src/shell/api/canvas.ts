import { IPublicModelDragon, IPublicModelDropLocation, IPublicModelScrollTarget, IPublicModelScrollable, IPublicModelScroller, IPublicModelActiveTracker } from '../model';
import { IPublicTypeLocationData } from '../type';

export interface IPublicApiCanvas {


  /**
   * a Scroller is a controller that gives a view (IPublicModelScrollable) the ability scrolling
   * to some cordination by api scrollTo.
   *
   * when initing aaa scroller, will need to pass is a scrollable, which has a scrollTarget.
   * and when scrollTo(options: { left?: number; top?: number }) is called, scroller will
   * move scrollTarget`s top-left corner to (options.left, options.top) that passed in.
   */
  createScroller(scrollable: IPublicModelScrollable): IPublicModelScroller;

  /**
   * this works with Scroller, refer to createScroller`s description
   */
  createScrollTarget(shell: HTMLDivElement): IPublicModelScrollTarget;

  /**
   * create a drop location for document, drop location describes a location in document
   */
  createLocation(locationData: IPublicTypeLocationData): IPublicModelDropLocation;

  /**
   * get dragon instance, you can use this to obtain draging related abilities and lifecycle hooks
   */
  get dragon(): IPublicModelDragon | null;

  /**
   * get activeTracker instance, which is a singleton running in engine.
   * it tracks document`s current focusing node/node[], and notify it`s subscribers that when
   * focusing node/node[] changed.
   */
  get activeTracker(): IPublicModelActiveTracker | null;
}
