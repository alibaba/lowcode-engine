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

export const mockConsoleWarn = jest.fn();
console.warn = mockConsoleWarn;

process.env.NODE_ENV = 'production';