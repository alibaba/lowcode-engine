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
}
