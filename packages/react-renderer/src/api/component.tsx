import { createRenderer } from '@alilc/lowcode-renderer-core';
import { FunctionComponent } from 'react';
import {
  type LowCodeComponentProps,
  createComponent as createSchemaComponent,
} from '../runtime/createComponent';
import { RendererContext, getRenderInstancesByAccessor } from './context';
import { type ReactAppOptions } from './types';

interface Render {
  toComponent(): FunctionComponent<LowCodeComponentProps>;
}

export async function createComponent(options: ReactAppOptions) {
  const creator = createRenderer<Render>((accessor) => {
    const instances = getRenderInstancesByAccessor(accessor);
    const componentsTree = instances.schema.get('componentsTree')[0];

    const LowCodeComponent = createSchemaComponent(componentsTree, {
      displayName: componentsTree.componentName,
      ...options.component,
    });

    const contextValue = { ...instances, options };

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
