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

export function cloneEnumerableProperty(target: any, origin: any) {
  const compExtraPropertyNames = Object.keys(origin).filter(d => !excludePropertyNames.includes(d));

  compExtraPropertyNames.forEach((d: string) => {
    (target as any)[d] = origin[d];
  });

  return target;
}
