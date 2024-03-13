import { type AnyObject } from '@alilc/runtime-shared';
import { parse, stringify } from 'qs';
import { type LocationQuery } from '../types';

export function parseURL(location: string) {
  let path = '';
  let query: LocationQuery = {};
  let searchString = '';
  let hash = '';

  const hashPos = location.indexOf('#');
  let searchPos = location.indexOf('?');
  if (hashPos < searchPos && hashPos >= 0) {
    searchPos = -1;
  }

  if (searchPos > -1) {
    path = location.slice(0, searchPos);
    searchString = location.slice(
      searchPos + 1,
      hashPos > -1 ? hashPos : location.length
    );

    query = parse(searchString);
  }

  if (hashPos > -1) {
    path = path || location.slice(0, hashPos);
    // keep the # character
    hash = location.slice(hashPos, location.length);
  }

  path = path || location;

  return {
    fullPath: path + (searchString && '?') + searchString + hash,
    path,
    query,
    hash,
  };
}

export function stringifyURL(location: {
  path: string;
  query?: AnyObject;
  hash?: string;
}): string {
  const query: string = location.query ? stringify(location.query) : '';
  return location.path + (query && '?') + query + (location.hash || '');
}
