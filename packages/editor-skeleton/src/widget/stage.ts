import { uniqueId } from '@ali/lowcode-utils';
import Widget from './widget';
import { Skeleton } from '../skeleton';
import { WidgetConfig } from '../types';

export interface StageConfig extends WidgetConfig {
  isRoot?: boolean;
}

export class Stage extends Widget {
  readonly isRoot: boolean;
  private previous?: Stage;
  private refer?: {
    stage?: Stage;
    direction?: 'right' | 'left';
  };

  constructor(skeleton: Skeleton, config: StageConfig) {
    super(skeleton, config);
    this.isRoot = config.isRoot || false;
  }

  setPrevious(stage: Stage) {
    this.previous = stage;
  }

  getPrevious() {
    return this.previous;
  }

  hasBack(): boolean {
    return this.previous && !this.isRoot ? true : false;
  }

  setRefer(stage: Stage, direction: 'right' | 'left') {
    this.refer = { stage, direction };
  }

  setReferRight(stage: Stage) {
    this.setRefer(stage, 'right');
  }

  setReferLeft(stage: Stage) {
    this.setRefer(stage, 'left');
  }

  getRefer() {
    const refer = this.refer;
    this.refer = undefined;
    return refer;
  }
}
