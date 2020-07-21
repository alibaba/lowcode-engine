import { IDerivation } from './derivation';
import { Reaction } from './reaction';
import { IObservable } from './observable/observable';

export class Globals {
  /**
   * Currently running derivation
   */
  trackingDerivation: IDerivation | null = null;

  /**
   * Are we running a computation currently? (not a reaction)
   */
  computationDepth = 0;

  /**
   * Each time a derivation is tracked, it is assigned a unique run-id
   */
  runId = 0;

  /**
   * 'guid' for general purpose. Will be persisted amongst resets.
   */
  guid = 0;

  /**
   * Are we in a batch block? (and how many of them)
   */
  inBatch = 0;

  /**
   * Observables that don't have observers anymore
   */
  pendingUnobservations: IObservable[] = [];

  /**
   * List of scheduled, not yet executed, reactions.
   */
  pendingReactions: Reaction[] = [];

  /**
   * Are we currently processing reactions?
   */
  isRunningReactions = false;

  /**
   * disable dynamic observe
   */
  dynamicObserveDisabled = false;

  reset() {
    this.trackingDerivation = null;
    this.computationDepth = 0;
    this.runId = 0;
    this.guid = 0;
    this.inBatch = 0;
    this.pendingUnobservations = [];
    this.pendingReactions = [];
    this.isRunningReactions = false;
    this.dynamicObserveDisabled = false;
  }
}

export const globalState: Globals = new Globals();

export function getGlobalState(): Globals {
  return globalState;
}
