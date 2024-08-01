import { type IInstantiationService } from '@alilc/lowcode-shared';

export interface IRenderObject {
  mount: (containerOrId?: string | HTMLElement) => void | Promise<void>;
  unmount: () => void | Promise<void>;
}

export interface RenderAdapter<Render> {
  (instantiationService: IInstantiationService): Render | Promise<Render>;
}
