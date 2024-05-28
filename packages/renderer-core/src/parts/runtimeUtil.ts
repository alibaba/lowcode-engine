import { type AnyFunction, type Spec, createDecorator, Provide } from '@alilc/lowcode-shared';
import { IPackageManagementService } from './package';
import { ICodeRuntimeService } from './code-runtime';

export interface IRuntimeUtilService {
  add(utilItem: Spec.Util): void;
  add(name: string, fn: AnyFunction): void;

  remove(name: string): void;

  toExpose(): Spec.UtilsApi;
}

export const IRuntimeUtilService = createDecorator<IRuntimeUtilService>('rendererUtilService');

@Provide(IRuntimeUtilService)
export class RuntimeUtilService implements IRuntimeUtilService {
  private utilsMap: Map<string, AnyFunction> = new Map();

  private _expose: any;

  constructor(
    @ICodeRuntimeService private codeRuntimeService: ICodeRuntimeService,
    @IPackageManagementService private packageManagementService: IPackageManagementService,
  ) {}

  add(utilItem: Spec.Util): void;
  add(name: string, fn: AnyFunction): void;
  add(name: Spec.Util | string, fn?: AnyFunction): void {
    if (typeof name === 'string') {
      if (typeof fn === 'function') {
        this.utilsMap.set(name, fn as AnyFunction);
      }
    } else {
      const fn = this.parseUtil(name);
      this.utilsMap.set(name.name, fn);
    }
  }

  remove(name: string): void {
    this.utilsMap.delete(name);
  }

  toExpose(): Spec.UtilsApi {
    if (!this._expose) {
      this._expose = new Proxy(Object.create(null), {
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
    }

    return this._expose;
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
