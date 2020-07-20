import {
  DerivationState,
  IDerivation,
  runDerivedFunction,
  isCaughtException,
  shouldCompute,
  clearObserving,
  CaughtException,
} from './derivation';
import { nextTick } from './next-tick';
import { IObservable, endBatch, startBatch } from './observable/observable';
import { globalState } from './ global-state';
import { throttle } from './utils/throttle';

export function nextId() {
  return (++globalState.guid).toString(36).toLocaleLowerCase();
}

export class Reaction implements IDerivation {
  observing: IObservable[] = [];
  dependenciesState = DerivationState.NOT_TRACKING;
  id = nextId();
  scheduled = false;
  run: () => void;
  caughtException: any = null;

  private sleeping = false;
  private running = false;

  constructor(public name: string, private check: () => void, public level: number = 0, throttleWait = 10) {
    if (throttleWait > 0) {
      this.run = throttle(this.runReaction.bind(this), throttleWait);
    } else {
      this.run = this.runReaction.bind(this);
    }
  }

  onBecomeDirty() {
    this.schedule();
  }

  schedule() {
    if (this.scheduled || this.sleeping) {
      return;
    }
    this.scheduled = true;
    scheduleReaction(this);
  }

  isDirty(): boolean {
    return shouldCompute(this);
  }

  runReaction() {
    if (this.sleeping || this.running) {
      return;
    }

    startBatch();
    if (shouldCompute(this)) {
      this.caughtException = null;
      try {
        this.check();
      } catch (e) {
        this.caughtException = new CaughtException(e);
      }
    }
    endBatch();
  }

  track(fn: () => void) {
    startBatch();
    this.running = true;
    const result = runDerivedFunction(this, fn);
    if (isCaughtException(result)) {
      this.caughtException = result;
    }
    this.running = false;
    if (this.sleeping) {
      clearObserving(this);
    }
    endBatch();
  }

  sleep() {
    if (this.sleeping) {
      return;
    }
    this.sleeping = true;
    if (!this.running) {
      startBatch();
      clearObserving(this);
      endBatch();
      deScheduleReaction(this);
    }
  }

  wakeup(sync = false) {
    if (this.sleeping) {
      this.sleeping = false;
      if (sync) {
        this.runReaction();
      } else {
        this.schedule();
      }
    }
  }
}

let flushIndex = 0;
let flushWaiting = false;

function scheduleReaction(reaction: Reaction) {
  const { pendingReactions, isRunningReactions } = globalState;
  if (!isRunningReactions) {
    pendingReactions.push(reaction);
  } else {
    let i = pendingReactions.length - 1;
    //  0  1  2  3  4  5  6  7  8  9
    //  0, 0, 1, 1, 1, 2, 2, 2, 3, 3
    //       ^                 ^
    //   flushIndex = 2        level = 2
    //   break at: i = 7 or i = 2
    while (i > flushIndex && pendingReactions[i].level > reaction.level) {
      i--;
    }
    pendingReactions.splice(i + 1, 0, reaction);
  }

  runReactions();
}

function deScheduleReaction(reaction: Reaction) {
  const { pendingReactions, isRunningReactions } = globalState;
  if (!isRunningReactions) {
    const i = pendingReactions.indexOf(reaction);
    if (i > -1) {
      pendingReactions.splice(i, 1);
    }
  }
}

export function runReactions() {
  // queue the flush
  if (!flushWaiting) {
    flushWaiting = true;
    nextTick(flushReactions);
  }
}

const MAX_REACTION_ITERATIONS = 100;

function flushReactions() {
  globalState.isRunningReactions = true;
  const allReactions = globalState.pendingReactions;
  let pendingLength = 0;
  let iterations = 0;

  // low level run first
  // sort as:
  // 0, 0, 0, 1, 1, 1, 2, 2, 3, 4, 5, 5, 5
  allReactions.sort((a, b) => a.level - b.level);

  while (allReactions.length > pendingLength) {
    pendingLength = allReactions.length;
    if (++iterations === MAX_REACTION_ITERATIONS) {
      // tslint:disable-next-line
      console.error(
        `Reaction doesn't converge to a stable state after ${MAX_REACTION_ITERATIONS} iterations.` +
          ` Probably there is a cycle in the reactive function: ${allReactions[0]}`,
      );
      break;
    }
    for (; flushIndex < pendingLength; flushIndex++) {
      allReactions[flushIndex].scheduled = false;
      allReactions[flushIndex].run();
    }
  }

  flushIndex = 0;
  flushWaiting = false;
  allReactions.length = 0;
  globalState.isRunningReactions = false;
}

export function clearReactions() {
  const { pendingReactions } = globalState;
  let i = pendingReactions.length;
  while (i--) {
    pendingReactions[i].sleep();
  }
}

export interface Disposer {
  (): void;
  name?: string;
  $obx: Reaction;
}
export interface AutorunOptions {
  throttle?: number;
  sync?: boolean;
  level?: number;
  name?: string;
  runFirstNow?: boolean;
}
export interface RunContext {
  dispose: Disposer;
  firstRun: boolean;
}
export type Action = (this: RunContext, context: RunContext) => any;

export function autorun(action: Action, options: number | true | AutorunOptions = {}): Disposer {
  if (typeof options === 'number') {
    options = { throttle: options };
  } else if (options === true) {
    options = { sync: true };
  }
  const name: string = options.name || (action as any).name || 'Autorun@' + nextId();

  const reaction = new Reaction(
    name,
    function(this: Reaction) {
      this.track(reactionRunner);
    },
    options.level || 0,
    options.throttle || 0,
  );

  const dispose = () => {
    reaction.sleep();
  };

  dispose.$obx = reaction;

  let firstRun = true;
  function reactionRunner() {
    const ctx: RunContext = {
      firstRun,
      dispose,
    };
    action.call(ctx, ctx);
    firstRun = false;
  }

  if (options.sync || options.runFirstNow) {
    reaction.runReaction();
  } else {
    reaction.schedule();
  }

  return dispose;
}
