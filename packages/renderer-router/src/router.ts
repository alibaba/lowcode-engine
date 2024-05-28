import { type Spec } from '@alilc/lowcode-shared';
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  type RouterHistory,
  type HistoryState,
} from './history';
import { createRouterMatcher } from './matcher';
import { type PathParserOptions, type PathParams } from './utils/path-parser';
import { parseURL, stringifyURL } from './utils/url';
import { isSameRouteLocation } from './utils/helper';
import type {
  RouteRecord,
  RouteLocationNormalized,
  RawRouteLocation,
  RouteLocation,
  RawLocationOptions,
} from './types';
import { type NavigationHookAfter, type NavigationGuard, guardToPromiseFn } from './guard';
import { createCallback } from './utils/callback';

export interface RouterOptions extends Spec.RouterConfig, PathParserOptions {
  routes: RouteRecord[];
}

export interface Router extends Spec.RouterApi {
  readonly options: RouterOptions;
  readonly history: RouterHistory;

  getCurrentLocation(): RouteLocationNormalized;

  resolve(
    rawLocation: RawRouteLocation,
    currentLocation?: RouteLocationNormalized,
  ): RouteLocationNormalized;

  addRoute(route: RouteRecord): void;
  removeRoute(name: string): void;
  getRoutes(): RouteRecord[];
  hasRoute(name: string): boolean;

  beforeRouteLeave: (fn: NavigationGuard) => () => void;
  afterRouteChange: (fn: NavigationHookAfter) => () => void;
}

const START_LOCATION: RouteLocationNormalized = {
  path: '/',
  name: undefined,
  params: {},
  searchParams: undefined,
  hash: '',
  fullPath: '/',
  matched: [],
  meta: {},
  redirectedFrom: undefined,
};

export function createRouter(options: RouterOptions): Router {
  const { baseName = '/', historyMode = 'browser', routes = [], ...globalOptions } = options;
  const matcher = createRouterMatcher(routes, globalOptions);
  const routerHistory =
    historyMode === 'hash'
      ? createHashHistory(baseName)
      : historyMode === 'memory'
        ? createMemoryHistory(baseName)
        : createBrowserHistory(baseName);

  const beforeGuards = createCallback<NavigationGuard>();
  const afterGuards = createCallback<NavigationHookAfter>();

  let currentLocation: RouteLocationNormalized = START_LOCATION;
  let pendingLocation = currentLocation;

  function resolve(
    rawLocation: RawRouteLocation,
    currentLocation?: RouteLocationNormalized,
  ): RouteLocationNormalized & {
    href: string;
  } {
    currentLocation = Object.assign({}, currentLocation || currentLocation);

    if (typeof rawLocation === 'string') {
      const locationNormalized = parseURL(rawLocation);
      const matchedRoute = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      const href = routerHistory.createHref(locationNormalized.fullPath);

      return Object.assign(locationNormalized, matchedRoute, {
        searchParams: locationNormalized.searchParams,
        hash: decodeURIComponent(locationNormalized.hash),
        redirectedFrom: undefined,
        href,
      });
    }

    let matcherLocation: RawRouteLocation;

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
        params: rawLocation.params as PathParams,
      };
      currentLocation.params = matcherLocation.params;
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
        searchParams: rawLocation.searchParams,
      },
      matchedRoute,
      {
        redirectedFrom: undefined,
        href,
      },
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
    return matcher.getRecordMatchers().map((item) => item.record);
  }
  function hasRoute(name: string) {
    return !!matcher.getRecordMatcher(name);
  }

  function push(to: RawRouteLocation) {
    return pushOrRedirect(to);
  }
  function replace(to: RawRouteLocation) {
    return pushOrRedirect({ ...locationAsObject(to) }, true);
  }

  function locationAsObject(
    to: RawRouteLocation | RouteLocation,
  ): Exclude<RawRouteLocation, string> | RouteLocation {
    return typeof to === 'string' ? parseURL(to) : { ...to };
  }

  async function pushOrRedirect(
    to: RawRouteLocation | RouteLocation,
    replace = false,
    redirectedFrom?: RouteLocation,
  ) {
    const targetLocation = (pendingLocation = resolve(to));
    const from = currentLocation;
    const data: HistoryState | undefined = (to as RawLocationOptions).state;

    const shouldRedirect = getRedirectRecordIfShould(targetLocation);
    if (shouldRedirect) {
      return pushOrRedirect(
        {
          ...shouldRedirect,
          state: Object.assign({}, data, shouldRedirect.state),
        },
        replace,
        redirectedFrom || targetLocation,
      );
    }

    const toLocation = targetLocation as RouteLocationNormalized;
    toLocation.redirectedFrom = redirectedFrom;

    if (isSameRouteLocation(from, toLocation)) {
      throw Error('路由错误：重复请求' + JSON.stringify({ to: toLocation, from }));
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

  function getRedirectRecordIfShould(
    to: RouteLocationNormalized,
  ): Exclude<RawRouteLocation, string> | undefined {
    const lastMatched = to.matched[to.matched.length - 1];

    if (lastMatched?.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === 'function' ? redirect(to) : redirect;

      if (typeof newTargetLocation === 'string') {
        newTargetLocation =
          newTargetLocation.includes('?') || newTargetLocation.includes('#')
            ? locationAsObject(newTargetLocation)
            : { path: newTargetLocation };
        (newTargetLocation as any).params = {};
      }

      if (!('path' in newTargetLocation) && !('name' in newTargetLocation)) {
        throw new Error('Invalid redirect');
      }

      return Object.assign(
        {
          searchParams: to.searchParams,
          hash: to.hash,
          // path 存在的时候 清空 params
          params: 'path' in newTargetLocation ? {} : to.params,
        },
        newTargetLocation,
      );
    }
  }

  async function navigateTriggerBeforeGuards(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
  ): Promise<any> {
    const guards: ((...args: any[]) => Promise<any>)[] = [];

    const canceledNavigationCheck = async (): Promise<any> => {
      if (pendingLocation !== to) {
        throw Error(`路由错误：重复导航，from: ${from.fullPath}, to: ${to.fullPath}`);
      }
      return Promise.resolve();
    };

    const beforeGuardsList = beforeGuards.list();

    for (const guard of beforeGuardsList) {
      guards.push(guardToPromiseFn(guard, to, from));
    }
    if (beforeGuardsList.length > 0) guards.push(canceledNavigationCheck);

    return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
  }

  function finalizeNavigation(
    toLocation: RouteLocationNormalized,
    from: RouteLocationNormalized,
    isPush: boolean,
    replace?: boolean,
    data?: HistoryState,
  ) {
    // 重复导航
    if (pendingLocation !== toLocation) {
      throw Error(`路由错误：重复导航，from: ${from.fullPath}, to: ${toLocation.fullPath}`);
    }

    // 如果不是第一次启动的话 只需要考虑 push
    const isFirstNavigation = from === START_LOCATION;

    if (isPush) {
      if (replace || isFirstNavigation) {
        routerHistory.replace(toLocation.fullPath, data);
      } else {
        routerHistory.push(toLocation.fullPath, data);
      }
    }

    currentLocation = toLocation;
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
        return pushOrRedirect(shouldRedirect, true, toLocation).catch(() => {});
      }

      pendingLocation = toLocation;
      const from = currentLocation;

      // 触发路由守卫
      navigateTriggerBeforeGuards(toLocation, from)
        .catch((error) => {
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
        .catch(() => {});
    });
  }

  // init
  setupListeners();
  if (currentLocation === START_LOCATION) {
    push(routerHistory.location).catch((err) => {
      console.warn('Unexpected error when starting the router:', err);
    });
  }

  const go = (delta: number) => routerHistory.go(delta);

  return {
    get options() {
      return options;
    },
    get history() {
      return routerHistory;
    },
    getCurrentLocation: () => currentLocation,

    resolve,
    addRoute,
    removeRoute,
    getRoutes,
    hasRoute,

    push,
    replace,
    back: () => go(-1),
    forward: () => go(1),
    go,

    beforeRouteLeave: beforeGuards.add,
    afterRouteChange: afterGuards.add,
  };
}
