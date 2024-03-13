export { createRouter } from './router';
export {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
} from './history';

export type { RouterHistory } from './history';
export type { NavigationGuard, NavigationHookAfter } from './guard';
export type { Router, RouterOptions } from './router';
export type { RouteParams, LocationQuery, RouteRecord } from './types';
export type {
  RouteLocation,
  RouteLocationRaw,
  RouteLocationOptions,
} from '@alilc/runtime-shared';
