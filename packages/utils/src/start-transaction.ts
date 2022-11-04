import { TransitionType } from '@alilc/lowcode-types';
import EventEmitter from 'events';

class TransactionManager {
  emitter = new EventEmitter();

  startTransaction = (fn: () => void, type: TransitionType = TransitionType.REPAINT): void => {
    this.emitter.emit(`[${type}]startTransaction`);
    fn();
    this.emitter.emit(`[${type}]endTransaction`);
  };

  onStartTransaction = (fn: () => void, type: TransitionType = TransitionType.REPAINT): () => void => {
    this.emitter.on(`[${type}]startTransaction`, fn);
    return () => {
      this.emitter.off(`[${type}]startTransaction`, fn);
    };
  };

  onEndTransaction = (fn: () => void, type: TransitionType = TransitionType.REPAINT): () => void => {
    this.emitter.on(`[${type}]endTransaction`, fn);
    return () => {
      this.emitter.off(`[${type}]endTransaction`, fn);
    };
  };
}

export const transactionManager = new TransactionManager();

export default transactionManager;