import { createContext } from 'react';
import { BuiltinSimulatorHost } from './host';

export const SimulatorContext = createContext<BuiltinSimulatorHost>({} as any);
