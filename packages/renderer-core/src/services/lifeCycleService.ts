import { Provide, createDecorator, Barrier } from '@alilc/lowcode-shared';

export const enum LifecyclePhase {
  Starting = 1,

  OptionsResolved = 2,

  Ready = 3,

  BeforeMount = 4,

  Mounted = 5,

  BeforeUnmount = 6,
}

export interface ILifeCycleService {
  /**
   * A flag indicating in what phase of the lifecycle we currently are.
   */
  phase: LifecyclePhase;

  /**
   * Returns a promise that resolves when a certain lifecycle phase
   * has started.
   */
  when(phase: LifecyclePhase): Promise<void>;
}

export const ILifeCycleService = createDecorator<ILifeCycleService>('lifeCycleService');

@Provide(ILifeCycleService)
export class LifeCycleService implements ILifeCycleService {
  private readonly phaseWhen = new Map<LifecyclePhase, Barrier>();

  private _phase = LifecyclePhase.Starting;

  get phase(): LifecyclePhase {
    return this._phase;
  }

  set phase(value: LifecyclePhase) {
    if (value < this.phase) {
      throw new Error('Lifecycle cannot go backwards');
    }

    if (this._phase === value) {
      return;
    }

    // this.logService.trace(`lifecycle: phase changed (value: ${value})`);

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
}
