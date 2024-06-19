import { createRenderer, type AppOptions } from '@alilc/lowcode-renderer-core';
import { type ComponentType } from 'react';
import { type Root, createRoot } from 'react-dom/client';
import { ApplicationView, RendererContext, boosts } from '../app';

export interface ReactAppOptions extends AppOptions {
  faultComponent?: ComponentType<any>;
}

export const createApp = async (options: ReactAppOptions) => {
  return createRenderer(async (context) => {
    const { schema, boostsManager } = context;

    // set config
    // if (options.faultComponent) {
    //   context.config.set('faultComponent', options.faultComponent);
    // }

    // extends boosts
    boostsManager.extend(boosts.toExpose());

    let root: Root | undefined;

    return {
      async mount(containerOrId) {
        if (root) return;

        const defaultId = schema.get('config')?.targetRootID ?? 'app';
        const rootElement = normalizeContainer(containerOrId, defaultId);

        root = createRoot(rootElement);
        root.render(
          <RendererContext.Provider value={context}>
            <ApplicationView />
          </RendererContext.Provider>,
        );
      },
      unmount() {
        if (root) {
          root.unmount();
          root = undefined;
        }
      },
    };
  })(options);
};

function normalizeContainer(container: Element | string | undefined, defaultId: string): Element {
  let result: Element | undefined = undefined;

  if (typeof container === 'string') {
    const el = document.getElementById(container);
    if (el) result = el;
  } else if (container instanceof window.Element) {
    result = container;
  }

  if (!result) {
    result = document.createElement('div');
    result.id = defaultId;
  }

  return result;
}
