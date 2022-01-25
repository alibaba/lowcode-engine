/**
 * Parse queryString
 * @param  {String} str '?q=query&b=test'
 * @return {Object}
 */
export function parseQuery(str: string): object {
  const ret: any = {};

  if (typeof str !== 'string') {
    return ret;
  }

  const s = str.trim().replace(/^(\?|#|&)/, '');

  if (!s) {
    return ret;
  }

  s.split('&').forEach((param) => {
    const parts = param.replace(/\+/g, ' ').split('=');
    let key = parts.shift()!;
    let val: any = parts.length > 0 ? parts.join('=') : undefined;

    key = decodeURIComponent(key);

    val = val === undefined ? null : decodeURIComponent(val);

    if (ret[key] === undefined) {
      ret[key] = val;
    } else if (Array.isArray(ret[key])) {
      ret[key].push(val);
    } else {
      ret[key] = [ret[key], val];
    }
  });

  return ret;
}

/**
 * Stringify object to query parammeters
 * @param  {Object} obj
 * @return {String}
 */
export function stringifyQuery(obj: any): string {
  const param: string[] = [];
  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    if (value && typeof value === 'object') {
      value = JSON.stringify(value);
    }
    param.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  });
  return param.join('&');
}

export function uriEncode(uri: string) {
  return encodeURIComponent(uri);
}

export function uriDecode(uri: string) {
  return decodeURIComponent(uri);
}

export function withQueryParams(url: string, params?: object) {
  const queryStr = params ? stringifyQuery(params) : '';
  if (queryStr === '') {
    return url;
  }
  const urlSplit = url.split('#');
  const hash = urlSplit[1] ? `#${urlSplit[1]}` : '';
  const urlWithoutHash = urlSplit[0];
  return `${urlWithoutHash}${~urlWithoutHash.indexOf('?') ? '&' : '?'}${queryStr}${hash}`;
}
