/**
 * A barrier that is initially closed and then becomes opened permanently.
 */
export class Barrier {
  private _isOpen: boolean;
  private _promise: Promise<boolean>;
  private _completePromise!: (v: boolean) => void;

  constructor() {
    this._isOpen = false;
    this._promise = new Promise<boolean>((c) => {
      this._completePromise = c;
    });
  }

  isOpen(): boolean {
    return this._isOpen;
  }

  open(): void {
    this._isOpen = true;
    this._completePromise(true);
  }

  wait(): Promise<boolean> {
    return this._promise;
  }
}

/**
 * A barrier that is initially closed and then becomes opened permanently after a certain period of
 * time or when open is called explicitly
 */
export class AutoOpenBarrier extends Barrier {
  private readonly _timeout: any;

  constructor(autoOpenTimeMs: number) {
    super();
    this._timeout = setTimeout(() => this.open(), autoOpenTimeMs);
  }

  override open(): void {
    clearTimeout(this._timeout);
    super.open();
  }
}

const canceledName = 'Canceled';

/**
 * Checks if the given error is a promise in canceled state
 */
export function isCancellationError(error: any): boolean {
  if (error instanceof CancellationError) {
    return true;
  }
  return error instanceof Error && error.name === canceledName && error.message === canceledName;
}

export class CancellationError extends Error {
  constructor() {
    super(canceledName);
    this.name = this.message;
  }
}

export type ValueCallback<T = unknown> = (value: T | Promise<T>) => void;

const enum DeferredOutcome {
  Resolved,
  Rejected,
}

/**
 * Creates a promise whose resolution or rejection can be controlled imperatively.
 */
export class DeferredPromise<T> {
  private completeCallback!: ValueCallback<T>;
  private errorCallback!: (err: unknown) => void;
  private outcome?: { outcome: DeferredOutcome.Rejected; value: any } | { outcome: DeferredOutcome.Resolved; value: T };

  public get isRejected() {
    return this.outcome?.outcome === DeferredOutcome.Rejected;
  }

  public get isResolved() {
    return this.outcome?.outcome === DeferredOutcome.Resolved;
  }

  public get isSettled() {
    return !!this.outcome;
  }

  public get value() {
    return this.outcome?.outcome === DeferredOutcome.Resolved ? this.outcome?.value : undefined;
  }

  public readonly p: Promise<T>;

  constructor() {
    this.p = new Promise<T>((c, e) => {
      this.completeCallback = c;
      this.errorCallback = e;
    });
  }

  public complete(value: T) {
    return new Promise<void>((resolve) => {
      this.completeCallback(value);
      this.outcome = { outcome: DeferredOutcome.Resolved, value };
      resolve();
    });
  }

  public error(err: unknown) {
    return new Promise<void>((resolve) => {
      this.errorCallback(err);
      this.outcome = { outcome: DeferredOutcome.Rejected, value: err };
      resolve();
    });
  }

  public cancel() {
    return this.error(new CancellationError());
  }
}
