import {
  createDecorator,
  invariant,
  Disposable,
  type StringDictionary,
} from '@alilc/lowcode-shared';
import { type ICodeRuntime, type CodeRuntimeOptions, CodeRuntime } from './codeRuntime';
import { ISchemaService } from '../schema';

export interface ICodeRuntimeService {
  readonly rootRuntime: ICodeRuntime;

  createCodeRuntime<T extends StringDictionary = StringDictionary>(
    options?: CodeRuntimeOptions<T>,
  ): ICodeRuntime<T>;
}

export const ICodeRuntimeService = createDecorator<ICodeRuntimeService>('codeRuntimeService');

export class CodeRuntimeService extends Disposable implements ICodeRuntimeService {
  rootRuntime: ICodeRuntime;

  constructor(
    options: CodeRuntimeOptions = {},
    @ISchemaService private schemaService: ISchemaService,
  ) {
    super();
    this.rootRuntime = new CodeRuntime(options);

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
    invariant(this.rootRuntime, `please initialize codeRuntimeService on renderer starting!`);

    return options.parentScope
      ? new CodeRuntime(options)
      : this.rootRuntime.createChild<T>(options);
  }
}
