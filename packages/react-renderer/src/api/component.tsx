import { createRenderer } from '@alilc/lowcode-renderer-core';
import { type ComponentTreeRoot } from '@alilc/lowcode-shared';
import { type FunctionComponent } from 'react';
import {
  type LowCodeComponentProps,
  createComponent as createSchemaComponent,
} from '../runtime/createComponent';
import { type IRendererContext, RendererContext, getRenderInstancesByAccessor } from './context';
import { type ReactAppOptions } from './types';

interface Render {
  toComponent(): FunctionComponent<LowCodeComponentProps>;
}

export async function createComponent(options: ReactAppOptions) {
  const creator = createRenderer<Render>((service) => {
    const contextValue: IRendererContext = service.invokeFunction((accessor) => {
      return {
        options,
        ...getRenderInstancesByAccessor(accessor),
      };
    });

    const componentsTree = contextValue.schema.get<ComponentTreeRoot>('componentsTree.0');

    if (!componentsTree) {
      throw new Error('componentsTree is required');
    }

    const LowCodeComponent = createSchemaComponent(componentsTree, {
      displayName: componentsTree.componentName,
      ...options.component,
    });

    function Component(props: LowCodeComponentProps) {
      return (
        <RendererContext.Provider value={contextValue}>
          <LowCodeComponent {...props} />
        </RendererContext.Provider>
      );
    }

    return {
      toComponent() {
        return Component;
      },
    };
  });

  const render = await creator(options);

  return render.toComponent();
}
