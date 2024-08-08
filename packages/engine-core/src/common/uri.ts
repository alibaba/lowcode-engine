import * as Schemas from './schemas';
import { join } from './path';

export interface UriComponents {
  scheme?: string;
  authority?: string;
  path?: string;
}

const EMPTY = '';
const SLASH = '/';
const URI_REGEXP = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;

/**
 * Uniform Resource Identifier (URI) http://tools.ietf.org/html/rfc3986.
 * This class is a simple parser which creates the basic component parts
 * (http://tools.ietf.org/html/rfc3986#section-3) with minimal validation
 * and encoding.
 *
 * ```txt
 *       foo://example.com:8042/over/there?name=ferret#nose
 *       \_/   \______________/\_________/ \_________/ \__/
 *        |           |            |            |        |
 *     scheme     authority       path        query   fragment
 *        |   _____________________|__
 *       / \ /                        \
 *       urn:example:animal:ferret:nose
 * ```
 */
export class URI implements UriComponents {
  readonly scheme: string;
  readonly authority: string;
  readonly path: string;

  constructor(scheme?: string, authority?: string, path?: string);
  constructor(data?: UriComponents);
  constructor(data?: UriComponents | string, authority?: string, path?: string) {
    if (typeof data === 'object') {
      this.scheme = data.scheme || EMPTY;
      this.authority = data.authority || EMPTY;
      this.path = data.path || EMPTY;
    } else {
      this.scheme = data || 'file';
      this.authority = authority || EMPTY;
      this.path = path || EMPTY;
    }
  }

  with(change: { scheme?: string; path?: string }): URI {
    let { scheme, path } = change;

    if (scheme === undefined) {
      scheme = this.scheme;
    } else if (scheme === null) {
      scheme = EMPTY;
    }

    if (path === undefined) {
      path = this.path;
    } else if (path === null) {
      path = EMPTY;
    }

    return new URI({ scheme, path });
  }

  toString(): string {
    let res = '';
    const { scheme, authority, path } = this;
    if (scheme) {
      res += scheme;
      res += ':';
    }
    if (authority || scheme === Schemas.file) {
      res += SLASH;
      res += SLASH;
    }
    if (authority) {
      res += authority.toLowerCase();
    }
    if (path) {
      res += path;
    }

    return res;
  }

  static isUri(thing: any): thing is URI {
    if (thing instanceof URI) return true;
    if (!thing) return false;

    return typeof thing.path === 'string' && typeof thing.authority === 'string' && typeof thing.scheme === 'string';
  }

  static joinPath(uri: URI, ...pathSegments: string[]) {
    if (!uri.path) {
      throw new URIError(`cannot call joinPath on URI without path`);
    }

    return uri.with({ path: join(uri.path, ...pathSegments) });
  }

  /**
   * Creates new URI from uri components.
   *
   * Unless `strict` is `true` the scheme is defaults to be `file`. This function performs
   * validation and should be used for untrusted uri components retrieved from storage,
   * user input, command arguments etc
   */
  static from(components: UriComponents): URI {
    return new URI(components);
  }

  /**
   * Creates a new URI from a string, e.g. `/some/path`
   *
   * @param value A string which represents an URI (see `URI#toString`).
   */
  static parse(value: string): URI {
    const match = URI_REGEXP.exec(value);
    if (!match) {
      return new URI();
    }
    return new URI(match[2] || EMPTY, match[4] || EMPTY, match[5] || EMPTY);
  }
}

class URIError extends Error {
  constructor(message: string) {
    super(`[UriError]: ${message}`);
    this.name = 'URIError';
  }
}
