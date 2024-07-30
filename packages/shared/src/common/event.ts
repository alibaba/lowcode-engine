import { Disposable, IDisposable, toDisposable } from './disposable';

export type Event<T> = (listener: (arg: T, thisArg?: any) => any) => IDisposable;

export class Observable<T> {
  private _isDisposed = false;

  private _event?: Event<T>;
  private _listeners?: Set<(arg: T) => void>;

  dispose(): void {
    if (this._isDisposed) return;

    this._listeners?.clear();
    this._listeners = undefined;
    this._event = undefined;
    this._isDisposed = true;
  }

  notify(arg: T): void {
    if (this._isDisposed) return;

    this._listeners?.forEach((listener) => listener(arg));
  }

  /**
   * For the public to allow to subscribe to events from this Observable
   */
  get subscribe(): Event<T> {
    if (!this._event) {
      this._event = (listener: (arg: T) => void, thisArg?: any) => {
        if (this._isDisposed) {
          return Disposable.Noop;
        }

        if (thisArg) {
          listener = listener.bind(thisArg);
        }

        if (!this._listeners) this._listeners = new Set();
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
    }
  }
}
