import { registerMetadataTransducer } from '@alilc/lowcode-designer';
import parseJSFunc from './transducers/parse-func';
import parseProps from './transducers/parse-props';
import addonCombine from './transducers/addon-combine';

export const registerDefaults = () => {
  // parseFunc
  registerMetadataTransducer(parseJSFunc, 1, 'parse-func');

  // parseProps
  registerMetadataTransducer(parseProps, 5, 'parse-props');

  // addon/platform custom
  registerMetadataTransducer(addonCombine, 10, 'combine-props');
};
