import { IPublicModelPluginContext } from '@alilc/lowcode-types';

export const componentMetaParser = (designer: any) => {
  const fun = (ctx: IPublicModelPluginContext) => {
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
