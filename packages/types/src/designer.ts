import { IPublicModelNode, IPublicModelDragon, IPublicModelDropLocation, IPublicModelScroller, IPublicModelScrollable, IPublicTypeComponentInstance, IPublicTypeLocationData, IPublicModelActiveTracker } from './shell';


export interface IPublicOnChangeOptions {
  type: string;
  node: IPublicModelNode;
}


export interface NodeInstance<T = IPublicTypeComponentInstance> {
  docId: string;
  nodeId: string;
  instance: T;
  node?: Node | null;
}

export interface IDesigner {
  get dragon(): IPublicModelDragon;
  get activeTracker(): IPublicModelActiveTracker;
  createScroller(scrollable: IPublicModelScrollable): IPublicModelScroller;
  /**
   * 创建插入位置，考虑放到 dragon 中
   */
  createLocation(locationData: IPublicTypeLocationData): IPublicModelDropLocation;
}
