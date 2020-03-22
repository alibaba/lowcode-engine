export interface I18nData {
  type: 'i18n';
  [key: string]: string;
}

// type checks
export function isI18nData(obj: any): obj is I18nData {
  return obj && obj.type === 'i18n';
}

export interface I18nMap {
  [lang: string]: { [key: string]: string };
}
