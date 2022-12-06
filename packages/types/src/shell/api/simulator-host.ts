import { IPublicModelNode } from '../model';


export interface IPublicApiSimulatorHost {
  /**
   * 获取 contentWindow
   */
  get contentWindow(): Window | undefined;

  /**
   * 获取 contentDocument
   */
  get contentDocument(): Document | undefined;

  get renderer(): any;

  /**
   * 设置 host 配置值
   * @param key
   * @param value
   */
  set(key: string, value: any): void;

  /**
   * 获取 host 配置值
   * @param key
   * @returns
   */
  get(key: string): any;

  /**
   * scroll to specific node
   * @param node
   */
  scrollToNode(node: IPublicModelNode): void;

  /**
   * 刷新渲染画布
   */
  rerender(): void;
}
