import type { JSExpression, JSFunction, JSSlot, I18nNode, LowCodeComponent } from '../types';
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

export function isJSSlot(v: unknown): v is JSSlot {
  return isPlainObject(v) && (v as any).type === 'JSSlot' && (v as any).value;
}

export function isI18nNode(v: unknown): v is I18nNode {
  return isPlainObject(v) && (v as any).type === 'i18n' && typeof (v as any).key === 'string';
}

export function isLowCodeComponentSchema(v: unknown): v is LowCodeComponent {
  return isPlainObject(v) && (v as any).type === 'lowCode' && (v as any).schema;
}
