export function isPrimitive(obj: any): boolean {
  // null | undefined
  if (obj == null) {
    return true;
  }
  const t = typeof obj;
  return t === 'boolean' || t === 'number' || t === 'string' || t === 'symbol';
}
