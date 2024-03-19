import { createContext, useContext } from 'react';
import { type AppContext as AppContextType } from '@alilc/runtime-core';
import { type ReactRenderer } from '../renderer';

export interface AppContextObject extends AppContextType {
  renderer: ReactRenderer;
}

export const AppContext = createContext<AppContextObject>({} as any);

AppContext.displayName = 'RootContext';

export const useAppContext = () => useContext(AppContext);
