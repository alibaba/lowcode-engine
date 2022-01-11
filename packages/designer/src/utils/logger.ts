import Logger, { Level } from 'zen-logger';

export { Logger };

export function getLogger(config: { level: Level; bizName: string }): Logger {
  return new Logger(config);
}
