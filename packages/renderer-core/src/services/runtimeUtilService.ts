import { type AnyFunction, type Spec, createDecorator, Provide } from '@alilc/lowcode-shared';
import { IPackageManagementService } from './package';
import { ICodeRuntimeService } from './code-runtime';
import { ILifeCycleService, LifecyclePhase } from './lifeCycleService';
import { ISchemaService } from './schema';

export interface IRuntimeUtilService {
  add(utilItem: Spec.Util): void;
  add(name: string, fn: AnyFunction): void;

  remove(name: string): void;
}

export const IRuntimeUtilService = createDecorator<IRuntimeUtilService>('rendererUtilService');

@Provide(IRuntimeUtilService)
export class RuntimeUtilService implements IRuntimeUtilService {
  private utilsMap: Map<string, AnyFunction> = new Map();

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
  add(name: string, fn: AnyFunction): void;
  add(name: Spec.Util | string, fn?: AnyFunction): void {
    if (typeof name === 'string') {
      if (typeof fn === 'function') {
        this.utilsMap.set(name, fn as AnyFunction);
      }
    } else {
      const fn = this.parseUtil(name);
      if (fn) this.utilsMap.set(name.name, fn);
    }
  }

  remove(name: string): void {
    this.utilsMap.delete(name);
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

  private parseUtil(utilItem: Spec.Util) {
    if (utilItem.type === 'function') {
      const { content } = utilItem;

      return this.codeRuntimeService.run(content.value);
    } else {
      const {
        content: { package: packageName, destructuring, exportName, subName },
      } = utilItem;
      let library: any = this.packageManagementService.getLibraryByPackageName(packageName!);

      if (library) {
        if (destructuring) {
          const target = library[exportName!];
          library = subName ? target[subName] : target;
        }

        return library;
      }
    }
  }
}
