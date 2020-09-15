const useRAF = typeof requestAnimationFrame === 'function';

// eslint-disable-next-line @typescript-eslint/ban-types
export function throttle(func: Function, delay: number) {
  let lastArgs: any;
  let lastThis: any;
  let result: any;
  let timerId: number | undefined;
  let lastCalled: number | undefined;
  let lastInvoked = 0;

  function invoke(time: number) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = undefined;
    lastThis = undefined;
    lastInvoked = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function startTimer(pendingFunc: any, wait: number): number {
    if (useRAF) {
      return requestAnimationFrame(pendingFunc);
    }
    return setTimeout(pendingFunc, wait) as any;
  }

  function leadingEdge(time: number) {
    lastInvoked = time;
    timerId = startTimer(timerExpired, delay);
    return invoke(time);
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCalled = time - lastCalled!;
    const timeSinceLastInvoked = time - lastInvoked;

    return (
      lastCalled === undefined ||
      timeSinceLastCalled >= delay ||
      timeSinceLastCalled < 0 ||
      timeSinceLastInvoked >= delay
    );
  }

  function remainingWait(time: number) {
    const timeSinceLastCalled = time - lastCalled!;
    const timeSinceLastInvoked = time - lastInvoked;

    return Math.min(delay - timeSinceLastCalled, delay - timeSinceLastInvoked);
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }

    timerId = startTimer(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number) {
    timerId = undefined;

    if (lastArgs) {
      return invoke(time);
    }

    lastArgs = undefined;
    lastThis = undefined;
    return result;
  }

  function debounced(this: any, ...args: any[]) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCalled = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCalled);
      }

      timerId = startTimer(timerExpired, delay);
      return invoke(lastCalled);
    }

    if (timerId === undefined) {
      timerId = startTimer(timerExpired, delay);
    }

    return result;
  }

  return debounced;
}
