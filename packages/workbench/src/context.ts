import { createContext } from 'react';
import { Skeleton } from './skeleton';

export const SkeletonContext = createContext<Skeleton>({} as any);
