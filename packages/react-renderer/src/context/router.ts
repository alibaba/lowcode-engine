import { type Router, type RouteLocationNormalized } from '@alilc/lowcode-renderer-router';
import { type PageConfig } from '@alilc/lowcode-renderer-core';
import { createContext, useContext } from 'react';

export const RouterContext = createContext<Router>({} as any);

RouterContext.displayName = 'RouterContext';

export const useRouter = () => useContext(RouterContext);

export const RouteLocationContext = createContext<RouteLocationNormalized>({
  name: undefined,
  path: '/',
  searchParams: undefined,
  params: {},
  hash: '',
  fullPath: '/',
  redirectedFrom: undefined,
  matched: [],
  meta: {},
});

RouteLocationContext.displayName = 'RouteLocationContext';

export const useRouteLocation = () => useContext(RouteLocationContext);

export const PageConfigContext = createContext<PageConfig | undefined>(undefined);

PageConfigContext.displayName = 'PageConfigContext';

export const usePageConfig = () => useContext(PageConfigContext);
