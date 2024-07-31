import { AnyFunction } from '../types';
import { combinedDisposable, Disposable, IDisposable, toDisposable } from './disposable';

export type Event<T, R = any> = (listener: (arg: T) => R, thisArg?: any) => IDisposable;

export interface EmitterOptions {
  /**
   * Optional function that's called *before* the very first listener is added
   */
  onWillAddFirstListener: AnyFunction;
  /**
   * Optional function that's called *after* remove the very last listener
   */
  onDidRemoveLastListener: AnyFunction;
}

export class Emitter<T, R = any> {
  private _isDisposed = false;

  private _event?: Event<T, R>;
  private _listeners?: Set<(arg: T) => void>;

  constructor(private _options?: EmitterOptions) {}

  dispose(): void {
    if (this._isDisposed) return;

    if (this._listeners?.size !== 0) {
      this._listeners?.clear();
      this._listeners = undefined;
      this._options?.onDidRemoveLastListener();
    }
    this._event = undefined;
    this._isDisposed = true;
  }

  notify(arg: T): void {
    if (this._isDisposed) return;

    this._listeners?.forEach((listener) => listener(arg));
  }

  /**
   * For the public to allow to subscribe to events from this Emitter
   */
  get event(): Event<T, R> {
    if (!this._event) {
      this._event = (listener: (arg: T) => void, thisArg?: any) => {
        if (this._isDisposed) {
          return Disposable.Noop;
        }

        if (thisArg) {
          listener = listener.bind(thisArg);
        }

        if (!this._listeners) {
          this._listeners = new Set();
          this._options?.onWillAddFirstListener();
        }
        this._listeners.add(listener);

        return toDisposable(() => {
          this._removeListener(listener);
        });
      };
    }

    return this._event;
  }

  private _removeListener(listener: (arg: T) => void) {
    if (this._isDisposed) return;

    if (this._listeners?.has(listener)) {
      this._listeners.delete(listener);

      if (this._listeners.size === 0) {
        this._listeners = undefined;
        this._options?.onDidRemoveLastListener?.(this);
      }
    }
  }
}

function snapshot<T>(event: Event<T>): Event<T> {
  let listener: IDisposable | undefined;

  const options: EmitterOptions | undefined = {
    onWillAddFirstListener() {
      listener = event(emitter.notify, emitter);
    },
    onDidRemoveLastListener() {
      listener?.dispose();
    },
  };

  const emitter = new Emitter<T>(options);

  return emitter.event;
}

/**
 * Given an event, returns another event which only fires once.
 *
 * @param event The event source for the new event.
 */
export function once<T>(event: Event<T>): Event<T> {
  return (listener, thisArgs = null) => {
    // we need this, in case the event fires during the listener call
    let didFire = false;
    let result: IDisposable | undefined = undefined;
    result = event((e) => {
      if (didFire) {
        return;
      } else if (result) {
        result.dispose();
      } else {
        didFire = true;
      }

      return listener.call(thisArgs, e);
    }, null);

    if (didFire) {
      result.dispose();
    }

    return result;
  };
}

export function forEach<I>(event: Event<I>, each: (i: I) => void): Event<I> {
  return snapshot((listener, thisArgs = null) =>
    event((i) => {
      each(i);
      listener.call(thisArgs, i);
    }, null),
  );
}

/**
 * Maps an event of one type into an event of another type using a mapping function, similar to how
 * `Array.prototype.map` works.
 *
 * @param event The event source for the new event.
 * @param map The mapping function.
 */
export function map<I, O>(event: Event<I>, map: (i: I) => O): Event<O> {
  return snapshot((listener, thisArgs = null) =>
    event((i) => listener.call(thisArgs, map(i)), null),
  );
}

export function reduce<I, O>(
  event: Event<I>,
  merge: (last: O | undefined, event: I) => O,
  initial?: O,
): Event<O> {
  let output: O | undefined = initial;

  return map<I, O>(event, (e) => {
    output = merge(output, e);
    return output;
  });
}

export function filter<T, U>(event: Event<T | U>, filter: (e: T | U) => e is T): Event<T>;
export function filter<T>(event: Event<T>, filter: (e: T) => boolean): Event<T>;
export function filter<T, R>(event: Event<T | R>, filter: (e: T | R) => e is R): Event<R>;
export function filter<T>(event: Event<T>, filter: (e: T) => boolean): Event<T> {
  return snapshot((listener, thisArgs = null) =>
    event((e) => filter(e) && listener.call(thisArgs, e), null),
  );
}

/**
 * Given a collection of events, returns a single event which emits whenever any of the provided events emit.
 */
export function any<T>(...events: Event<T>[]): Event<T>;
export function any(...events: Event<any>[]): Event<void>;
export function any<T>(...events: Event<T>[]): Event<T> {
  return (listener, thisArgs = null) => {
    return combinedDisposable(...events.map((event) => event((e) => listener.call(thisArgs, e))));
  };
}

/**
 * Creates a promise out of an event, using the {@link Event.once} helper.
 */
export function toPromise<T>(event: Event<T>): Promise<T> {
  return new Promise((resolve) => once(event)(resolve));
}

/**
 * Creates an event out of a promise that fires once when the promise is
 * resolved with the result of the promise or `undefined`.
 */
export function fromPromise<T>(promise: Promise<T>): Event<T | undefined> {
  const result = new Emitter<T | undefined>();

  promise
    .then(
      (res) => {
        result.notify(res);
      },
      () => {
        result.notify(undefined);
      },
    )
    .finally(() => {
      result.dispose();
    });

  return result.event;
}
