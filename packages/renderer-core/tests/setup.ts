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