import type { Spec, LowCodeComponent } from '../../types';
import { isPlainObject } from 'lodash-es';

export function isJSExpression(v: unknown): v is Spec.JSExpression {
  return (
    isPlainObject(v) && (v as any).type === 'JSExpression' && typeof (v as any).value === 'string'
  );
}

export function isJSFunction(v: unknown): v is Spec.JSFunction {
  return (
    isPlainObject(v) && (v as any).type === 'JSFunction' && typeof (v as any).value === 'string'
  );
}

export function isJSSlot(v: unknown): v is Spec.JSSlot {
  return isPlainObject(v) && (v as any).type === 'JSSlot' && (v as any).value;
}

export function isJSI18nNode(v: unknown): v is Spec.JSI18n {
  return isPlainObject(v) && (v as any).type === 'i18n' && typeof (v as any).key === 'string';
}

export function isComponentNode(v: unknown): v is Spec.ComponentNode {
  return isPlainObject(v) && (v as any).componentName;
}

export function isLowCodeComponentSchema(v: unknown): v is LowCodeComponent {
  return isPlainObject(v) && (v as any).type === 'lowCode' && (v as any).schema;
}
