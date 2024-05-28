import { invariant, InstantiationService } from '@alilc/lowcode-shared';
import { RendererMain } from './main';
import { type IRender, type RenderAdapter } from './parts/extension';
import type { RendererApplication, AppOptions } from './types';

/**
 * 创建 createRenderer 的辅助函数
 * @param schema
 * @param options
 * @returns
 */
export function createRenderer<Render = IRender>(
  renderAdapter: RenderAdapter<Render>,
): (options: AppOptions) => Promise<RendererApplication<Render>> {
  invariant(typeof renderAdapter === 'function', 'The first parameter must be a function.');

  const instantiationService = new InstantiationService({ defaultScope: 'Singleton' });
  instantiationService.bootstrapModules();

  const rendererMain = instantiationService.createInstance(RendererMain);

  return async (options) => {
    rendererMain.initialize(options);

    return rendererMain.startup<Render>(renderAdapter);
  };
}
