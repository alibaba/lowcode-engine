import { IPublicModelPluginContext, IPublicTypePlugin } from '@alilc/lowcode-types';

export const historyCommand: IPublicTypePlugin = (ctx: IPublicModelPluginContext) => {
  const { command, project } = ctx;
  return {
    init() {
      command.registerCommand({
        name: 'undo',
        description: 'Undo the last operation.',
        handler: () => {
          const state = project.currentDocument?.history.getState() || 0;
          const enable = !!(state & 1);
          if (!enable) {
            throw new Error('Can not undo.');
          }
          project.currentDocument?.history.back();
        },
      });

      command.registerCommand({
        name: 'redo',
        description: 'Redo the last operation.',
        handler: () => {
          const state = project.currentDocument?.history.getState() || 0;
          const enable = !!(state & 2);
          if (!enable) {
            throw new Error('Can not redo.');
          }
          project.currentDocument?.history.forward();
        },
      });
    },
    destroy() {
      command.unregisterCommand('history:undo');
      command.unregisterCommand('history:redo');
    },
  };
};

historyCommand.pluginName = '___history_command___';
historyCommand.meta = {
  commandScope: 'history',
};
