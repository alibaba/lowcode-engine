import { createContext, useContext } from 'react';
import { type RenderContext } from '@alilc/lowcode-renderer-core';
import { type ReactAppOptions } from './types';

export const RendererContext = createContext<RenderContext & { options: ReactAppOptions }>(
  undefined!,
);

RendererContext.displayName = 'RendererContext';

export const useRendererContext = () => useContext(RendererContext);
