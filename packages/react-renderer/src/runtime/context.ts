import { IComponentTreeModel } from '@alilc/lowcode-renderer-core';
import { createContext, useContext, type ReactInstance } from 'react';
import { type ReactComponent } from './components';

export const ModelContext = createContext<IComponentTreeModel<ReactComponent, ReactInstance>>(
  undefined!,
);

export const useModel = () => useContext(ModelContext);

export const ModelContextProvider = ModelContext.Provider;
