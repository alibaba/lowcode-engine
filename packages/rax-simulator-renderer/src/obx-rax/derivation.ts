import { IObservable, IDepTreeNode, addObserver, removeObserver } from './observable/observable';
import { globalState } from './ global-state';

export enum DerivationState {
  // before being run or (outside batch and not being observed)
  // at this point derivation is not holding any data about dependency tree
  NOT_TRACKING = -1,
  // no shallow dependency changed since last computation
  // won't recalculate derivation
  UP_TO_DATE = 0,
  // don't have to recompute on every dependency change, but only when it's needed
  MYBE_DIRTY = 1,
  // A shallow dependency has changed since last computation and the derivation
  // will need to recompute when it's needed next.
  DIRTY = 2,
}

export interface IDerivation extends IDepTreeNode {
  observing: IObservable[];
  dependenciesState: DerivationState;
  newObserving?: null | IObservable[];
  runId?: number; // Id of the current run of a derivation.
  unboundDepsCount?: number; // amount of dependencies used by the derivation in this run, which has not been bound yet.
  onBecomeDirty(): void;
}

export class CaughtException {
  constructor(public cause: any) {
    // Empty
  }
}

export function isCaughtException(e: any): e is CaughtException {
  return e instanceof CaughtException;
}

interface ModifiedValue {
  ifModified(): void;
}

export function isModifiedValue(v: any): v is ModifiedValue {
  return v.ifModified ? true : false;
}

export function shouldCompute(derivation: IDerivation): boolean {
  switch (derivation.dependenciesState) {
    case DerivationState.UP_TO_DATE:
      return false;
    case DerivationState.NOT_TRACKING:
    case DerivationState.DIRTY:
      return true;
    case DerivationState.MYBE_DIRTY: {
      const prevUntracked = untrackedStart();
      const obs = derivation.observing;
      const l = obs.length;
      for (let i = 0; i < l; i++) {
        const obj = obs[i];
        if (isModifiedValue(obj)) {
          obj.ifModified();
        }

        if ((derivation.dependenciesState as any) === DerivationState.DIRTY) {
          untrackedEnd(prevUntracked);
          return true;
        }
      }
      changeDependenciesStateTo0(derivation);
      untrackedEnd(prevUntracked);
      return false;
    }
  }
}

export function runDerivedFunction(derivation: IDerivation, f: (...args: any[]) => any, context?: any) {
  const prevTracking = globalState.trackingDerivation;
  // pre allocate array allocation + room for variation in deps
  derivation.newObserving = new Array(derivation.observing.length + 100);
  derivation.unboundDepsCount = 0;
  derivation.runId = ++globalState.runId;
  globalState.trackingDerivation = derivation;
  let result;
  try {
    result = f.call(context);
  } catch (e) {
    result = new CaughtException(e);
  }
  globalState.trackingDerivation = prevTracking;
  changeDependenciesStateTo0(derivation);
  bindDependencies(derivation);
  return result;
}

function bindDependencies(derivation: IDerivation) {
  const prevObserving = derivation.observing;
  const observing = (derivation.observing = derivation.newObserving!);
  let lowestNewObservingDerivationState = DerivationState.UP_TO_DATE;

  // Go through all new observables and check diffValue: (this list can contain duplicates):
  //   0: first occurrence, change to 1 and keep it
  //   1: extra occurrence, drop it
  let i0 = 0;
  let l = derivation.unboundDepsCount!;
  for (let i = 0; i < l; i++) {
    const dep = observing[i];
    if (!dep.diffFlag) {
      dep.diffFlag = true;
      if (i0 !== i) {
        observing[i0] = dep;
      }
      i0++;
    }

    // Upcast is 'safe' here, because if dep is IObservable, `dependenciesState` will be undefined,
    // not hitting the condition
    if (((dep as any) as IDerivation).dependenciesState > lowestNewObservingDerivationState) {
      lowestNewObservingDerivationState = ((dep as any) as IDerivation).dependenciesState;
    }
  }
  observing.length = i0;

  derivation.newObserving = null;
  // Go through all old observables and check diffValue: (it is unique after last bindDependencies)
  //   0: it's not in new observables, unobserve it
  //   1: it keeps being observed, don't want to notify it. change to 0
  l = prevObserving.length;
  while (l--) {
    const dep = prevObserving[l];
    if (!dep.diffFlag) {
      removeObserver(dep, derivation);
    }
    dep.diffFlag = false;
  }

  // Go through all new observables and check diffValue: (now it should be unique)
  //   0: it was set to 0 in last loop. don't need to do anything.
  //   1: it wasn't observed, let's observe it. set back to 0
  while (i0--) {
    const dep = observing[i0];
    if (dep.diffFlag) {
      dep.diffFlag = false;
      addObserver(dep, derivation);
    }
  }

  // Some new observed derivations may become stale during this derivation computation
  // so they have had no chance to propagate staleness (#916)
  if (lowestNewObservingDerivationState !== DerivationState.UP_TO_DATE) {
    derivation.dependenciesState = lowestNewObservingDerivationState;
    derivation.onBecomeDirty();
  }
}

export function clearObserving(derivation: IDerivation) {
  const obs = derivation.observing;
  derivation.observing = [];
  let i = obs.length;
  while (i--) {
    removeObserver(obs[i], derivation);
  }

  derivation.dependenciesState = DerivationState.NOT_TRACKING;
}

export function untracked<T>(action: () => T): T {
  const prev = untrackedStart();
  const res = action();
  untrackedEnd(prev);
  return res;
}

export function untrackedStart(): IDerivation | null {
  const prev = globalState.trackingDerivation;
  globalState.trackingDerivation = null;
  return prev;
}

export function untrackedEnd(prev: IDerivation | null) {
  globalState.trackingDerivation = prev;
}

export function changeDependenciesStateTo0(derivation: IDerivation) {
  if (derivation.dependenciesState === DerivationState.UP_TO_DATE) {
    return;
  }
  derivation.dependenciesState = DerivationState.UP_TO_DATE;

  const obs = derivation.observing;
  let i = obs.length;
  while (i--) {
    obs[i].lowestObserverState = DerivationState.UP_TO_DATE;
  }
}

export function setDerivationDirty(derivation: IDerivation) {
  if (derivation.dependenciesState === DerivationState.UP_TO_DATE) {
    derivation.onBecomeDirty();
  }
  derivation.dependenciesState = DerivationState.DIRTY;
}

export function setDerivationMybeDirty(derivation: IDerivation) {
  if (derivation.dependenciesState === DerivationState.UP_TO_DATE) {
    derivation.onBecomeDirty();
  }
  derivation.dependenciesState = DerivationState.MYBE_DIRTY;
}

export function resetDerivationState(derivation: IDerivation) {
  derivation.dependenciesState = DerivationState.NOT_TRACKING;
}
