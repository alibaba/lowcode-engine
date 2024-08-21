export function invariant(check: unknown, message: string, thing?: any): asserts check {
  if (!check) {
    throw new Error(`Invariant failed: ${message}${thing ? ` in '${thing}'` : ''}`);
  }
}

export function illegalArgument(name?: string): Error {
  if (name) {
    return new Error(`Illegal argument: ${name}`);
  } else {
    return new Error('Illegal argument');
  }
}

export function illegalState(name?: string): Error {
  if (name) {
    return new Error(`Illegal state: ${name}`);
  } else {
    return new Error('Illegal state');
  }
}
