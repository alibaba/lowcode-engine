import { LowCodeComponent, ProCodeComponent } from '../../types';
import { isPlainObject } from 'lodash-es';

export function isLowCodeComponentPackage(v: unknown): v is LowCodeComponent {
  return isPlainObject(v) && (v as any).type === 'lowCode' && (v as any).schema;
}

export function isProCodeComponentPackage(v: unknown): v is ProCodeComponent {
  return isPlainObject(v) && (v as any).package && (v as any).library;
}
