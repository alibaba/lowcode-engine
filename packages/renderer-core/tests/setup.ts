jest.mock('zen-logger', () => {
  class Logger {
    log() {}
    error() {}
    warn() {}
    debug() {}
  }
  return {
    __esModule: true,
    default: Logger,
  };
});

jest.mock('lodash', () => {
  const original = jest.requireActual('lodash');

  return {
    ...original,
    debounce: (fn) => (...args: any[]) => fn.apply(this, args),
    throttle: (fn) => (...args: any[]) => fn.apply(this, args),
  }
})

export const mockConsoleWarn = jest.fn();
console.warn = mockConsoleWarn;

process.env.NODE_ENV = 'production';