import {
  type AnyFunction,
  type UtilDescription,
  createDecorator,
  type StringDictionary,
} from '@alilc/lowcode-shared';
import { isPlainObject } from 'lodash-es';
import { IPackageManagementService } from '../package';
import { ICodeRuntimeService } from '../code-runtime';

export interface IRuntimeUtilService {
  add(utilItem: UtilDescription, force?: boolean): void;
  add(name: string, target: AnyFunction | StringDictionary, force?: boolean): void;

  remove(name: string): void;
}

export const IRuntimeUtilService = createDecorator<IRuntimeUtilService>('rendererUtilService');

export class RuntimeUtilService implements IRuntimeUtilService {
  private _utilsMap: Map<string, any> = new Map();

  constructor(
    utils: UtilDescription[] = [],
    @ICodeRuntimeService private codeRuntimeService: ICodeRuntimeService,
    @IPackageManagementService private packageManagementService: IPackageManagementService,
  ) {
    for (const util of utils) {
      this.add(util);
    }
    this._injectScope();
  }

  add(utilItem: UtilDescription, force?: boolean): void;
  add(name: string, fn: AnyFunction | StringDictionary, force?: boolean): void;
  add(
    util: UtilDescription | string,
    fn?: AnyFunction | StringDictionary | boolean,
    force?: boolean,
  ): void {
    let name: string;
    let utilObj: AnyFunction | StringDictionary | UtilDescription;

    if (typeof util === 'string') {
      if (!fn) return;

      name = util;
      utilObj = fn as AnyFunction | StringDictionary;
    } else {
      if (!util) return;

      name = util.name;
      utilObj = util;
      force = fn as boolean;
    }

    this._addUtilByName(name, utilObj, force);
  }

  private _addUtilByName(
    name: string,
    fn: AnyFunction | StringDictionary | UtilDescription,
    force?: boolean,
  ): void {
    if (this._utilsMap.has(name) && !force) return;

    if (isPlainObject(fn)) {
      if ((fn as UtilDescription).type === 'function' || (fn as UtilDescription).type === 'npm') {
        const utilFn = this._parseUtil(fn as UtilDescription);
        if (utilFn) {
          this._addUtilByName(name, utilFn, force);
        }
      } else if ((fn as StringDictionary).destructuring) {
        for (const key of Object.keys(fn)) {
          this._addUtilByName(key, (fn as StringDictionary)[key], force);
        }
      } else {
        this._utilsMap.set(name, fn);
      }
    } else if (typeof fn === 'function') {
      this._utilsMap.set(name, fn);
    }
  }

  remove(name: string): void {
    this._utilsMap.delete(name);
  }

  private _parseUtil(utilItem: UtilDescription) {
    if (utilItem.type === 'function') {
      return this.codeRuntimeService.rootRuntime.run(utilItem.content.value);
    } else {
      return this.packageManagementService.getModuleByReference(utilItem.content);
    }
  }

  private _injectScope(): void {
    const exposed = new Proxy(Object.create(null), {
      get: (_, p: string) => {
        return this._utilsMap.get(p);
      },
      set() {
        return false;
      },
      has: (_, p: string) => {
        return this._utilsMap.has(p);
      },
    });

    this.codeRuntimeService.rootRuntime.getScope().set('utils', exposed);
  }
}
