import type {
  JSExpression,
  JSFunction,
  JSSlot,
  JSI18n,
  ComponentNode,
  LowCodeComponent,
  ProCodeComponent,
} from '../../types';
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

export function isJSI18nNode(v: unknown): v is JSI18n {
  return isPlainObject(v) && (v as any).type === 'i18n' && typeof (v as any).key === 'string';
}

export function isComponentNode(v: unknown): v is ComponentNode {
  return isPlainObject(v) && (v as any).componentName;
}

export function isLowCodeComponentPackage(v: unknown): v is LowCodeComponent {
  return isPlainObject(v) && (v as any).type === 'lowCode' && (v as any).schema;
}

export function isProCodeComponentPackage(v: unknown): v is ProCodeComponent {
  return isPlainObject(v) && (v as any).package && (v as any).library;
}
