import {
  createDecorator,
  Provide,
  invariant,
  type Spec,
  type PlainObject,
} from '@alilc/lowcode-shared';
import { ICodeRuntimeService } from '../code-runtime';
import {
  type IComponentTreeModel,
  ComponentTreeModel,
  type ComponentTreeModelOptions,
} from './componentTreeModel';
import { ISchemaService } from '../schema';

export interface CreateComponentTreeModelOptions extends ComponentTreeModelOptions {
  codeScopeValue?: PlainObject;
}

export interface IComponentTreeModelService {
  create<Component>(
    componentsTree: Spec.ComponentTree,
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

@Provide(IComponentTreeModelService)
export class ComponentTreeModelService implements IComponentTreeModelService {
  constructor(
    @ISchemaService private schemaService: ISchemaService,
    @ICodeRuntimeService private codeRuntimeService: ICodeRuntimeService,
  ) {}

  create<Component>(
    componentsTree: Spec.ComponentTree,
    options: CreateComponentTreeModelOptions,
  ): IComponentTreeModel<Component> {
    return new ComponentTreeModel(
      componentsTree,
      this.codeRuntimeService.createCodeRuntime({
        initScopeValue: options?.codeScopeValue,
      }),
      options,
    );
  }

  createById<Component>(
    id: string,
    options: CreateComponentTreeModelOptions,
  ): IComponentTreeModel<Component> {
    const componentsTrees = this.schemaService.get('componentsTree');
    const componentsTree = componentsTrees.find((item) => item.id === id);

    invariant(componentsTree, 'componentsTree not found');

    return new ComponentTreeModel(
      componentsTree,
      this.codeRuntimeService.createCodeRuntime({
        initScopeValue: options?.codeScopeValue,
      }),
      options,
    );
  }
}
