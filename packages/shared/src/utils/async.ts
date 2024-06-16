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
