import template from './template';
import entry from './plugins/entry';
import appConfig from './plugins/appConfig';
import entryDocument from './plugins/entryDocument';
import globalStyle from './plugins/globalStyle';
import packageJSON from './plugins/packageJSON';

export default {
  template,
  plugins: {
    appConfig,
    entry,
    entryDocument,
    globalStyle,
    packageJSON,
  },
};
