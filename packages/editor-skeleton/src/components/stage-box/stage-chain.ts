import { Stage as StageWidget } from '../../widget/stage';
import { createModuleEventBus, IEventBus } from '@alilc/lowcode-editor-core';

export default class StageChain {
  private emitter: IEventBus;

  private stage: StageWidget;

  constructor(stage: StageWidget) {
    this.emitter = createModuleEventBus('StageChain');
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
    let rootStage = this.stage.getPrevious();
    while (rootStage && !rootStage.isRoot) {
      rootStage = rootStage.getPrevious();
    }
    if (!rootStage) return;
    rootStage.setReferRight(this.stage);
    this.stage = rootStage;
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
