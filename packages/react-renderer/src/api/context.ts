import { type ComponentType, createContext, useContext } from 'react';
import { type AppOptions, type RenderContext } from '@alilc/lowcode-renderer-core';

export interface ReactAppOptions extends AppOptions {
  faultComponent?: ComponentType<any>;
}

export const RendererContext = createContext<RenderContext & { options: ReactAppOptions }>(
  undefined!,
);

RendererContext.displayName = 'RendererContext';

export const useRendererContext = () => useContext(RendererContext);
