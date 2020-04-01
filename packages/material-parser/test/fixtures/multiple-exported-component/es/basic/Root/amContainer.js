import component from './index.js';
import amManifest from './amManifest.js';

const getComponent = function () {
  return Promise.resolve(component);
};

export default {
  getComponent,
  manifest: amManifest,
};