
// type checks

export function isI18nData(obj: any): boolean {
  return obj && obj.type === 'i18n';
}
