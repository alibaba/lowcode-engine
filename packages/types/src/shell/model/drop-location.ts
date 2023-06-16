import { IPublicTypeLocationDetail } from '../type';
import { IPublicModelLocateEvent, IPublicModelNode } from './';

export interface IPublicModelDropLocation {

  /**
   * 拖拽位置目标
   * get target of dropLocation
   */
  get target(): IPublicModelNode | null;

  /**
   * 拖拽放置位置详情
   * get detail of dropLocation
   */
  get detail(): IPublicTypeLocationDetail;

  /**
   * 拖拽放置位置对应的事件
   * get event of dropLocation
   */
  get event(): IPublicModelLocateEvent;

  /**
   * 获取一份当前对象的克隆
   * get a clone object of current dropLocation
   */
  clone(event: IPublicModelLocateEvent): IPublicModelDropLocation;
}
