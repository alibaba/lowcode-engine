import { isI18NObject } from './is-object';
import { get } from 'lodash-es';
import { IPublicEnumTransformStage, IPublicModelComponentMeta } from '@alilc/lowcode-types';
import { Logger } from '../../shared/src/helper/logger';

const logger = new Logger({ level: 'warn', bizName: 'utils' });

interface Variable {
  type: 'variable';
  variable: string;
  value: any;
}

export function isVariable(obj: any): obj is Variable {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  return obj.type === 'variable';
}

export function isUseI18NSetter(prototype: any, propName: string) {
  const configure = prototype?.options?.configure;
  if (Array.isArray(configure)) {
    return configure.some((c) => {
      return c.name === propName && c?.setter?.type?.displayName === 'I18nSetter';
    });
  }
  return false;
}

export function convertToI18NObject(v: string | any, locale: string = 'zh-CN') {
  if (isI18NObject(v)) return v;
  return { type: 'i18n', use: locale, [locale]: v };
}

export function isString(v: any): v is string {
  return typeof v === 'string';
}

function _innerWaitForThing(obj: any, path: string): Promise<any> {
  const timeGap = 200;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const thing = get(obj, path);
      if (thing) {
        return resolve(thing);
      }
      reject();
    }, timeGap);
  }).catch(() => {
    return _innerWaitForThing(obj, path);
  });
}

export function waitForThing(obj: any, path: string): Promise<any> {
  const thing = get(obj, path);
  if (thing) {
    return Promise.resolve(thing);
  }
  return _innerWaitForThing(obj, path);
}

export function arrShallowEquals(arr1: any[], arr2: any[]): boolean {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item) => arr2.includes(item));
}

/**
 * 判断当前 meta 是否从 vc prototype 转换而来
 * @param meta
 */
export function isFromVC(meta: IPublicModelComponentMeta) {
  return !!meta?.getMetadata().configure?.advanced;
}

export function executePendingFn(fn: () => void, timeout: number = 2000) {
  return setTimeout(fn, timeout);
}

const stageList = ['render', 'serilize', 'save', 'clone', 'init', 'upgrade'];

/**
 * 兼容原来的数字版本的枚举对象
 * @param stage
 * @returns
 */
export function compatStage(stage: IPublicEnumTransformStage | number): IPublicEnumTransformStage {
  if (typeof stage === 'number') {
    console.warn(
      'stage 直接指定为数字的使用方式已经过时，将在下一版本移除，请直接使用 IPublicEnumTransformStage.Render|Serilize|Save|Clone|Init|Upgrade',
    );
    return stageList[stage - 1] as IPublicEnumTransformStage;
  }
  return stage as IPublicEnumTransformStage;
}

export function invariant(check: any, message: string, thing?: any) {
  if (!check) {
    throw new Error(`Invariant failed: ${message}${thing ? ` in '${thing}'` : ''}`);
  }
}

export function deprecate(fail: any, message: string, alterative?: string) {
  if (fail) {
    logger.warn(`Deprecation: ${message}` + (alterative ? `, use ${alterative} instead.` : ''));
  }
}

export function isRegExp(obj: any): obj is RegExp {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  return 'test' in obj && 'exec' in obj && 'compile' in obj;
}

/**
 * The prop supportVariable SHOULD take precedence over default global supportVariable.
 * @param propSupportVariable prop supportVariable
 * @param globalSupportVariable global supportVariable
 * @returns
 */
export function shouldUseVariableSetter(
  propSupportVariable: boolean | undefined,
  globalSupportVariable: boolean,
) {
  if (propSupportVariable === false) return false;
  return propSupportVariable || globalSupportVariable;
}
