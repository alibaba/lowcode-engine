import template from './template';
import globalStyle from './plugins/globalStyle';
import packageJSON from './plugins/packageJSON';
import layout from './plugins/layout';
import appConfig from './plugins/appConfig';
import buildConfig from './plugins/buildConfig';

export default {
  template,
  plugins: {
    appConfig,
    buildConfig,
    globalStyle,
    packageJSON,
    layout,
  },
};
