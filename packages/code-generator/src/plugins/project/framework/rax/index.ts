import template from './template';
import entry from './plugins/entry';
import appConfig from './plugins/appConfig';
import buildConfig from './plugins/buildConfig';
import entryDocument from './plugins/entryDocument';
import globalStyle from './plugins/globalStyle';
import packageJSON from './plugins/packageJSON';

export default {
  template,
  plugins: {
    appConfig,
    buildConfig,
    entry,
    entryDocument,
    globalStyle,
    packageJSON,
  },
};
