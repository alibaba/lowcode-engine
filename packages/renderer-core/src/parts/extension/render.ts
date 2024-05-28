import { IPackageManagementService } from '../package';
import { IBoostsService } from './boosts';
import { ISchemaService } from '../schema';
import { IComponentTreeModelService } from '../component-tree-model';

export interface IRender {
  mount: (el: HTMLElement) => void | Promise<void>;
  unmount: () => void | Promise<void>;
}

export interface RenderContext {
  readonly schema: Omit<ISchemaService, 'initialize'>;

  readonly packageManager: IPackageManagementService;

  readonly boostsManager: IBoostsService;

  readonly componentTreeModel: IComponentTreeModelService;
}

export interface RenderAdapter<Render> {
  (context: RenderContext): Render | Promise<Render>;
}
