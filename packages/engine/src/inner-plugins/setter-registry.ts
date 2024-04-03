import { IPublicModelPluginContext } from '@alilc/lowcode-types';

// 注册默认的 setters
export const setterRegistry = (ctx: IPublicModelPluginContext) => {
  return {
    init() {
      const { config } = ctx;
      if (config.get('disableDefaultSetters')) return;
      // todo: 互相依赖
      // const builtinSetters = require('@alilc/lowcode-engine-ext')?.setters;
      // if (builtinSetters) {
      //   ctx.setters.registerSetter(builtinSetters);
      // }
    },
  };
};

setterRegistry.pluginName = '___setter_registry___';
