function makeProxy(target: { [name: string]: any }, meta: any = {}): any {
  if (target.__isProxy) {
    const value = target.__getRaw();
    const rawMeta = target.__getMeta();
    return makeProxy(value, Object.assign({}, rawMeta, meta));
  }
  return new Proxy(target, {
    get: (obj, prop: string | number) => {
      if (prop === '__isProxy') return true;
      if (prop === '__getRaw') return () => target;
      if (prop === '__getMeta') return () => meta;
      return Object.prototype.hasOwnProperty.call(meta, prop) ? meta[prop] : obj[prop];
    },
    has: (obj, prop) => {
      return (
        Object.prototype.hasOwnProperty.call(obj, prop) ||
        Object.prototype.hasOwnProperty.call(meta, prop)
      );
    },
  });
}

export default makeProxy;
