export * from './api/app';
export * from './api/component';
export { defineRendererPlugin } from './app';

export type { Package, ProCodeComponent, LowCodeComponent } from '@alilc/lowcode-shared';
export type {
  PackageLoader,
  CodeScope,
  Plugin,
  ModelDataSourceCreator,
  ModelStateCreator,
} from '@alilc/lowcode-renderer-core';
export type * from './app';
