import { type InstanceAccessor } from '@alilc/lowcode-shared';

export interface IRenderObject {
  mount: (containerOrId?: string | HTMLElement) => void | Promise<void>;
  unmount: () => void | Promise<void>;
}

export interface RenderAdapter<Render> {
  (accessor: InstanceAccessor): Render | Promise<Render>;
}
