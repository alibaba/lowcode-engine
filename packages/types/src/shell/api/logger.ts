export type LoggerLevel = 'debug' | 'log' | 'info' | 'warn' | 'error';
export interface ILoggerOptions {
  level?: LoggerLevel;
  bizName?: string;
}

export interface IPublicApiLogger {

  /**
   * debug info
   */
  debug(...args: any | any[]): void;

  /**
   * normal info output
   */
  info(...args: any | any[]): void;

  /**
   * warning info output
   */
  warn(...args: any | any[]): void;

  /**
   * error info output
   */
  error(...args: any | any[]): void;

  /**
   * log info output
   */
  log(...args: any | any[]): void;
}
