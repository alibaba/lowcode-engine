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

  get contentWindow() {
    return this[simulatorHostSymbol].contentWindow;
  }

  get contentDocument() {
    return this[simulatorHostSymbol].contentDocument;
  }

  set(key: string, value: any) {
    this[simulatorHostSymbol].set(key, value);
  }

  get(key: string) {
    return this[simulatorHostSymbol].get(key);
  }
}
