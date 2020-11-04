export function bindRuntimeContext<T, U>(x: T, ctx: U): T {
  if (typeof x === 'function') {
    return x.bind(ctx);
  }

  if (typeof x !== 'object') {
    return x;
  }

  if (x === null) {
    return null;
  }

  if (Array.isArray(x)) {
    return (x.map((item) => bindRuntimeContext(item, ctx)) as unknown) as T;
  }

  const res = {} as Record<string, unknown>;

  Object.entries(x).forEach(([k, v]) => {
    res[k] = bindRuntimeContext(v, ctx);
  });

  return (res as unknown) as T;
}
