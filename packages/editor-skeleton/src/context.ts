import { createContext } from 'react';
import { ISkeleton } from './skeleton';

export const SkeletonContext = createContext<ISkeleton>({} as any);
