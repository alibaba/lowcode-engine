import { registerMetadataTransducer } from '@ali/lowcode-globals';
import parseProps from './parse-props';
import addonCombine from './addon-combine';

// parseProps
registerMetadataTransducer(parseProps, 10, 'parse-props');

// addon/platform custom
registerMetadataTransducer(addonCombine, 11, 'combine-props');
