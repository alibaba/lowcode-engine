import { createSingleCallFunction, Iterable } from '../utils';

/**
 * An object that performs a cleanup operation when `.dispose()` is called.
 *
 * Some examples of how disposables are used:
 *
 * - An event listener that removes itself when `.dispose()` is called.
 * - A resource such as a file system watcher that cleans up the resource when `.dispose()` is called.
 * - The return value from registering a provider. When `.dispose()` is called, the provider is unregistered.
 */
export interface IDisposable {
  dispose(): void;
}

/**
 * Check if `thing` is {@link IDisposable disposable}.
 */
export function isDisposable<E>(thing: E): thing is E & IDisposable {
  return (
    typeof thing === 'object' &&
    thing !== null &&
    typeof (thing as unknown as IDisposable).dispose === 'function' &&
    (thing as unknown as IDisposable).dispose.length === 0
  );
}

const noop = () => {};

export abstract class Disposable implements IDisposable {
  static Noop: IDisposable = { dispose: noop };

  private readonly _store = new DisposableStore();

  protected _isDisposed = false;

  protected _throwIfDisposed(msg: string = 'this disposable has been disposed'): void {
    if (this._isDisposed) {
      throw new Error(msg);
    }
  }

  dispose(): void {
    this._store.dispose();
  }

  /**
   * Adds `o` to the collection of disposables managed by this object.
   */
  protected addDispose<T extends IDisposable>(o: T): T {
    this._throwIfDisposed();
    if ((o as unknown as Disposable) === this) {
      throw new Error('Cannot register a disposable on itself!');
    }
    return this._store.add(o);
  }
}

/**
 * Manages a collection of disposable values.
 *
 * This is the preferred way to manage multiple disposables. A `DisposableStore` is safer to work with than an
 * `IDisposable[]` as it considers edge cases, such as registering the same value multiple times or adding an item to a
 * store that has already been disposed of.
 */
export class DisposableStore implements IDisposable {
  static DISABLE_DISPOSED_WARNING = false;

  private readonly _toDispose = new Set<IDisposable>();
  private _isDisposed = false;

  /**
   * Dispose of all registered disposables and mark this object as disposed.
   *
   * Any future disposables added to this object will be disposed of on `add`.
   */
  dispose(): void {
    if (this._isDisposed) {
      return;
    }

    this._isDisposed = true;
    this.clear();
  }

  /**
   * @return `true` if this object has been disposed of.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Dispose of all registered disposables but do not mark this object as disposed.
   */
  clear(): void {
    if (this._toDispose.size === 0) {
      return;
    }

    try {
      dispose(this._toDispose);
    } finally {
      this._toDispose.clear();
    }
  }

  /**
   * Add a new {@link IDisposable disposable} to the collection.
   */
  add<T extends IDisposable>(o: T): T {
    if (!o) {
      return o;
    }
    if ((o as unknown as DisposableStore) === this) {
      throw new Error('Cannot register a disposable on itself!');
    }

    if (this._isDisposed) {
      if (!DisposableStore.DISABLE_DISPOSED_WARNING) {
        console.warn(
          new Error(
            'Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!',
          ).stack,
        );
      }
    } else {
      this._toDispose.add(o);
    }

    return o;
  }

  /**
   * Deletes a disposable from store and disposes of it. This will not throw or warn and proceed to dispose the
   * disposable even when the disposable is not part in the store.
   */
  delete<T extends IDisposable>(o: T): void {
    if (!o) {
      return;
    }
    if ((o as unknown as DisposableStore) === this) {
      throw new Error('Cannot dispose a disposable on itself!');
    }
    this._toDispose.delete(o);
    o.dispose();
  }

  /**
   * Deletes the value from the store, but does not dispose it.
   */
  deleteAndLeak<T extends IDisposable>(o: T): void {
    if (!o) {
      return;
    }
    if (this._toDispose.has(o)) {
      this._toDispose.delete(o);
    }
  }
}

/**
 * Disposes of the value(s) passed in.
 */
export function dispose<T extends IDisposable>(disposable: T): T;
export function dispose<T extends IDisposable>(disposable: T | undefined): T | undefined;
export function dispose<T extends IDisposable, A extends Iterable<T> = Iterable<T>>(
  disposables: A,
): A;
export function dispose<T extends IDisposable>(disposables: Array<T>): Array<T>;
export function dispose<T extends IDisposable>(disposables: ReadonlyArray<T>): ReadonlyArray<T>;
export function dispose<T extends IDisposable>(arg: T | Iterable<T> | undefined): any {
  if (Iterable.is(arg)) {
    const errors: any[] = [];

    for (const d of arg) {
      if (d) {
        try {
          d.dispose();
        } catch (e) {
          errors.push(e);
        }
      }
    }

    if (errors.length === 1) {
      throw errors[0];
    } else if (errors.length > 1) {
      throw new AggregateError(errors, 'Encountered errors while disposing of store');
    }

    return Array.isArray(arg) ? [] : arg;
  } else if (arg) {
    arg.dispose();
    return arg;
  }
}

/**
 * Turn a function that implements dispose into an {@link IDisposable}.
 *
 * @param fn Clean up function, guaranteed to be called only **once**.
 */
export function toDisposable(fn: () => void): IDisposable {
  return {
    dispose: createSingleCallFunction(() => {
      fn();
    }),
  };
}

/**
 * Combine multiple disposable values into a single {@link IDisposable}.
 */
export function combinedDisposable(...disposables: IDisposable[]): IDisposable {
  return toDisposable(() => dispose(disposables));
}
