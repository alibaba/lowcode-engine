import {
  createDecorator,
  type IDisposable,
  Disposable,
  invariant,
  type ComponentTree,
  type StringDictionary,
} from '@alilc/lowcode-shared';
import { ICodeRuntimeService } from '../code-runtime';
import {
  type IComponentTreeModel,
  ComponentTreeModel,
  type ComponentTreeModelOptions,
} from './componentTreeModel';
import { ISchemaService } from '../schema';

export interface CreateComponentTreeModelOptions extends ComponentTreeModelOptions {
  codeScopeValue?: StringDictionary;
}

export interface IComponentTreeModelService extends IDisposable {
  create<Component>(
    componentsTree: ComponentTree,
    options?: CreateComponentTreeModelOptions,
  ): IComponentTreeModel<Component>;

  createById<Component>(
    id: string,
    options?: CreateComponentTreeModelOptions,
  ): IComponentTreeModel<Component>;
}

export const IComponentTreeModelService = createDecorator<IComponentTreeModelService>(
  'componentTreeModelService',
);

export class ComponentTreeModelService extends Disposable implements IComponentTreeModelService {
  constructor(
    @ISchemaService private schemaService: ISchemaService,
    @ICodeRuntimeService private codeRuntimeService: ICodeRuntimeService,
  ) {
    super();
  }

  create<Component>(
    componentsTree: ComponentTree,
    options: CreateComponentTreeModelOptions,
  ): IComponentTreeModel<Component> {
    this._throwIfDisposed(`ComponentTreeModelService has been disposed.`);

    return this._addDispose(
      new ComponentTreeModel(
        componentsTree,
        this.codeRuntimeService.createCodeRuntime({
          initScopeValue: options?.codeScopeValue as any,
        }),
        options,
      ),
    );
  }

  createById<Component>(
    id: string,
    options: CreateComponentTreeModelOptions,
  ): IComponentTreeModel<Component> {
    const componentsTrees = this.schemaService.get<ComponentTree[]>('componentsTree', []);
    const componentsTree = componentsTrees.find((item) => item.id === id);

    invariant(componentsTree, 'componentsTree not found');

    return this.create(componentsTree, options);
  }
}
