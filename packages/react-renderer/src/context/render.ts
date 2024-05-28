import { createContext, useContext } from 'react';
import { type RenderContext } from '@alilc/lowcode-renderer-core';

export const RendererContext = createContext<RenderContext>(undefined!);

RendererContext.displayName = 'RootContext';

export const useRenderContext = () => useContext(RendererContext);
