import { IPublicModelNode, IPublicModelSimulatorRender } from '../model';

export interface IPublicApiSimulatorHost {

  /**
   * 获取 contentWindow
   * @experimental unstable api, pay extra caution when trying to use it
   */
  get contentWindow(): Window | undefined;

  /**
   * 获取 contentDocument
   * @experimental unstable api, pay extra caution when trying to use it
   */
  get contentDocument(): Document | undefined;

  /**
   * @experimental unstable api, pay extra caution when trying to use it
   */
  get renderer(): IPublicModelSimulatorRender | undefined;

  /**
   * 设置若干用于画布渲染的变量，比如画布大小、locale 等。
   * set config for simulator host, eg. device locale and so on.
   * @param key
   * @param value
   */
  set(key: string, value: any): void;

  /**
   * 获取模拟器中设置的变量，比如画布大小、locale 等。
   * set config value by key
   * @param key
   * @returns
   */
  get(key: string): any;

  /**
   * 滚动到指定节点
   * scroll to specific node
   * @param node
   * @since v1.1.0
   */
  scrollToNode(node: IPublicModelNode): void;

  /**
   * 刷新渲染画布
   * make simulator render again
   */
  rerender(): void;
}
