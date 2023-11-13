const excludePropertyNames = [
  '$$typeof',
  'render',
  'defaultProps',
  'props',
  'length',
  'prototype',
  'name',
  'caller',
  'callee',
  'arguments',
];

export function cloneEnumerableProperty(target: any, origin: any, excludes = excludePropertyNames) {
  const compExtraPropertyNames = Object.keys(origin).filter(d => !excludes.includes(d));

  compExtraPropertyNames.forEach((d: string) => {
    (target as any)[d] = origin[d];
  });

  return target;
}
