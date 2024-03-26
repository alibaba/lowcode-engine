import {
  type PathParser,
  createPathParser,
  type PathParserOptions,
} from './path-parser';
import type { RouteRecord } from '../types';

export interface RouteRecordMatcher extends PathParser {
  record: RouteRecord;
  parent: RouteRecordMatcher | undefined;
  children: RouteRecordMatcher[];
}

export function createRouteRecordMatcher(
  record: RouteRecord,
  parent: RouteRecordMatcher | undefined,
  options: PathParserOptions = {}
): RouteRecordMatcher {
  const parser = createPathParser(record.path, options);

  const matcher = Object.assign(parser, {
    record,
    parent,
    children: [],
  });

  if (parent) {
    parent.children.push(matcher);
  }

  return matcher;
}
