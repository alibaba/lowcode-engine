import { type Router, type RouteLocationNormalized } from '@alilc/lowcode-renderer-router';
import { type Spec } from '@alilc/lowcode-shared';
import { createContext, useContext } from 'react';

export const RouterContext = createContext<Router>(undefined!);

RouterContext.displayName = 'RouterContext';

export const useRouter = () => useContext(RouterContext);

export const RouteLocationContext = createContext<RouteLocationNormalized>(undefined!);

RouteLocationContext.displayName = 'RouteLocationContext';

export const useRouteLocation = () => useContext(RouteLocationContext);

export const PageConfigContext = createContext<Spec.PageConfig | undefined>(undefined);

PageConfigContext.displayName = 'PageConfigContext';

export const usePageConfig = () => useContext(PageConfigContext);
