import {
  type AnyFunction,
  type Spec,
  createDecorator,
  Provide,
  type PlainObject,
} from '@alilc/lowcode-shared';
import { isPlainObject } from 'lodash-es';
import { IPackageManagementService } from './package';
import { ICodeRuntimeService } from './code-runtime';
import { ISchemaService } from './schema';
import { ILifeCycleService, LifecyclePhase } from './lifeCycleService';

export interface IRuntimeUtilService {
  add(utilItem: Spec.Util, force?: boolean): void;
  add(name: string, target: AnyFunction | PlainObject, force?: boolean): void;

  remove(name: string): void;
}

export const IRuntimeUtilService = createDecorator<IRuntimeUtilService>('rendererUtilService');

@Provide(IRuntimeUtilService)
export class RuntimeUtilService implements IRuntimeUtilService {
  private utilsMap: Map<string, any> = new Map();

  constructor(
    @ICodeRuntimeService private codeRuntimeService: ICodeRuntimeService,
    @IPackageManagementService private packageManagementService: IPackageManagementService,
    @ISchemaService private schemaService: ISchemaService,
    @ILifeCycleService private lifeCycleService: ILifeCycleService,
  ) {
    this.lifeCycleService.when(LifecyclePhase.OptionsResolved, () => {
      this.injectScope();
    });

    this.schemaService.onChange('utils', (utils = []) => {
      for (const util of utils) {
        this.add(util);
      }
    });
  }

  add(utilItem: Spec.Util, force?: boolean): void;
  add(name: string, fn: AnyFunction | PlainObject, force?: boolean): void;
  add(util: Spec.Util | string, fn?: AnyFunction | PlainObject | boolean, force?: boolean): void {
    let name: string;
    let utilObj: AnyFunction | PlainObject | Spec.Util;

    if (typeof util === 'string') {
      if (!fn) return;

      name = util;
      utilObj = fn as AnyFunction | PlainObject;
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
    fn: AnyFunction | PlainObject | Spec.Util,
    force?: boolean,
  ): void {
    if (this.utilsMap.has(name) && !force) return;

    if (isPlainObject(fn)) {
      if ((fn as Spec.Util).type === 'function' || (fn as Spec.Util).type === 'npm') {
        const utilFn = this.parseUtil(fn as Spec.Util);
        if (utilFn) {
          this.addUtilByName(utilFn.key, utilFn.value, force);
        }
      } else if ((fn as PlainObject).destructuring) {
        for (const key of Object.keys(fn)) {
          this.addUtilByName(key, (fn as PlainObject)[key], force);
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

  private parseUtil(utilItem: Spec.Util) {
    if (utilItem.type === 'function') {
      const { content } = utilItem;
      return {
        key: utilItem.name,
        value: this.codeRuntimeService.rootRuntime.run(content.value),
      };
    } else {
      return this.packageManagementService.getLibraryByComponentMap(utilItem.content);
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
