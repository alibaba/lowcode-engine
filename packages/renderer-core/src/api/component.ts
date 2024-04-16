import type { PlainObject, InstanceStateApi } from '@alilc/lowcode-shared';
import { type CreateContainerOptions, createContainer, type Container } from '../container';

export type CreateComponentBaseOptions<T extends string> = Omit<
  CreateContainerOptions<T>,
  'stateCreator'
>;

/**
 * 创建 createComponent 的辅助函数
 * createComponent = createComponentFunction(() => component)
 */
export function createComponentFunction<
  ComponentT,
  InstanceT,
  LifeCycleNameT extends string,
  O extends CreateComponentBaseOptions<LifeCycleNameT>,
>(
  stateCreator: (initState: PlainObject) => InstanceStateApi,
  componentCreator: (
    container: Container<InstanceT, LifeCycleNameT>,
    componentOptions: O,
  ) => ComponentT,
): (componentOptions: O) => ComponentT {
  return (componentOptions) => {
    const {
      supCodeScope,
      initScopeValue = {},
      dataSourceCreator,
      componentsTree,
    } = componentOptions;

    const container = createContainer<InstanceT, LifeCycleNameT>({
      supCodeScope,
      initScopeValue,
      stateCreator,
      dataSourceCreator,
      componentsTree,
    });

    return componentCreator(container, componentOptions);
  };
}
