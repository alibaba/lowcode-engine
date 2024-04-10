import { IPublicModelPluginContext } from '@alilc/lowcode-types';

// 注册默认的 setters
export const setterRegistry = (ctx: IPublicModelPluginContext) => {
  return {
    init() {
      const { config } = ctx;
      if (config.get('disableDefaultSetters')) return;

      // const builtinSetters = require('@alilc/lowcode-engine-ext')?.setters;
      // @ts-expect-error: todo remove
      const builtinSetters = window.AliLowCodeEngineExt?.setters;
      if (builtinSetters) {
        ctx.setters.registerSetter(builtinSetters);
      }
    },
  };
};

setterRegistry.pluginName = '___setter_registry___';
