import { createDecorator, invariant, Provide, type PlainObject } from '@alilc/lowcode-shared';
import { type ICodeRuntime, type CodeRuntimeOptions, CodeRuntime } from './codeRuntime';

export interface ICodeRuntimeService {
  readonly rootRuntime: ICodeRuntime;

  initialize(options: CodeRuntimeOptions): void;

  createCodeRuntime<T extends PlainObject = PlainObject>(
    options: CodeRuntimeOptions<T>,
  ): ICodeRuntime<T>;
}

export const ICodeRuntimeService = createDecorator<ICodeRuntimeService>('codeRuntimeService');

@Provide(ICodeRuntimeService)
export class CodeRuntimeService implements ICodeRuntimeService {
  rootRuntime: ICodeRuntime;

  initialize(options?: CodeRuntimeOptions) {
    this.rootRuntime = new CodeRuntime(options);
  }

  createCodeRuntime<T extends PlainObject = PlainObject>(
    options: CodeRuntimeOptions<T> = {},
  ): ICodeRuntime<T> {
    invariant(this.rootRuntime, `please initialize codeRuntimeService on renderer starting!`);

    return options.parentScope
      ? new CodeRuntime(options)
      : this.rootRuntime.createChild<T>(options);
  }
}
