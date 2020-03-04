import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import AppContext from '../../context/appContext';
import { isEmpty, generateI18n, goldlog } from '../../utils';

export default class Addon extends PureComponent {
  static displayName = 'lunaAddon';
  static propTypes = {
    config: PropTypes.object,
    locale: PropTypes.string,
    messages: PropTypes.object
  };
  static defaultProps = {
    config: {}
  };
  static contextType = AppContext;
  constructor(props, context) {
    super(props, context);
    if (isEmpty(props.config) || !props.config.addonKey) {
      console.warn('luna addon has wrong config');
      return;
    }
    // 插件上下文中的appHelper使用IDE的appHelper
    context.appHelper = (window.__ctx && window.__ctx.appHelper) || context.appHelper;
    context.locale = props.locale;
    context.messages = props.messages;
    // 注册插件
    this.appHelper = context.appHelper;
    let { locale, messages } = props;
    this.i18n = generateI18n(locale, messages);
    this.addonKey = props.config.addonKey;
    this.appHelper.addons = this.appHelper.addons || {};
    this.appHelper.addons[this.addonKey] = this;
  }

  async componentWillUnmount() {
    // 销毁插件
    const config = this.props.config || {};
    if (config && this.appHelper.addons) {
      delete this.appHelper.addons[config.addonKey];
    }
  }

  open = () => {
    return true;
  };

  close = () => {
    return true;
  };

  goldlog = (goKey, params) => {
    const { addonKey, addonConfig = {} } = this.props.config || {};
    goldlog(
      goKey,
      {
        addonKey,
        package: addonConfig.package,
        version: addonConfig.version,
        ...this.appHelper.logParams,
        ...params
      },
      'addon'
    );
  };

  get utils() {
    return this.appHelper.utils;
  }

  get constants() {
    return this.appHelper.constants;
  }

  get history() {
    return this.appHelper.history;
  }

  get location() {
    return this.appHelper.location;
  }

  render() {
    return null;
  }
}
