
// type checks

import { IPublicTypeI18nData } from "@alilc/lowcode-types";

export function isI18nData(obj: any): obj is IPublicTypeI18nData {
  return obj && obj.type === 'i18n';
}
