import {
  BuiltinSimulatorHost,
} from '@ali/lowcode-designer';
import { simulatorHostSymbol } from './symbols';

export default class SimulatorHost {
  private readonly [simulatorHostSymbol]: BuiltinSimulatorHost;

  constructor(simulator: BuiltinSimulatorHost) {
    this[simulatorHostSymbol] = simulator;
  }

  static create(host: BuiltinSimulatorHost) {
    if (!host) return null;
    return new SimulatorHost(host);
  }

  /**
   * 获取 contentWindow
   */
  get contentWindow() {
    return this[simulatorHostSymbol].contentWindow;
  }

  /**
   * 获取 contentDocument
   */
  get contentDocument() {
    return this[simulatorHostSymbol].contentDocument;
  }

  /**
   * 设置 host 配置值
   * @param key
   * @param value
   */
  set(key: string, value: any) {
    this[simulatorHostSymbol].set(key, value);
  }

  /**
   * 获取 host 配置值
   * @param key
   * @returns
   */
  get(key: string) {
    return this[simulatorHostSymbol].get(key);
  }
}
