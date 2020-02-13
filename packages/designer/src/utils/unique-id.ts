let guid = Date.now();
export function uniqueId(prefix = '') {
  return `${prefix}${(guid++).toString(36).toLowerCase()}`;
}
