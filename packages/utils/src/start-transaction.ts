import { TransitionType } from '@alilc/lowcode-types';
import { runInAction } from 'mobx';
import EventEmitter from 'events';

class TransactionManager {
  emitter = new EventEmitter();

  executeTransaction = (fn: () => void, type: TransitionType = TransitionType.REPAINT): void => {
    this.emitter.emit(`[${type}]startTransaction`);
    runInAction(fn);
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
<<<<<<< HEAD

export default transactionManager;
=======
>>>>>>> feat/autoRepaintNode
