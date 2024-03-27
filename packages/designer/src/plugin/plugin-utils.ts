import { isPlainObject } from 'lodash-es';
import {
  IPublicTypePluginRegisterOptions,
  IPublicTypePluginDeclaration,
} from '@alilc/lowcode-types';

export function isValidPreferenceKey(
  key: string,
  preferenceDeclaration: IPublicTypePluginDeclaration,
): boolean {
  if (!preferenceDeclaration || !Array.isArray(preferenceDeclaration.properties)) {
    return false;
  }
  return preferenceDeclaration.properties.some((prop) => {
    return prop.key === key;
  });
}

export function isLowCodeRegisterOptions(opts: any): opts is IPublicTypePluginRegisterOptions {
  return opts && ('autoInit' in opts || 'override' in opts);
}

export function filterValidOptions(opts: any, preferenceDeclaration: IPublicTypePluginDeclaration) {
  if (!opts || !isPlainObject(opts)) return opts;
  const filteredOpts = {} as any;
  Object.keys(opts).forEach((key) => {
    if (isValidPreferenceKey(key, preferenceDeclaration)) {
      const v = opts[key];
      if (v !== undefined && v !== null) {
        filteredOpts[key] = v;
      }
    }
  });
  return filteredOpts;
}
