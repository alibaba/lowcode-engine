import template from './template';
import entry from './plugins/entry';
import entryHtml from './plugins/entryHtml';
import globalStyle from './plugins/globalStyle';
import packageJSON from './plugins/packageJSON';
import router from './plugins/router';

export default {
  template,
  plugins: {
    entry,
    entryHtml,
    globalStyle,
    packageJSON,
    router,
  },
};
