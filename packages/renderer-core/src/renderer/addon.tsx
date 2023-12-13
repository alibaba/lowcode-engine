import PropTypes from 'prop-types';
import baseRendererFactory from './base';
import { isEmpty } from '../utils';
import { IRendererAppHelper, IBaseRendererProps, IBaseRenderComponent } from '../types';
import logger from '../utils/logger';

export default function addonRendererFactory(): IBaseRenderComponent {
  const BaseRenderer = baseRendererFactory();
  return class AddonRenderer extends BaseRenderer {
    static displayName = 'AddonRenderer';

    __namespace = 'addon';

    static propTypes = {
      config: PropTypes.object,
      __schema: PropTypes.object,
    };

    static defaultProps = {
      config: {},
      __schema: {},
    };

    addonKey: any;
    appHelper: IRendererAppHelper;
    open: () => any;
    close: () => any;

    __afterInit(props: IBaseRendererProps) {
      this.__generateCtx({
        component: this,
      });
      const schema = props.__schema || {};
      this.state = this.__parseData(schema.state || {});
      if (isEmpty(props.config) || !props.config?.addonKey) {
        logger.warn('lce addon has wrong config');
        this.setState({
          __hasError: true,
        });
        return;
      }
      // 注册插件
      this.addonKey = props.config.addonKey;
      this.appHelper.addons = this.appHelper.addons || {};
      this.appHelper.addons[this.addonKey] = this;
      this.__initDataSource(props);
      this.open = this.open || (() => { });
      this.close = this.close || (() => { });
      this.__executeLifeCycleMethod('constructor', [...arguments]);
    }

    async componentWillUnmount() {
      super.componentWillUnmount?.apply(this, [...arguments] as any);
      // 注销插件
      const config = this.props.config || {};
      if (config && this.appHelper.addons) {
        delete this.appHelper.addons[config.addonKey];
      }
    }

    get utils() {
      const { utils = {} } = this.context.config || {};
      return { ...this.appHelper.utils, ...utils };
    }

    render() {
      const { __schema } = this.props;

      if (this.__checkSchema(__schema)) {
        return '插件 schema 结构异常！';
      }

      this.__debug(`${AddonRenderer.displayName} render - ${__schema.fileName}`);
      this.__generateCtx({
        component: this,
      });
      this.__render();

      return this.__renderContent(this.__renderContextProvider({ compContext: this }));
    }
  };
}
