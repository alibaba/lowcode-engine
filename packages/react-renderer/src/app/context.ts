import { type Router, type RouteLocationNormalized } from '@alilc/lowcode-renderer-router';
import { createContext, useContext } from 'react';
import { type App } from './app';

export const AppContext = createContext<App>(undefined!);

AppContext.displayName = 'AppContext';

export const useAppContext = () => useContext(AppContext);

export const RouterContext = createContext<Router>(undefined!);

RouterContext.displayName = 'RouterContext';

export const useRouter = () => useContext(RouterContext);

export const RouteLocationContext = createContext<RouteLocationNormalized>(undefined!);

RouteLocationContext.displayName = 'RouteLocationContext';

export const useRouteLocation = () => useContext(RouteLocationContext);
