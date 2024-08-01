import { createDecorator, Barrier } from '@alilc/lowcode-shared';

/**
 * 生命周期阶段
 */
export const enum LifecyclePhase {
  /**
   * 开始
   */
  Starting = 1,
  /**
   * 配置解析完成
   */
  OptionsResolved = 2,
  /**
   * 已就绪
   */
  Ready = 3,
  /**
   * 销毁中
   */
  Destroying = 4,
}

export interface ILifeCycleService {
  /**
   * A flag indicating in what phase of the lifecycle we currently are.
   */
  phase: LifecyclePhase;

  setPhase(phase: LifecyclePhase): void;

  /**
   * Returns a promise that resolves when a certain lifecycle phase
   * has started.
   */
  when(phase: LifecyclePhase): Promise<void>;

  onWillDestory(): void;
}

export function LifecyclePhaseToString(phase: LifecyclePhase): string {
  switch (phase) {
    case LifecyclePhase.Starting:
      return 'Starting';
    case LifecyclePhase.OptionsResolved:
      return 'OptionsResolved';
    case LifecyclePhase.Ready:
      return 'Ready';
    case LifecyclePhase.Destroying:
      return 'Destroying';
  }
}

export const ILifeCycleService = createDecorator<ILifeCycleService>('lifeCycleService');

export class LifeCycleService implements ILifeCycleService {
  private readonly phaseWhen = new Map<LifecyclePhase, Barrier>();

  private _phase = LifecyclePhase.Starting;

  get phase(): LifecyclePhase {
    return this._phase;
  }

  setPhase(value: LifecyclePhase) {
    if (value < this._phase) {
      throw new Error('Lifecycle cannot go backwards');
    }

    if (this._phase === value) {
      return;
    }

    this._phase = value;

    const barrier = this.phaseWhen.get(this._phase);
    if (barrier) {
      barrier.open();
      this.phaseWhen.delete(this._phase);
    }
  }

  async when(phase: LifecyclePhase): Promise<void> {
    if (phase <= this._phase) {
      return;
    }

    let barrier = this.phaseWhen.get(phase);
    if (!barrier) {
      barrier = new Barrier();
      this.phaseWhen.set(phase, barrier);
    }

    await barrier.wait();
  }

  onWillDestory(): void {}
}
