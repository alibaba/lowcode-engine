export enum IPublicEnumDragObjectType {
  Node = 'node',
  NodeData = 'nodedata',
}

export class IPublicModelDragObject {
  type: IPublicEnumDragObjectType.Node | IPublicEnumDragObjectType.NodeData;

  data: IPublicTypeNodeSchema | IPublicTypeNodeSchema[] | null;

  nodes: (IPublicModelNode | null)[] | null;
}

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

/**
 * 拖拽敏感板
 */
export interface IPublicModelSensor<Node = IPublicModelNode> {
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
  getNodeInstanceFromElement?: (
    e: Element | null,
  ) => IPublicTypeNodeInstance<IPublicTypeComponentInstance, Node> | null;
}
