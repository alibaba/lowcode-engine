import { Provide, createDecorator, EventEmitter, EventDisposable } from '@alilc/lowcode-shared';

export const enum LifecyclePhase {
  Starting = 1,

  OptionsResolved = 2,

  Ready = 3,

  Destroying = 4,
}

export interface ILifeCycleService {
  /**
   * A flag indicating in what phase of the lifecycle we currently are.
   */
  phase: LifecyclePhase;

  setPhase(phase: LifecyclePhase): Promise<void>;

  /**
   * Returns a promise that resolves when a certain lifecycle phase
   * has started.
   */
  when(phase: LifecyclePhase, listener: () => void | Promise<void>): EventDisposable;
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

@Provide(ILifeCycleService)
export class LifeCycleService implements ILifeCycleService {
  private readonly phaseWhen = new EventEmitter();

  private _phase = LifecyclePhase.Starting;

  get phase(): LifecyclePhase {
    return this._phase;
  }

  async setPhase(value: LifecyclePhase) {
    if (value < this._phase) {
      throw new Error('Lifecycle cannot go backwards');
    }

    if (this._phase === value) {
      return;
    }

    this._phase = value;

    await this.phaseWhen.emit(LifecyclePhaseToString(value));
  }

  when(phase: LifecyclePhase, listener: () => void | Promise<void>) {
    return this.phaseWhen.on(LifecyclePhaseToString(phase), listener);
  }
}
