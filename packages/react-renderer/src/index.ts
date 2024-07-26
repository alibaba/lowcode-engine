export * from './api/app';
export * from './api/component';
export * from './api/context';
export { defineRendererPlugin } from './app';
export * from './router';
export { LifecyclePhase } from '@alilc/lowcode-renderer-core';

export type { Package, ProCodeComponent, LowCodeComponent } from '@alilc/lowcode-shared';
export type {
  PackageLoader,
  CodeScope,
  Plugin,
  ModelDataSourceCreator,
  ModelStateCreator,
} from '@alilc/lowcode-renderer-core';
export type { ReactRendererBoostsApi } from './app/boosts';
