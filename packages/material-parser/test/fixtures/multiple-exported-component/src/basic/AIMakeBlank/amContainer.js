import component from './index.js';
import amManifest from './amManifest.js';

const getComponent = () => Promise.resolve(component);

export default { getComponent, manifest: amManifest };
