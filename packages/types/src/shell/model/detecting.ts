export interface IPublicModelDetecting {
  /**
   * 当前 hover 的节点
   */
  get current(): any;

  /**
   * hover 指定节点
   * @param id 节点 id
   */
  capture(id: string): any;

  /**
   * hover 离开指定节点
   * @param id 节点 id
   */
  release(id: string): any;

  /**
   * 清空 hover 态
   */
  leave(): any;
}
