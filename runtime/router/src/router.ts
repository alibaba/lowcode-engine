import {
  type RouterSchema,
  useCallbacks,
  type RouteLocation,
  type RouteLocationRaw,
  type RouteLocationOptions,
  noop,
} from '@alilc/runtime-shared';
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  type RouterHistory,
  type HistoryState,
} from './history';
import { createRouterMatcher, type MatcherLocationRaw } from './matcher';
import { type PathParserOptions } from './utils/path-parser';
import { parseURL, stringifyURL } from './utils/url';
import { normalizeQuery } from './utils/query';
import { isSameRouteLocation } from './utils/helper';
import type { RouteParams, RouteRecord } from './types';
import {
  type NavigationHookAfter,
  type NavigationGuard,
  guardToPromiseFn,
} from './guard';

export interface Router {
  readonly options: RouterOptions;
  readonly history: RouterHistory;

  getCurrentRoute: () => RouteLocation;

  addRoute: {
    (parentName: string, route: RouteRecord): void;
    (route: RouteRecord): void;
  };
  removeRoute(name: string): void;
  hasRoute(name: string): boolean;
  getRoutes(): RouteRecord[];

  push: (to: RouteLocationRaw) => void;
  replace: (to: RouteLocationRaw) => void;

  beforeRouteLeave: (fn: NavigationGuard) => () => void;
  afterRouteChange: (fn: NavigationHookAfter) => () => void;
}

export type RouterOptions = RouterSchema & PathParserOptions;

const START_LOCATION_NORMALIZED: RouteLocation = {
  path: '/',
  name: undefined,
  params: {},
  query: {},
  hash: '',
  fullPath: '/',
  matched: [],
  meta: {},
  redirectedFrom: undefined,
};

export function createRouter(options: RouterOptions): Router {
  const {
    baseName = '/',
    historyMode = 'browser',
    routes = [],
    ...globalOptions
  } = options;
  const matcher = createRouterMatcher(routes, globalOptions);
  const routerHistory =
    historyMode === 'hash'
      ? createHashHistory(baseName)
      : historyMode === 'memory'
      ? createMemoryHistory(baseName)
      : createBrowserHistory(baseName);

  const beforeGuards = useCallbacks<NavigationGuard>();
  const afterGuards = useCallbacks<NavigationHookAfter>();

  let currentRoute: RouteLocation = START_LOCATION_NORMALIZED;
  let pendingLocation = currentRoute;

  function resolve(
    rawLocation: RouteLocationRaw,
    currentLocation?: RouteLocation
  ): RouteLocation & {
    href: string;
  } {
    currentLocation = Object.assign({}, currentLocation || currentRoute);

    if (typeof rawLocation === 'string') {
      const locationNormalized = parseURL(rawLocation);

      const matchedRoute = matcher.resolve(
        { path: locationNormalized.path },
        currentLocation
      );

      const href = routerHistory.createHref(locationNormalized.fullPath);

      return Object.assign(locationNormalized, matchedRoute, {
        query: locationNormalized.query as any,
        hash: decodeURIComponent(locationNormalized.hash),
        redirectedFrom: undefined,
        href,
      });
    }

    let matcherLocation: MatcherLocationRaw;

    if ('path' in rawLocation) {
      matcherLocation = { ...rawLocation };
    } else {
      // 删除无效参数
      const targetParams = { ...rawLocation.params };
      for (const key in targetParams) {
        if (targetParams[key] == null) {
          delete targetParams[key];
        }
      }

      matcherLocation = {
        ...rawLocation,
        params: rawLocation.params as RouteParams,
      };
      currentLocation.params = currentLocation.params;
    }

    const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash = rawLocation.hash || '';
    const fullPath = stringifyURL({
      ...rawLocation,
      hash,
      path: matchedRoute.path,
    });
    const href = routerHistory.createHref(fullPath);

    return Object.assign(
      {
        fullPath,
        hash,
        query: normalizeQuery(rawLocation.query) as any,
      },
      matchedRoute,
      {
        redirectedFrom: undefined,
        href,
      }
    );
  }

  function addRoute(parentOrRoute: string | RouteRecord, route?: RouteRecord) {
    let parent: Parameters<(typeof matcher)['addRoute']>[1] | undefined;
    let record: RouteRecord;
    if (typeof parentOrRoute === 'string') {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route!;
    } else {
      record = parentOrRoute;
    }

    matcher.addRoute(record, parent);
  }
  function removeRoute(name: string) {
    const recordMatcher = matcher.getRecordMatcher(name);
    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map(item => item.record);
  }
  function hasRoute(name: string) {
    return !!matcher.getRecordMatcher(name);
  }

  function push(to: RouteLocationRaw) {
    return pushOrRedirect(to);
  }
  function replace(to: RouteLocationRaw) {
    return pushOrRedirect({ ...locationAsObject(to), replace: true });
  }

  function locationAsObject(
    to: RouteLocationRaw | RouteLocation
  ): Exclude<RouteLocationRaw, string> | RouteLocation {
    return typeof to === 'string' ? parseURL(to) : { ...to };
  }

  async function pushOrRedirect(
    to: RouteLocationRaw | RouteLocation,
    redirectedFrom?: RouteLocation
  ) {
    const targetLocation = (pendingLocation = resolve(to));
    const from = currentRoute;
    const data: HistoryState | undefined = (to as RouteLocationOptions).state;
    const force: boolean | undefined = (to as RouteLocationOptions).force;
    const replace = (to as RouteLocationOptions).replace === true;

    const shouldRedirect = getRedirectRecordIfShould(targetLocation);
    if (shouldRedirect) {
      return pushOrRedirect(
        {
          ...shouldRedirect,
          state: Object.assign({}, data, shouldRedirect.state),
          force,
          replace,
        },
        redirectedFrom || targetLocation
      );
    }

    const toLocation = targetLocation as RouteLocation;
    toLocation.redirectedFrom = redirectedFrom;

    if (!force && isSameRouteLocation(from, toLocation)) {
      throw Error(
        '路由错误：重复请求' + JSON.stringify({ to: toLocation, from })
      );
    }

    return navigateTriggerBeforeGuards(toLocation, from)
      .catch(() => {})
      .then(() => {
        finalizeNavigation(toLocation, from, true, replace, data);

        for (const guard of afterGuards.list()) {
          guard(toLocation, from);
        }
      });
  }

  function getRedirectRecordIfShould(to: RouteLocation) {
    const lastMatched = to.matched[to.matched.length - 1];

    if (lastMatched?.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation =
        typeof redirect === 'function' ? redirect(to) : redirect;

      if (typeof newTargetLocation === 'string') {
        newTargetLocation =
          newTargetLocation.includes('?') || newTargetLocation.includes('#')
            ? locationAsObject(newTargetLocation)
            : { path: newTargetLocation };
        // @ts-expect-error 强制清空参数
        newTargetLocation.params = {};
      }

      if (!('path' in newTargetLocation) && !('name' in newTargetLocation)) {
        throw new Error('Invalid redirect');
      }

      return Object.assign(
        {
          query: to.query,
          hash: to.hash,
          // path 存在的时候 清空 params
          params: 'path' in newTargetLocation ? {} : to.params,
        },
        newTargetLocation
      );
    }
  }

  async function navigateTriggerBeforeGuards(
    to: RouteLocation,
    from: RouteLocation
  ): Promise<any> {
    let guards: ((...args: any[]) => Promise<any>)[] = [];

    const canceledNavigationCheck = async (): Promise<any> => {
      if (pendingLocation !== to) {
        throw Error(
          `路由错误：重复导航，from: ${from.fullPath}, to: ${to.fullPath}`
        );
      }
      return Promise.resolve();
    };

    try {
      guards = [];
      const beforeGuardsList = beforeGuards.list();

      for (const guard of beforeGuardsList) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      if (beforeGuardsList.length > 0) guards.push(canceledNavigationCheck);

      return guards.reduce(
        (promise, guard) => promise.then(() => guard()),
        Promise.resolve()
      );
    } catch (err) {
      throw err;
    }
  }

  function finalizeNavigation(
    toLocation: RouteLocation,
    from: RouteLocation,
    isPush: boolean,
    replace?: boolean,
    data?: HistoryState
  ) {
    // 重复导航
    if (pendingLocation !== toLocation) {
      throw Error(
        `路由错误：重复导航，from: ${from.fullPath}, to: ${toLocation.fullPath}`
      );
    }

    // 如果不是第一次启动的话 只需要考虑 push
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;

    if (isPush) {
      if (replace || isFirstNavigation) {
        routerHistory.replace(toLocation.fullPath, data);
      } else {
        routerHistory.push(toLocation.fullPath, data);
      }
    }

    currentRoute = toLocation;
    // markAsReady();
  }

  let removeHistoryListener: undefined | null | (() => void);
  function setupListeners() {
    if (removeHistoryListener) return;
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      const toLocation = resolve(to);

      // 判断是否需要重定向
      const shouldRedirect = getRedirectRecordIfShould(toLocation);
      if (shouldRedirect) {
        return pushOrRedirect(
          Object.assign(shouldRedirect, { replace: true }),
          toLocation
        ).catch(() => {});
      }

      pendingLocation = toLocation;
      const from = currentRoute;

      // 触发路由守卫
      navigateTriggerBeforeGuards(toLocation, from)
        .catch(error => {
          if (info.delta) {
            routerHistory.go(-info.delta, false);
          }
          return error;
        })
        .then((failure: any) => {
          failure = failure || finalizeNavigation(toLocation, from, false);

          if (failure) {
            if (info.delta) {
              // 还原之前的导航
              routerHistory.go(-info.delta, false);
            }
          }

          for (const guard of afterGuards.list()) {
            guard(toLocation, from);
          }
        })
        .catch(noop);
    });
  }

  // init
  setupListeners();
  if (currentRoute === START_LOCATION_NORMALIZED) {
    push(routerHistory.location).catch(err => {
      console.warn('Unexpected error when starting the router:', err);
    });
  }

  return {
    options,
    get history() {
      return routerHistory;
    },

    getCurrentRoute: () => currentRoute,
    addRoute,
    removeRoute,
    getRoutes,
    hasRoute,

    push,
    replace,

    beforeRouteLeave: beforeGuards.add,
    afterRouteChange: afterGuards.add,
  };
}
