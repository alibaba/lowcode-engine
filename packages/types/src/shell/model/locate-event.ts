import { IPublicModelDocumentModel, IPublicModelDragObject } from './';

export interface IPublicModelLocateEvent {

  get type(): string;

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
   * 浏览器事件响应目标
   */
  target?: Element | null;

  canvasX?: number;

  canvasY?: number;

  /**
   * 事件订正标识，初始构造时，从发起端构造，缺少 canvasX,canvasY, 需要经过订正才有
   */
  fixed?: true;

  /**
   * 激活或目标文档
   */
  documentModel?: IPublicModelDocumentModel | null;

  get dragObject(): IPublicModelDragObject | null;
}
