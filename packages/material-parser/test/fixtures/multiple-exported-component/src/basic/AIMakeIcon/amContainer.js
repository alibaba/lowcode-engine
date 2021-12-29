import component from './index.js';
import amManifest from './amManifest.js';
import createFromIconfont from './IconFont';

const getComponent = () => Promise.resolve(component);

export default { getComponent, manifest: amManifest, createFromIconfont };
