export * from './api/app';
export * from './api/component';
export { defineRendererPlugin } from './plugin';
export * from './context/render';
export * from './context/router';

export type { Spec, ProCodeComponent, LowCodeComponent } from '@alilc/lowcode-shared';
export type { PackageLoader, CodeScope, Plugin } from '@alilc/lowcode-renderer-core';
export type { RendererExtends } from './plugin';
