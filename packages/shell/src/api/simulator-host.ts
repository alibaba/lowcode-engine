import {
  BuiltinSimulatorHost,
} from '@alilc/lowcode-designer';
import { simulatorHostSymbol, nodeSymbol } from '../symbols';
import { IPublicApiSimulatorHost, IPublicModelNode, IPublicModelSimulatorRender } from '@alilc/lowcode-types';
import { SimulatorRender } from '../model/simulator-render';

export class SimulatorHost implements IPublicApiSimulatorHost {
  private readonly [simulatorHostSymbol]: BuiltinSimulatorHost;

  constructor(simulator: BuiltinSimulatorHost) {
    this[simulatorHostSymbol] = simulator;
  }

  static create(host: BuiltinSimulatorHost): IPublicApiSimulatorHost | null {
    if (!host) return null;
    return new SimulatorHost(host);
  }

  /**
   * 获取 contentWindow
   */
  get contentWindow(): Window | undefined {
    return this[simulatorHostSymbol].contentWindow;
  }

  /**
   * 获取 contentDocument
   */
  get contentDocument(): Document | undefined {
    return this[simulatorHostSymbol].contentDocument;
  }

  get renderer(): IPublicModelSimulatorRender | undefined {
    if (this[simulatorHostSymbol].renderer) {
      return SimulatorRender.create(this[simulatorHostSymbol].renderer);
    }

    return undefined;
  }

  /**
   * 设置 host 配置值
   * @param key
   * @param value
   */
  set(key: string, value: any): void {
    this[simulatorHostSymbol].set(key, value);
  }

  /**
   * 获取 host 配置值
   * @param key
   * @returns
   */
  get(key: string): any {
    return this[simulatorHostSymbol].get(key);
  }

  /**
   * scroll to specific node
   * @param node
   */
  scrollToNode(node: IPublicModelNode): void {
    this[simulatorHostSymbol].scrollToNode((node as any)[nodeSymbol]);
  }

  /**
   * 触发组件构建，并刷新渲染画布
   */
  rerender(): void {
    this[simulatorHostSymbol].rerender();
  }
}
