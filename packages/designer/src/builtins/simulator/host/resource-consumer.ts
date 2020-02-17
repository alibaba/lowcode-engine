import { SimulatorRenderer } from '../renderer/renderer';
import { autorun, obx } from '@recore/obx';
import { SimulatorHost } from './host';
import { EventEmitter } from 'events';

const UNSET = Symbol('unset');
export type MasterProvider = (master: SimulatorHost) => any;
export type RendererConsumer<T> = (renderer: SimulatorRenderer, data: T) => Promise<any>;

// master 进程
//  0. 初始化该对象，因为需要响应变更发生在 master 进程
//  1. 提供消费数据或数据提供器，比如 Asset 资源，如果不是数据提供器，会持续提供
//  2. 收到成功通知
// renderer 进程
//  1. 持续消费，并持续监听数据
//  2. 消费

// 这里涉及俩个自定义项
//  1. 被消费数据协议
//  2. 消费机制（渲染进程自定 + 传递进入）

function isSimulatorRenderer(obj: any): obj is SimulatorRenderer {
  return obj && obj.isSimulatorRenderer;
}

export default class ResourceConsumer<T = any> {
  private emitter = new EventEmitter();
  @obx.ref private _data: T | typeof UNSET = UNSET;

  private _providing?: () => void;
  constructor(provider: () => T, private consumer?: RendererConsumer<T>) {
    this._providing = autorun(() => {
      this._data = provider();
    });
  }


  private _consuming?: () => void;
  consume(consumerOrRenderer: SimulatorRenderer | ((data: T) => any)) {
    if (this._consuming) {
      return;
    }
    let consumer: (data: T) => any;
    if (isSimulatorRenderer(consumerOrRenderer)) {
      if (!this.consumer) {
        // TODO: throw error
        return;
      }
      const rendererConsumer = this.consumer!;

      consumer = (data) => rendererConsumer(consumerOrRenderer, data);
    } else {
      consumer = consumerOrRenderer;
    }
    this._consuming = autorun(async () => {
      if (this._data === UNSET) {
        return;
      }
      await consumer(this._data);
      // TODO: catch error and report
      if (this.resovleFirst) {
        this.resovleFirst();
      } else {
        this._firstConsumed = true;
      }
    });
  }

  dispose() {
    if (this._providing) {
      this._providing();
    }
    if (this._consuming) {
      this._consuming();
    }
    this.emitter.removeAllListeners();
  }

  private _firstConsumed: boolean = false;
  private resovleFirst?: () => void;

  waitFirstConsume(): Promise<any> {
    if (this._firstConsumed) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.resovleFirst = resolve;
    });
  }
}
