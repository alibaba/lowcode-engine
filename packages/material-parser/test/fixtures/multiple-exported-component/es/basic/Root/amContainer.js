import component from './index.js';
import amManifest from './amManifest.js';

var getComponent = function () {
  return Promise.resolve(component);
};

export default {
  getComponent,
  manifest: amManifest
};