import { IPublicModelPluginContext, IPublicTypePlugin } from '@alilc/lowcode-types';
import { nodeCommand } from './node-command';
import { historyCommand } from './history-command';

export const CommandPlugin: IPublicTypePlugin = (ctx: IPublicModelPluginContext) => {
  const { plugins } = ctx;

  return {
    async init() {
      await plugins.register(nodeCommand, {}, { autoInit: true });
      await plugins.register(historyCommand, {}, { autoInit: true });
    },
    destroy() {
      plugins.delete(nodeCommand.pluginName);
      plugins.delete(historyCommand.pluginName);
    },
  };
};

CommandPlugin.pluginName = '___default_command___';
CommandPlugin.meta = {
  commandScope: 'common',
};

export default CommandPlugin;
