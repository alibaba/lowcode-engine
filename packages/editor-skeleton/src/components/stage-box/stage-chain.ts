import { EventEmitter } from 'events';
import { Stage as StageWidget } from '../../widget/stage';

export default class StageChain {
  private emitter: EventEmitter;
  private stage: StageWidget;

  constructor(stage: StageWidget) {
    this.emitter = new EventEmitter();
    this.stage = stage;
  }

  stagePush(stage: StageWidget | null) {
    if (!stage) return;
    stage.setPrevious(this.stage);
    stage.setReferLeft(this.stage);
    this.stage = stage;
    this.emitter.emit('stagechange');
  }

  stageBack() {
    const stage = this.stage.getPrevious();
    if (!stage) return;
    stage.setReferRight(this.stage);
    this.stage = stage;
    this.emitter.emit('stagechange');
  }

  /**
   * 回到最开始
   */
  stageBackToRoot() {
    while (!this.stage.isRoot) {
      const stage = this.stage.getPrevious();
      if (!stage) return;
      stage.setReferRight(this.stage);
      this.stage = stage;
    }
    this.emitter.emit('stagechange');
  }

  getCurrentStage() {
    return this.stage;
  }

  onStageChange(func: () => void) {
    this.emitter.on('stagechange', func);
    return () => {
      this.emitter.removeListener('stagechange', func);
    };
  }
}
