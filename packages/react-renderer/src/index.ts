export * from './api/app';
export * from './api/component';
export { useRenderContext, defineRendererPlugin } from './app';
export * from './router';

export type { Spec, ProCodeComponent, LowCodeComponent } from '@alilc/lowcode-shared';
export type { PackageLoader, CodeScope, Plugin } from '@alilc/lowcode-renderer-core';
export type { RendererExtends } from './app/extension';
