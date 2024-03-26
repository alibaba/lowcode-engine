import { appBoosts } from '../boosts';

export type ErrorType = string;

export class RuntimeError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
  ) {
    super(message);
    appBoosts.hookStore.call(`app:error`, this);
  }
}

export function throwRuntimeError(errorType: ErrorType, message: string) {
  return new RuntimeError(errorType, message);
}
