import component from './index.js';
import amManifest from './amManifest.js';
import createFromIconfont from './IconFont';

var getComponent = function () {
  return Promise.resolve(component);
};

export default {
  getComponent,
  manifest: amManifest,
  createFromIconfont
};