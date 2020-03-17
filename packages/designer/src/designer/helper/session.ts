export default class Session {
  private _data: any;
  private activedTimer: any;

  get data() {
    return this._data;
  }

  constructor(readonly cursor: number, data: any, private timeGap: number = 1000) {
    this.setTimer();
    this.log(data);
  }

  log(data: any) {
    if (!this.isActive()) {
      return;
    }
    this._data = data;
    this.setTimer();
  }

  isActive() {
    return this.activedTimer != null;
  }

  end() {
    if (this.isActive()) {
      this.clearTimer();
      console.info('session end');
    }
  }

  private setTimer() {
    this.clearTimer();
    this.activedTimer = setTimeout(() => this.end(), this.timeGap);
  }

  private clearTimer() {
    if (this.activedTimer) {
      clearTimeout(this.activedTimer);
    }
    this.activedTimer = null;
  }
}
