import { type Router, type RouteLocation } from '@alilc/runtime-router';
import { type PageSchema } from '@alilc/runtime-shared';
import { createContext, useContext } from 'react';

export const RouterContext = createContext<Router>({} as any);

RouterContext.displayName = 'RouterContext';

export const useRouter = () => useContext(RouterContext);

export const RouteLocationContext = createContext<RouteLocation>({
  name: undefined,
  path: '/',
  query: {},
  params: {},
  hash: '',
  fullPath: '/',
  redirectedFrom: undefined,
  matched: [],
  meta: {},
});

RouteLocationContext.displayName = 'RouteLocationContext';

export const useRouteLocation = () => useContext(RouteLocationContext);

export const PageSchemaContext = createContext<PageSchema | undefined>(
  undefined
);

PageSchemaContext.displayName = 'PageContext';

export const usePageSchema = () => useContext(PageSchemaContext);
