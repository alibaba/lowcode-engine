export function first<T>(iterable: Iterable<T>): T | undefined {
  return iterable[Symbol.iterator]().next().value;
}

export function isEmpty<T>(iterable: Iterable<T> | undefined | null): boolean {
  return !iterable || iterable[Symbol.iterator]().next().done === true;
}
