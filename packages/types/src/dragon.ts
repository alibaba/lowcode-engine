import { NodeInstance } from './designer';
import {
  IPublicModelDocumentModel,
  IPublicModelLocateEvent,
  IPublicModelDropLocation,
  IPublicTypeComponentInstance,
} from './shell';
import { IPublicTypeDragObject } from './shell/type/drag-object';


export interface LocateEvent {
  readonly type: 'LocateEvent';
  /**
   * 浏览器窗口坐标系
   */
  readonly globalX: number;
  readonly globalY: number;
  /**
   * 原始事件
   */
  readonly originalEvent: MouseEvent | DragEvent;
  /**
   * 拖拽对象
   */
  readonly dragObject: IPublicTypeDragObject;

  /**
   * 激活的感应器
   */
  sensor?: ISensor;

  // ======= 以下是 激活的 sensor 将填充的值 ========
  /**
   * 浏览器事件响应目标
   */
  target?: Element | null;
  /**
   * 当前激活文档画布坐标系
   */
  canvasX?: number;
  canvasY?: number;
  /**
   * 激活或目标文档
   */
  documentModel?: IPublicModelDocumentModel;
  /**
   * 事件订正标识，初始构造时，从发起端构造，缺少 canvasX,canvasY, 需要经过订正才有
   */
  fixed?: true;
}


/**
 * 拖拽敏感板
 */
export interface ISensor {
  /**
   * 是否可响应，比如面板被隐藏，可设置该值 false
   */
  readonly sensorAvailable: boolean;
  /**
   * 给事件打补丁
   */
  fixEvent(e: IPublicModelLocateEvent): IPublicModelLocateEvent;
  /**
   * 定位并激活
   */
  locate(e: IPublicModelLocateEvent): IPublicModelDropLocation | undefined | null;
  /**
   * 是否进入敏感板区域
   */
  isEnter(e: IPublicModelLocateEvent): boolean;
  /**
   * 取消激活
   */
  deactiveSensor(): void;

  /**
   * 获取节点实例
   */
  getNodeInstanceFromElement?: (e: Element | null) => NodeInstance<IPublicTypeComponentInstance> | null;
}