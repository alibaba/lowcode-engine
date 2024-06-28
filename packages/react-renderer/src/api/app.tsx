import { createRenderer } from '@alilc/lowcode-renderer-core';
import { type Root, createRoot } from 'react-dom/client';
import { type ReactAppOptions, RendererContext } from './context';
import { ApplicationView, boosts } from '../app';

export const createApp = async (options: ReactAppOptions) => {
  return createRenderer(async (context) => {
    const { schema, boostsManager } = context;

    boostsManager.extend(boosts.toExpose());

    let root: Root | undefined;

    return {
      async mount(containerOrId) {
        if (root) return;

        const defaultId = schema.get('config')?.targetRootID ?? 'app';
        const rootElement = normalizeContainer(containerOrId, defaultId);
        const contextValue = { ...context, options };

        root = createRoot(rootElement);
        root.render(
          <RendererContext.Provider value={contextValue}>
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
