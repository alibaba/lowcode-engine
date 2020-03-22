import { registerMetadataTransducer } from '../../../globals';
import parseProps from './parse-props';
import addonCombine from './addon-combine';

// parseProps
registerMetadataTransducer(parseProps);

// addon/platform custom
registerMetadataTransducer(addonCombine);
