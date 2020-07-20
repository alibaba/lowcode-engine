import { isObject } from 'lodash/isObject';
import { nextId } from '../utils';
import { DerivationState, IDerivation, setDerivationDirty } from '../derivation';
import { globalState } from '../ global-state';
import Obx, { hasObx, getObx, injectObx, ObxFlag } from './obx';

export interface IDepTreeNode {
  id: string;
  name: string;
  observing: IObservable[];
}

export interface IObservable extends IDepTreeNode {
  diffFlag?: boolean;

  observers: Set<IDerivation>;

  // Used to avoid redundant propagations
  lowestObserverState: DerivationState;
  // Used to push itself to global.pendingUnobservations at most once per batch.
  isPendingUnobservation?: boolean;

  // Id of the derivation *run* that last accessed this observable.
  lastAccessedBy?: number;
  isBeingObserved?: boolean;
  onBecomeUnobserved(): void;
}

export function addObserver(observable: IObservable, node: IDerivation) {
  observable.observers.add(node);

  if (observable.lowestObserverState > node.dependenciesState) {
    observable.lowestObserverState = node.dependenciesState;
  }
}

export function removeObserver(observable: IObservable, node: IDerivation) {
  observable.observers.delete(node);
  if (observable.observers.size === 0) {
    // deleting last observer
    queueForUnobservation(observable);
  }
}

export function queueForUnobservation(observable: IObservable) {
  if (!observable.isPendingUnobservation) {
    observable.isPendingUnobservation = true;
    globalState.pendingUnobservations.push(observable);
  }
}

export function startBatch() {
  globalState.inBatch++;
}

export function endBatch() {
  if (--globalState.inBatch === 0) {
    // the batch is actually about to finish, all unobserving should happen here.
    const list = globalState.pendingUnobservations;
    for (let i = 0; i < list.length; i++) {
      const observable = list[i];
      observable.isPendingUnobservation = false;
      if (observable.observers.size === 0) {
        if (observable.isBeingObserved) {
          // if this observable had reactive observers, trigger the hooks
          observable.isBeingObserved = false;
          observable.onBecomeUnobserved();
        }
      }
    }
    globalState.pendingUnobservations = [];
  }
}

export function reportObserved(observable: IObservable): void {
  const derivation = globalState.trackingDerivation;
  if (!derivation) {
    return;
  }

  if (derivation.runId !== observable.lastAccessedBy) {
    observable.lastAccessedBy = derivation.runId;
    derivation.newObserving![derivation.unboundDepsCount!++] = observable;
    if (!observable.isBeingObserved) {
      observable.isBeingObserved = true;
    }
  }
}

export function propagateChanged(observable: IObservable, force = false) {
  if (observable.lowestObserverState === DerivationState.DIRTY && !force) {
    return;
  }
  observable.lowestObserverState = DerivationState.DIRTY;
  observable.observers.forEach((d) => setDerivationDirty(d));
}

export function propagateChangeConfirmed(observable: IObservable) {
  if (observable.lowestObserverState === DerivationState.DIRTY) {
    return;
  }
  observable.lowestObserverState = DerivationState.DIRTY;

  observable.observers.forEach((d) => {
    if (d.dependenciesState === DerivationState.MYBE_DIRTY) {
      d.dependenciesState = DerivationState.DIRTY;
    } else if (d.dependenciesState === DerivationState.UP_TO_DATE) {
      observable.lowestObserverState = DerivationState.UP_TO_DATE;
    }
  });
}

export function propagateMaybeChanged(observable: IObservable) {
  if (observable.lowestObserverState !== DerivationState.UP_TO_DATE) {
    return;
  }
  observable.lowestObserverState = DerivationState.MYBE_DIRTY;

  observable.observers.forEach((d) => {
    if (d.dependenciesState === DerivationState.UP_TO_DATE) {
      d.dependenciesState = DerivationState.MYBE_DIRTY;
      d.onBecomeDirty();
    }
  });
}

export function asObservable(thing: any, obxFlag: ObxFlag): Obx | undefined {
  if (!isObject(thing)) {
    return;
  }

  if (hasObx(thing)) {
    return getObx(thing);
  }

  if (!Object.isExtensible(thing)) {
    return;
  }

  const name = (thing.constructor.name || 'ObservableObject') + '@' + nextId();
  const ObxContructor = (asObservable as any).getObxContructor(thing);
  const obx = ObxContructor ? new ObxContructor(name, thing, obxFlag) : null;

  if (obx) {
    injectObx(thing, obx);
    return obx;
  }
}

(asObservable as any).getObxContructor = () => Obx;

export function observeIterable(items: Iterable<any>, obxFlag: ObxFlag): void {
  for (const n of items) {
    asObservable(n, obxFlag);
  }
}

export function reportPropValue(propValue: any, propFlag: ObxFlag): void {
  if (propValue == null) return;

  const x = propFlag > ObxFlag.REF ? asObservable(propValue, propFlag) : getObx(propValue);

  if (x) {
    reportObserved(x);
  }
}

export function reportChildValue(propValue: any, ownerFlag: ObxFlag): void {
  if (propValue == null) return;

  const x =
    ownerFlag > ObxFlag.VAL
      ? asObservable(propValue, ownerFlag === ObxFlag.DEEP ? ObxFlag.DEEP : ObxFlag.VAL)
      : getObx(propValue);

  if (x) {
    reportObserved(x);
  }
}
