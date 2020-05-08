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
      return meta.hasOwnProperty(prop) ? meta[prop] : obj[prop];
      // return obj[prop];
    },
    has: (obj, prop) => obj.hasOwnProperty(prop) || meta.hasOwnProperty(prop),
  });
}

export default makeProxy;
