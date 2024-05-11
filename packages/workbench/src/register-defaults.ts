import parseJSFunc from './transducers/parse-func';
import parseProps from './transducers/parse-props';
import addonCombine from './transducers/addon-combine';
import { IPublicModelPluginContext } from '@alilc/lowcode-types';

export const registerDefaults = (ctx: IPublicModelPluginContext) => {
  const { material } = ctx;
  return {
    init() {
      // parseFunc
      material.registerMetadataTransducer(parseJSFunc, 1, 'parse-func');

      // parseProps
      material.registerMetadataTransducer(parseProps, 5, 'parse-props');

      // addon/platform custom
      material.registerMetadataTransducer(addonCombine, 10, 'combine-props');
    },
  };
};

registerDefaults.pluginName = '___register_defaults___';
