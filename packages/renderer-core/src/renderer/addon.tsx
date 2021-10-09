import PropTypes from 'prop-types';
import baseRendererFactory from './base';
import { isEmpty, goldlog } from '../utils';
import { IRendererProps } from '../types';

export default function addonRendererFactory() {
  const BaseRenderer = baseRendererFactory();
  return class AddonRenderer extends BaseRenderer {
    static dislayName = 'addon-renderer';

    __namespace = 'addon';

    static propTypes = {
      config: PropTypes.object,
      __schema: PropTypes.object,
    };

    static defaultProps = {
      config: {},
      __schema: {},
    };

    __afterInit(props: IRendererProps) {
      this.__generateCtx({
        component: this,
      });
      const schema = props.__schema || {};
      this.state = this.__parseData(schema.state || {});
      if (isEmpty(props.config) || !props.config.addonKey) {
        console.warn('lce addon has wrong config');
        this.state.__hasError = true;
        return;
      }
      // 注册插件
      this.addonKey = props.config.addonKey;
      this.appHelper.addons = this.appHelper.addons || {};
      this.appHelper.addons[this.addonKey] = this;
      this.__initDataSource(props);
      this.open = this.open || (() => { });
      this.close = this.close || (() => { });
      this.__setLifeCycleMethods('constructor', arguments);
    }

    async componentWillUnmount() {
      super.componentWillUnmount(...arguments);
      // 注销插件
      const config = this.props.config || {};
      if (config && this.appHelper.addons) {
        delete this.appHelper.addons[config.addonKey];
      }
    }

    goldlog = (goKey: string, params: any) => {
      const { addonKey, addonConfig = {} } = this.props.config || {};
      goldlog(
        goKey,
        {
          addonKey,
          package: addonConfig.package,
          version: addonConfig.version,
          ...this.appHelper.logParams,
          ...params,
        },
        'addon',
      );
    };

    get utils() {
      const { utils = {} } = this.context.config || {};
      return { ...this.appHelper.utils, ...utils };
    }

    render() {
      const { __schema } = this.props;

      if (this.__checkSchema(__schema)) {
        return '插件 schema 结构异常！';
      }

      this.__debug(`${AddonRenderer.dislayName} render - ${__schema.fileName}`);
      this.__generateCtx({
        component: this,
      });
      this.__render();

      return this.__renderContent(this.__renderContextProvider({ compContext: this }));
    }
  };
}
