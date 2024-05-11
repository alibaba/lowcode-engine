import { bootstrapModules, createInstance } from '@alilc/lowcode-core';
import { EngineMain } from './main';

export async function init(
  container?: HTMLElement,
  options?: IPublicTypeEngineOptions,
  pluginPreference?: PluginPreference,
) {
  if (!container) {
    container = document.createElement('div');
    container.id = 'engine';
    document.body.appendChild(container);
  }

  bootstrapModules();
  createInstance(EngineMain).startup(container);
}
