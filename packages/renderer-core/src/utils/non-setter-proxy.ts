export function nonSetterProxy<T extends object>(target: T) {
  return new Proxy<T>(target, {
    get(target, p, receiver) {
      return Reflect.get(target, p, receiver);
    },
    set() {
      return false;
    },
    has(target, p) {
      return Reflect.has(target, p);
    },
  });
}
