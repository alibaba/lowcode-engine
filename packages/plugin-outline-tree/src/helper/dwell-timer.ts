/**
 * 停留检查计时器
 */
export default class DwellTimer {
  private timer: number | undefined;
  private previous: any;

  constructor(readonly timeout: number = 400) {}

  /**
   * 根据传入的 ID 判断，停留事件是否触发
   * 如果上一次的标示(包括不存在)和这次不相同，则设置停留计时器
   * 反之什么也不用做
   */
  start(id: any, fn: () => void) {
    if (this.previous !== id) {
      this.end();
      this.previous = id;
      this.timer = setTimeout(() => {
        fn();
        this.end();
      }, this.timeout) as number;
    }
  }

  end() {
    const timer = this.timer;
    if (timer) {
      clearTimeout(timer);
      this.timer = undefined;
    }

    if (this.previous) {
      this.previous = undefined;
    }
  }
}
