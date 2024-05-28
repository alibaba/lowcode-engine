import { createRenderer, type AppOptions } from '@alilc/lowcode-renderer-core';
import { FunctionComponent } from 'react';
import { type LowCodeComponentProps, createComponentBySchema } from '../runtime';
import { RendererContext } from '../context/render';

interface Render {
  toComponent(): FunctionComponent<LowCodeComponentProps>;
}

export async function createComponent(options: AppOptions) {
  const creator = createRenderer<Render>((context) => {
    const { schema } = context;

    const LowCodeComponent = createComponentBySchema(schema.get('componentsTree')[0]);

    function Component(props: LowCodeComponentProps) {
      return (
        <RendererContext.Provider value={context}>
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
