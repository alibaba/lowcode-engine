import { createRenderer, type AppOptions } from '@alilc/lowcode-renderer-core';
import { FunctionComponent } from 'react';
import { type LowCodeComponentProps, createComponentBySchema } from '../runtime/schema';
import { RendererContext } from '../api/context';

interface Render {
  toComponent(): FunctionComponent<LowCodeComponentProps>;
}

export async function createComponent(options: AppOptions) {
  const creator = createRenderer<Render>((context) => {
    const { schema } = context;

    const LowCodeComponent = createComponentBySchema(schema.get('componentsTree')[0]);
    const contextValue = { ...context, options };

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
