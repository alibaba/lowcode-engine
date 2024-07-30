import {
  IBoostsManager,
  IComponentTreeModelService,
  ILifeCycleService,
  IPackageManagementService,
  ISchemaService,
  IExtensionHostService,
} from '@alilc/lowcode-renderer-core';
import { InstanceAccessor } from '@alilc/lowcode-shared';
import { createContext, useContext } from 'react';
import { type ReactAppOptions } from './types';

export interface IRendererContext {
  readonly options: ReactAppOptions;

  readonly schema: Omit<ISchemaService, 'initialize'>;

  readonly packageManager: IPackageManagementService;

  readonly boostsManager: IBoostsManager;

  readonly componentTreeModel: IComponentTreeModelService;

  readonly lifeCycle: ILifeCycleService;
}

export const getRenderInstancesByAccessor = (accessor: InstanceAccessor) => {
  return {
    schema: accessor.get(ISchemaService),
    packageManager: accessor.get(IPackageManagementService),
    boostsManager: accessor.get(IExtensionHostService).boostsManager,
    componentTreeModel: accessor.get(IComponentTreeModelService),
    lifeCycle: accessor.get(ILifeCycleService),
  };
};

export const RendererContext = createContext<IRendererContext>(undefined!);

RendererContext.displayName = 'RendererContext';

export const useRendererContext = () => useContext(RendererContext);
