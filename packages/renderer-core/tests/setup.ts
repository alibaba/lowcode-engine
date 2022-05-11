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
    debounce: (fn) => () => fn(),
    throttle: (fn) => () => fn(),
  }
})

export const mockConsoleWarn = jest.fn();
console.warn = mockConsoleWarn;

process.env.NODE_ENV = 'production';