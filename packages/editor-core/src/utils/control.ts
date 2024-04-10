let globalEventOn = true;

export function setGlobalEventFlag(flag: boolean) {
  globalEventOn = flag;
}

export function switchGlobalEventOn() {
  setGlobalEventFlag(true);
}

export function switchGlobalEventOff() {
  setGlobalEventFlag(false);
}

export function isGlobalEventOn() {
  return globalEventOn;
}

export function runWithGlobalEventOff(fn: Function) {
  switchGlobalEventOff();
  fn();
  switchGlobalEventOn();
}

type ListenerFunc = (...args: any[]) => void;
export function wrapWithEventSwitch(fn: ListenerFunc): ListenerFunc {
  return (...args: any[]) => {
    if (isGlobalEventOn()) fn(...args);
  };
}
