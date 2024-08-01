import { type Router } from '@alilc/lowcode-renderer-router';
import { useState, useEffect, type ReactNode } from 'react';
import { RouterContext, RouteLocationContext } from '../context';

export function RouterView({ router, children }: { router: Router; children?: ReactNode }) {
  const [location, setCurrentLocation] = useState(router.getCurrentLocation());

  useEffect(() => {
    const remove = router.afterRouteChange((to) => setCurrentLocation(to));
    return () => remove();
  }, []);

  return (
    <RouterContext.Provider value={router}>
      <RouteLocationContext.Provider value={location}>{children}</RouteLocationContext.Provider>
    </RouterContext.Provider>
  );
}
