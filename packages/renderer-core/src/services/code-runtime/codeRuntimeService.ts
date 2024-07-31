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
  private _rootRuntime: ICodeRuntime;
  get rootRuntime() {
    return this._rootRuntime;
  }

  constructor(
    options: CodeRuntimeOptions = {},
    @ISchemaService private schemaService: ISchemaService,
  ) {
    super();

    this._rootRuntime = this.addDispose(new CodeRuntime(options));
    this.addDispose(
      this.schemaService.onSchemaUpdate(({ key, data }) => {
        if (key === 'constants') {
          this.rootRuntime.getScope().set('constants', data);
        }
      }),
    );
  }

  createCodeRuntime<T extends StringDictionary = StringDictionary>(
    options: CodeRuntimeOptions<T> = {},
  ): ICodeRuntime<T> {
    this._throwIfDisposed();

    return this.addDispose(
      options.parentScope ? new CodeRuntime(options) : this.rootRuntime.createChild<T>(options),
    );
  }
}
