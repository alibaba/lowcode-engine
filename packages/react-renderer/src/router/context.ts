import { type Router, type RouteLocationNormalized } from '@alilc/lowcode-renderer-router';
import { createContext, useContext } from 'react';

export const RouterContext = createContext<Router>(undefined!);

RouterContext.displayName = 'RouterContext';

export const useRouter = () => useContext(RouterContext);

export const RouteLocationContext = createContext<RouteLocationNormalized>(undefined!);

RouteLocationContext.displayName = 'RouteLocationContext';

export const useRouteLocation = () => useContext(RouteLocationContext);
