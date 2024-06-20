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
import { ILifeCycleService, LifecyclePhase } from './lifeCycleService';
import { ISchemaService } from './schema';

export interface IRuntimeUtilService {
  add(utilItem: Spec.Util): void;
  add(name: string, target: AnyFunction | PlainObject): void;

  remove(name: string): void;
}

export const IRuntimeUtilService = createDecorator<IRuntimeUtilService>('rendererUtilService');

@Provide(IRuntimeUtilService)
export class RuntimeUtilService implements IRuntimeUtilService {
  private utilsMap: Map<string, any> = new Map();

  constructor(
    @ICodeRuntimeService private codeRuntimeService: ICodeRuntimeService,
    @IPackageManagementService private packageManagementService: IPackageManagementService,
    @ILifeCycleService private lifeCycleService: ILifeCycleService,
    @ISchemaService private schemaService: ISchemaService,
  ) {
    this.lifeCycleService.when(LifecyclePhase.AfterInitPackageLoad).then(() => {
      const utils = this.schemaService.get('utils') ?? [];
      for (const util of utils) {
        this.add(util);
      }
      this.toExpose();
    });
  }

  add(utilItem: Spec.Util): void;
  add(name: string, fn: AnyFunction | PlainObject): void;
  add(name: Spec.Util | string, fn?: AnyFunction | PlainObject): void {
    if (typeof name === 'string') {
      if (fn) {
        if (isPlainObject(fn)) {
          if ((fn as PlainObject).destructuring) {
            for (const key of Object.keys(fn)) {
              this.add(key, (fn as PlainObject)[key]);
            }
          } else {
            this.utilsMap.set(name, fn);
          }
        } else if (typeof fn === 'function') {
          this.utilsMap.set(name, fn);
        }
      }
    } else {
      const util = this.parseUtil(name);
      if (util) this.add(name.name, util);
    }
  }

  remove(name: string): void {
    this.utilsMap.delete(name);
  }

  private parseUtil(utilItem: Spec.Util) {
    if (utilItem.type === 'function') {
      const { content } = utilItem;
      return this.codeRuntimeService.run(content.value);
    } else {
      return this.packageManagementService.getLibraryByComponentMap(utilItem.content);
    }
  }

  private toExpose(): void {
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

    this.codeRuntimeService.getScope().set('utils', exposed);
  }
}
