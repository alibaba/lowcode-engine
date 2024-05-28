import { type Router } from '@alilc/lowcode-renderer-router';
import { useState, useLayoutEffect, useMemo, type ReactNode } from 'react';
import { RouterContext, RouteLocationContext, PageConfigContext } from '../context/router';
import { useRenderContext } from '../context/render';

export const createRouterProvider = (router: Router) => {
  return function RouterProvider({ children }: { children?: ReactNode }) {
    const { schema } = useRenderContext();
    const [location, setCurrentLocation] = useState(router.getCurrentLocation());

    useLayoutEffect(() => {
      const remove = router.afterRouteChange((to) => setCurrentLocation(to));
      return () => remove();
    }, []);

    const pageSchema = useMemo(() => {
      const pages = schema.get('pages') ?? [];
      const matched = location.matched[location.matched.length - 1];

      if (matched) {
        const page = pages.find((item) => matched.page === item.id);
        return page;
      }

      return undefined;
    }, [location]);

    return (
      <RouterContext.Provider value={router}>
        <RouteLocationContext.Provider value={location}>
          <PageConfigContext.Provider value={pageSchema}>{children}</PageConfigContext.Provider>
        </RouteLocationContext.Provider>
      </RouterContext.Provider>
    );
  };
};
