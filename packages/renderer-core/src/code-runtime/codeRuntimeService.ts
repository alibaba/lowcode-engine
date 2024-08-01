import {
  createDecorator,
  Disposable,
  type StringDictionary,
  type IDisposable,
} from '@alilc/lowcode-shared';
import { type ICodeRuntime, type CodeRuntimeOptions, CodeRuntime } from './codeRuntime';
import { ISchemaService } from '../schema';

export interface ICodeRuntimeService extends IDisposable {
  readonly rootRuntime: ICodeRuntime;

  createCodeRuntime<T extends StringDictionary = StringDictionary>(
    options?: CodeRuntimeOptions<T>,
  ): ICodeRuntime<T>;
}

export const ICodeRuntimeService = createDecorator<ICodeRuntimeService>('codeRuntimeService');

export class CodeRuntimeService extends Disposable implements ICodeRuntimeService {
  private _rootRuntime?: ICodeRuntime;
  get rootRuntime() {
    if (!this._rootRuntime) {
      this._rootRuntime = this._addDispose(new CodeRuntime());
    }
    return this._rootRuntime;
  }

  constructor(@ISchemaService private schemaService: ISchemaService) {
    super();

    this._addDispose(
      this.schemaService.onSchemaUpdate(({ key, data }) => {
        if (key === 'constants') {
          this.rootRuntime.getScope().set('constants', data);
        }
      }),
    );
  }

  initialize(options: CodeRuntimeOptions): void {
    this._rootRuntime = this._addDispose(new CodeRuntime(options));
  }

  createCodeRuntime<T extends StringDictionary = StringDictionary>(
    options: CodeRuntimeOptions<T> = {},
  ): ICodeRuntime<T> {
    this._throwIfDisposed();

    return this._addDispose(
      options.parentScope ? new CodeRuntime(options) : this.rootRuntime.createChild<T>(options),
    );
  }
}
