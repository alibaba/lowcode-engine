export function invariant(check: unknown, message: string, thing?: any): asserts check {
  if (!check) {
    throw new Error(`Invariant failed: ${message}${thing ? ` in '${thing}'` : ''}`);
  }
}
