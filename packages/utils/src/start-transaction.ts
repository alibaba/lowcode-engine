import { TransitionType } from '@alilc/lowcode-types';
import EventEmitter from 'events';

class TransactionManage {
  emitter = new EventEmitter();

  startTransaction(fn: () => void, type: TransitionType = TransitionType.repaint): void {
    this.emitter.emit(`[${type}]startTransaction`);
    fn();
    this.emitter.emit(`[${type}]endTransaction`);
  }

  onStartTransaction(fn: () => void, type: TransitionType = TransitionType.repaint): () => void {
    this.emitter.on(`[${type}]startTransaction`, fn);
    return () => {
      this.emitter.off(`[${type}]startTransaction`, fn);
    };
  }

  onEndTransaction(fn: () => void, type: TransitionType = TransitionType.repaint): () => void {
    this.emitter.on(`[${type}]endTransaction`, fn);
    return () => {
      this.emitter.off(`[${type}]endTransaction`, fn);
    };
  }
}

export const transactionManage = new TransactionManage();

export default transactionManage;