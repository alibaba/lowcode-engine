/**
 * todo: replace to URL API
 */

export function parseURL(location: string) {
  let path = '';
  let searchParams: URLSearchParams | undefined;
  let searchString = '';
  let hash = '';

  const hashPos = location.indexOf('#');
  let searchPos = location.indexOf('?');
  if (hashPos < searchPos && hashPos >= 0) {
    searchPos = -1;
  }

  if (searchPos > -1) {
    path = location.slice(0, searchPos);
    searchString = location.slice(searchPos + 1, hashPos > -1 ? hashPos : location.length);

    searchParams = new URLSearchParams(searchString);
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
    searchParams,
    hash,
  };
}

export function stringifyURL(location: {
  path: string;
  searchParams?: URLSearchParams;
  hash?: string;
}): string {
  const searchStr = location.searchParams ? location.searchParams.toString() : '';
  return location.path + (searchStr && '?') + searchStr + (location.hash || '');
}
