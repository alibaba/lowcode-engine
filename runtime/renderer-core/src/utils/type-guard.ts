import type { JSExpression, JSFunction, I18nNode } from '../types';
import { isPlainObject } from 'lodash-es';

export function isJSExpression(v: unknown): v is JSExpression {
  return (
    isPlainObject(v) && (v as any).type === 'JSExpression' && typeof (v as any).value === 'string'
  );
}

export function isJSFunction(v: unknown): v is JSFunction {
  return (
    isPlainObject(v) && (v as any).type === 'JSFunction' && typeof (v as any).value === 'string'
  );
}

export function isI18nNode(v: unknown): v is I18nNode {
  return isPlainObject(v) && (v as any).type === 'i18n' && typeof (v as any).key === 'string';
}
