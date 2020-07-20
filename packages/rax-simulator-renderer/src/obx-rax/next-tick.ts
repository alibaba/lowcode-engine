const callbacks: Array<() => void> = [];
let pending = false;

function flush() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (const fn of copies) {
    fn();
  }
}

let timerFlush: () => void;
if (typeof process === 'object' && process.nextTick) {
  timerFlush = () => process.nextTick(flush);
} else if (typeof Promise === 'function') {
  // tslint:disable-line
  const timer = Promise.resolve(); // tslint:disable-line
  timerFlush = () => {
    timer.then(flush);
    // if (isIOS) setTimeout(noop)
  };
} else if (typeof MessageChannel === 'function') {
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = flush;
  timerFlush = () => {
    port.postMessage(1);
  };
} else {
  timerFlush = () => {
    setTimeout(flush, 0);
  };
}

export function clearTicks() {
  callbacks.length = 0;
}

export function nextTick(callback?: () => void): Promise<any> {
  let _resovle: () => void;

  callbacks.push(() => {
    callback && callback();
    _resovle();
  });

  if (!pending) {
    pending = true;
    timerFlush();
  }

  return new Promise((resolve) => {
    _resovle = resolve;
  });
}
