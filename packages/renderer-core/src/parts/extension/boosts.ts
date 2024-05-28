import { createDecorator, Provide, type PlainObject } from '@alilc/lowcode-shared';
import { isObject } from 'lodash-es';
import { ICodeRuntimeService } from '../code-runtime';
import { IRuntimeUtilService } from '../runtimeUtil';
import { IRuntimeIntlService } from '../runtimeIntl';

export type IBoosts<Extends> = IBoostsApi & Extends;

export interface IBoostsApi {
  readonly codeRuntime: ICodeRuntimeService;

  readonly intl: Pick<IRuntimeIntlService, 't' | 'setLocale' | 'getLocale' | 'addTranslations'>;

  readonly util: Pick<IRuntimeUtilService, 'add' | 'remove'>;
}

/**
 * 提供了与运行时交互的接口
 */
export interface IBoostsService {
  extend(name: string, value: any, force?: boolean): void;
  extend(value: PlainObject, force?: boolean): void;

  toExpose<Extends>(): IBoosts<Extends>;
}

export const IBoostsService = createDecorator<IBoostsService>('boostsService');

@Provide(IBoostsService)
export class BoostsService implements IBoostsService {
  private builtInApis: IBoostsApi;

  private extendsValue: PlainObject = {};

  private _expose: any;

  constructor(
    @ICodeRuntimeService private codeRuntimeService: ICodeRuntimeService,
    @IRuntimeIntlService private runtimeIntlService: IRuntimeIntlService,
    @IRuntimeUtilService private runtimeUtilService: IRuntimeUtilService,
  ) {
    this.builtInApis = {
      codeRuntime: this.codeRuntimeService,
      intl: this.runtimeIntlService,
      util: this.runtimeUtilService,
    };
  }

  extend(name: string, value: any, force?: boolean | undefined): void;
  extend(value: PlainObject, force?: boolean | undefined): void;
  extend(name: string | PlainObject, value?: any, force?: boolean | undefined): void {
    if (typeof name === 'string') {
      if (force) {
        this.extendsValue[name] = value;
      } else {
        if (!this.extendsValue[name]) {
          this.extendsValue[name] = value;
        }
      }
    } else if (isObject(name)) {
      Object.keys(name).forEach((key) => {
        this.extend(key, name[key], value);
      });
    }
  }

  toExpose<Extends>(): IBoosts<Extends> {
    if (!this._expose) {
      this._expose = new Proxy(Object.create(null), {
        get: (_, p, receiver) => {
          return (
            Reflect.get(this.builtInApis, p, receiver) ||
            Reflect.get(this.extendsValue, p, receiver)
          );
        },
        set() {
          return false;
        },
        has: (_, p) => {
          return Reflect.has(this.builtInApis, p) || Reflect.has(this.extendsValue, p);
        },
      });
    }

    return this._expose;
  }
}
