import { IPackageManagementService } from '../package';
import { IBoostsService } from './boosts';
import { ISchemaService } from '../schema';
import { IComponentTreeModelService } from '../model';
import { ILifeCycleService } from '../lifeCycleService';

export interface IRenderObject {
  mount: (containerOrId?: string | HTMLElement) => void | Promise<void>;
  unmount: () => void | Promise<void>;
}

export interface RenderContext {
  readonly schema: Omit<ISchemaService, 'initialize'>;

  readonly packageManager: IPackageManagementService;

  readonly boostsManager: IBoostsService;

  readonly componentTreeModel: IComponentTreeModelService;

  readonly lifeCycle: ILifeCycleService;
}

export interface RenderAdapter<Render> {
  (context: RenderContext): Render | Promise<Render>;
}
