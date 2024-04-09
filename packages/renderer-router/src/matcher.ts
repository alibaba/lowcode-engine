import { type PlainObject, type RawLocation } from '@alilc/lowcode-renderer-core';
import { pick } from 'lodash-es';
import { createRouteRecordMatcher, type RouteRecordMatcher } from './utils/record-matcher';
import { type PathParserOptions } from './utils/path-parser';

import type { RouteRecord, RouteParams, RouteLocationNormalized } from './types';

export interface RouteRecordNormalized {
  /**
   * {@link RouteRecord.name}
   */
  name: RouteRecord['name'];
  path: RouteRecord['path'];
  page: string;
  meta: PlainObject;
  /**
   * {@link RouteRecord.redirect}
   */
  redirect: RouteRecord['redirect'];
  children: RouteRecord[];
}

/**
 * 作为 matcher 解析 location  的关键参数及输出内容
 */
export type MatcherLocation = Pick<
  RouteLocationNormalized,
  'name' | 'path' | 'params' | 'matched' | 'meta'
>;

/**
 * 路由匹配器
 */
export interface RouterMatcher {
  /**
   * 新增路由记录
   */
  addRoute: (record: RouteRecord, parent?: RouteRecordMatcher) => void;
  /**
   * 删除路由记录
   */
  removeRoute: {
    (matcher: RouteRecordMatcher): void;
    (name: string): void;
  };
  /**
   * 获取所有的路由匹配对象
   */
  getRecordMatchers: () => RouteRecordMatcher[];
  /**
   * 获取路由匹配对象
   */
  getRecordMatcher: (name: string) => RouteRecordMatcher | undefined;
  /**
   * Resolves a location.
   * 允许访问与实际路径对应的路由记录并加入相应的 params
   *
   * @param location - MatcherLocationRaw to resolve to a url
   * @param currentLocation - MatcherLocation of the current location
   */
  resolve: (location: RawLocation, currentLocation: MatcherLocation) => MatcherLocation;
}

export function createRouterMatcher(
  records: RouteRecord[],
  globalOptions: PathParserOptions,
): RouterMatcher {
  const matchers: RouteRecordMatcher[] = [];
  const matcherMap = new Map<string, RouteRecordMatcher>();

  function addRoute(record: RouteRecord, parent?: RouteRecordMatcher) {
    const normalizedRecord = normalizeRouteRecord(record);
    const options: PathParserOptions = Object.assign(
      {},
      globalOptions,
      pick(record, ['end', 'sensitive', 'strict']),
    );

    // 如果子路由不是绝对路径，则构建嵌套路由的路径。
    // 仅在子路径不为空且父路径没有尾部斜杠时添加 / 分隔符。
    const { path } = normalizedRecord;
    if (parent && path[0] !== '/') {
      const parentPath = parent.record.path;
      const connectingSlash = parentPath[parentPath.length - 1] === '/' ? '' : '/';

      normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
    }

    const matcher = createRouteRecordMatcher(normalizedRecord, parent, options);

    if (normalizedRecord.children) {
      const children = normalizedRecord.children;
      for (let i = 0; i < children.length; i++) {
        addRoute(children[i], matcher);
      }
    }

    if (matcher.record.path) {
      matchers.push(matcher);

      if (matcher.record.name) {
        matcherMap.set(matcher.record.name, matcher);
      }
    }
  }

  function removeRoute(matcherRef: string | RouteRecordMatcher) {
    if (typeof matcherRef === 'string') {
      const matcher = matcherMap.get(matcherRef);
      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
      }
    } else {
      const index = matchers.indexOf(matcherRef);
      if (index > -1) {
        matchers.splice(index, 1);
        if (matcherRef.record.name) matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
      }
    }
  }

  function getRecordMatcher(name: string) {
    return matcherMap.get(name);
  }

  function resolve(location: RawLocation, currentLocation: MatcherLocation): MatcherLocation {
    let matcher: RouteRecordMatcher | undefined;
    let params: RouteParams = {};
    let path: MatcherLocation['path'];
    let name: MatcherLocation['name'];

    if ('name' in location && location.name) {
      matcher = matcherMap.get(location.name);

      if (!matcher) {
        throw new Error(`Router error: no match for ${JSON.stringify(location)}`);
      }

      name = matcher.record.name;
      // 从当前路径与传入的参数中获取 params
      params = Object.assign(
        paramsFromLocation(
          currentLocation.params ?? {},
          matcher.keys
            .filter((k) => {
              return !(k.modifier === '?' || k.modifier === '*');
            })
            .map((k) => k.name),
        ),
        location.params
          ? paramsFromLocation(
              location.params,
              matcher.keys.map((k) => k.name),
            )
          : {},
      );
      // throws if cannot be stringified
      path = matcher.stringify(params);
    } else if ('path' in location) {
      path = location.path;
      matcher = matchers.find((m) => m.re.test(path));

      if (matcher) {
        name = matcher.record.name;
        params = Object.assign(params, matcher.parse(path));
      }
    } else {
      matcher = currentLocation.name
        ? matcherMap.get(currentLocation.name)
        : matchers.find((m) => m.re.test(currentLocation.path));

      if (!matcher) {
        throw new Error(
          `no match for ${JSON.stringify(location)}, ${JSON.stringify(currentLocation)}`,
        );
      }

      name = matcher.record.name;
      params = Object.assign({}, currentLocation.params, location.params);
      path = matcher.stringify(params);
    }

    const matched: RouteRecord[] = [];
    let parentMatcher: RouteRecordMatcher | undefined = matcher;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher?.parent;
    }

    return {
      name,
      path,
      params,
      meta: matcher?.record.meta ?? {},
      matched,
    };
  }

  records.forEach((r) => addRoute(r));

  return {
    resolve,

    addRoute,
    removeRoute,

    getRecordMatchers() {
      return matchers;
    },
    getRecordMatcher,
  };
}

function paramsFromLocation(params: RouteParams, keys: (string | number)[]): RouteParams {
  const newParams = {} as RouteParams;
  for (const key of keys) {
    if (key in params) newParams[key] = params[key];
  }

  return newParams;
}

export function normalizeRouteRecord(record: RouteRecord): RouteRecordNormalized {
  return {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    page: record.page || '',
    meta: record['meta'] || {},
    children: record.children || [],
  };
}
