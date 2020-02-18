import { createContext } from 'react';
import { SimulatorHost } from './host';

export const SimulatorContext = createContext<SimulatorHost>({} as any);
