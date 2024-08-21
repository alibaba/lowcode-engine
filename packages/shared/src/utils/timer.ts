import { IDisposable, toDisposable } from '../common';

export class TimeoutTimer implements IDisposable {
  private _token: any;
  private _isDisposed = false;

  constructor();
  constructor(runner: () => void, timeout: number);
  constructor(runner?: () => void, timeout?: number) {
    this._token = -1;

    if (typeof runner === 'function' && typeof timeout === 'number') {
      this.setIfNotSet(runner, timeout);
    }
  }

  dispose(): void {
    this.cancel();
    this._isDisposed = true;
  }

  cancel(): void {
    if (this._token !== -1) {
      clearTimeout(this._token);
      this._token = -1;
    }
  }

  cancelAndSet(runner: () => void, timeout: number): void {
    if (this._isDisposed) {
      throw Error(`Calling 'cancelAndSet' on a disposed TimeoutTimer`);
    }

    this.cancel();
    this._token = setTimeout(() => {
      this._token = -1;
      runner();
    }, timeout);
  }

  setIfNotSet(runner: () => void, timeout: number): void {
    if (this._isDisposed) {
      throw Error(`Calling 'setIfNotSet' on a disposed TimeoutTimer`);
    }

    if (this._token !== -1) {
      // timer is already set
      return;
    }
    this._token = setTimeout(() => {
      this._token = -1;
      runner();
    }, timeout);
  }
}

export class IntervalTimer implements IDisposable {
  private disposable: IDisposable | undefined = undefined;
  private isDisposed = false;

  cancel(): void {
    this.disposable?.dispose();
    this.disposable = undefined;
  }

  cancelAndSet(runner: () => void, interval: number): void {
    if (this.isDisposed) {
      throw new Error(`Calling 'cancelAndSet' on a disposed IntervalTimer`);
    }

    this.cancel();
    const handle = setInterval(() => {
      runner();
    }, interval);

    this.disposable = toDisposable(() => {
      clearInterval(handle);
      this.disposable = undefined;
    });
  }

  dispose(): void {
    this.cancel();
    this.isDisposed = true;
  }
}
