import { ILowCodePluginContext } from '@alilc/lowcode-designer';

export const componentMetaParser = (designer: any) => {
  const fun = (ctx: ILowCodePluginContext) => {
    return {
      init() {
        const { material } = ctx;
        material.onChangeAssets(() => {
          const assets = material.getAssets();
          const { components = [] } = assets;
          designer.buildComponentMetasMap(components);
        });
      },
    };
  };

  fun.pluginName = '___component_meta_parser___';

  return fun;
};
