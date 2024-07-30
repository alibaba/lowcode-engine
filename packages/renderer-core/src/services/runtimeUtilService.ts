import {
  type AnyFunction,
  type UtilDescription,
  createDecorator,
  type StringDictionary,
} from '@alilc/lowcode-shared';
import { isPlainObject } from 'lodash-es';
import { IPackageManagementService } from './package';
import { ICodeRuntimeService } from './code-runtime';

export interface IRuntimeUtilService {
  add(utilItem: UtilDescription, force?: boolean): void;
  add(name: string, target: AnyFunction | StringDictionary, force?: boolean): void;

  remove(name: string): void;
}

export const IRuntimeUtilService = createDecorator<IRuntimeUtilService>('rendererUtilService');

export class RuntimeUtilService implements IRuntimeUtilService {
  private utilsMap: Map<string, any> = new Map();

  constructor(
    utils: UtilDescription[] = [],
    @ICodeRuntimeService private codeRuntimeService: ICodeRuntimeService,
    @IPackageManagementService private packageManagementService: IPackageManagementService,
  ) {
    for (const util of utils) {
      this.add(util);
    }
    this.injectScope();
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

    this.addUtilByName(name, utilObj, force);
  }

  private addUtilByName(
    name: string,
    fn: AnyFunction | StringDictionary | UtilDescription,
    force?: boolean,
  ): void {
    if (this.utilsMap.has(name) && !force) return;

    if (isPlainObject(fn)) {
      if ((fn as UtilDescription).type === 'function' || (fn as UtilDescription).type === 'npm') {
        const utilFn = this.parseUtil(fn as UtilDescription);
        if (utilFn) {
          this.addUtilByName(name, utilFn, force);
        }
      } else if ((fn as StringDictionary).destructuring) {
        for (const key of Object.keys(fn)) {
          this.addUtilByName(key, (fn as StringDictionary)[key], force);
        }
      } else {
        this.utilsMap.set(name, fn);
      }
    } else if (typeof fn === 'function') {
      this.utilsMap.set(name, fn);
    }
  }

  remove(name: string): void {
    this.utilsMap.delete(name);
  }

  private parseUtil(utilItem: UtilDescription) {
    if (utilItem.type === 'function') {
      return this.codeRuntimeService.rootRuntime.run(utilItem.content.value);
    } else {
      return this.packageManagementService.getModuleByReference(utilItem.content);
    }
  }

  private injectScope(): void {
    const exposed = new Proxy(Object.create(null), {
      get: (_, p: string) => {
        return this.utilsMap.get(p);
      },
      set() {
        return false;
      },
      has: (_, p: string) => {
        return this.utilsMap.has(p);
      },
    });

    this.codeRuntimeService.rootRuntime.getScope().set('utils', exposed);
  }
}
