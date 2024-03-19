import { type Router } from '@alilc/runtime-router';
import { useState, useLayoutEffect, useMemo, type ReactNode } from 'react';
import {
  RouterContext,
  RouteLocationContext,
  PageSchemaContext,
} from '../context/router';
import { useAppContext } from '../context/app';

export const createRouterProvider = (router: Router) => {
  return function RouterProvider({ children }: { children?: ReactNode }) {
    const { schema } = useAppContext();
    const [location, setCurrentLocation] = useState(router.getCurrentRoute());

    useLayoutEffect(() => {
      const remove = router.afterRouteChange(to => setCurrentLocation(to));
      return () => remove();
    }, []);

    const pageSchema = useMemo(() => {
      const pages = schema.getPages();
      const matched = location.matched[location.matched.length - 1];

      if (matched) {
        const page = pages.find(item => matched.page === item.id);
        return page;
      }

      return undefined;
    }, [location]);

    return (
      <RouterContext.Provider value={router}>
        <RouteLocationContext.Provider value={location}>
          <PageSchemaContext.Provider value={pageSchema}>
            {children}
          </PageSchemaContext.Provider>
        </RouteLocationContext.Provider>
      </RouterContext.Provider>
    );
  };
};
