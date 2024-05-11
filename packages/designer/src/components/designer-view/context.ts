import { createContext, useContext } from 'react';
import { type Designer } from '../../designer';

const DesignerContext = createContext<Designer>(undefined!);

export const useDesignerContext = () => useContext(DesignerContext);

export const DesignerContextProvider = DesignerContext.Provider;
