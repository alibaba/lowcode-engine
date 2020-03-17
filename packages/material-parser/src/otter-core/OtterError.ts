import { _ } from './index';
import { IOtterErrorOptions } from './types';

/**
 * Fix the prototype chain of the error
 *
 * Use Object.setPrototypeOf
 * Support ES6 environments
 *
 * Fallback setting __proto__
 * Support IE11+, see https://docs.microsoft.com/en-us/scripting/javascript/reference/javascript-version-information
 */
function fixPrototype(target: Error, prototype: {}) {
  const setPrototypeOf: typeof Object.setPrototypeOf = (Object as any)
    .setPrototypeOf;
  setPrototypeOf
    ? setPrototypeOf(target, prototype)
    : ((target as any).__proto__ = prototype);
}

/**
 * Capture and fix the error stack when available
 *
 * Use Error.captureStackTrace
 * Support v8 environments
 */
function fixStackTrace(target: Error, fn: any = target.constructor) {
  const captureStackTrace: any = (Error as any).captureStackTrace;
  if (captureStackTrace) {
    captureStackTrace(target, fn);
  }
}

class OtterError extends Error {
  public name: string = '';

  public urlRoot: string = 'https://docs.aimake.io/otter/';

  private options: IOtterErrorOptions = {
    url: '/',
    version: '0.0.0',
  };

  constructor(message?: string, options?: IOtterErrorOptions) {
    super(message);

    // set error name as constructor name, make it not enumerable to keep native Error behavior
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target#new.target_in_constructors
    Object.defineProperty(this, 'name', {
      value: new.target.name,
      enumerable: false,
    });

    // fix the extended error prototype chain
    // because typescript __extends implementation can't
    // see https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    fixPrototype(this, new.target.prototype);
    // try to remove constructor from stack trace
    fixStackTrace(this);

    _.extend(this.options, options || {});
  }

  public toString() {
    const url = this.urlRoot + this.options.version + this.options.url;
    return `${this.name}: ${this.message} See: ${url}`;
  }
}

export default OtterError;
