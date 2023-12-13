export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object';
}

export function isI18NObject(value: any): boolean {
  return isObject(value) && value.type === 'i18n';
}
