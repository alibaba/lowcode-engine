import { Component, createElement } from 'rax';
import PropTypes from 'prop-types';
import AppHelper from '@ali/iceluna-sdk/lib/utils/appHelper';
import { forEach, isFileSchema } from '@ali/iceluna-sdk/lib/utils';
import CompEngine from '../engine/compEngine';
import BlockEngine from '../engine/blockEngine';
import AppContext from '../context/appContext';

export default function compFactory(schema, components = {}, componentsMap = {}, config = {}) {
  // 自定义组件需要有自己独立的appHelper
  const appHelper = new AppHelper(config);
  class LNCompView extends Component {
    static dislayName = 'luna-comp-factory';
    static version = config.version || '0.0.0';
    static contextType = AppContext;
    static propTypes = {
      forwardedRef: PropTypes.func
    };
    render() {
      if (!schema || schema.componentName !== 'Component' || !isFileSchema(schema)) {
        console.warn('自定义组件模型结构异常！');
        return null;
      }
      const { forwardedRef, ...otherProps } = this.props;
      // 低代码组件透传应用上下文
      const ctx = ['utils', 'constants', 'history', 'location', 'match'];
      ctx.forEach(key => {
        if (!appHelper[key] && this.context && this.context.appHelper && this.context.appHelper[key]) {
          appHelper.set(key, this.context.appHelper[key]);
        }
      });
      // 支持通过context透传国际化配置
      const localeProps = {};
      const { locale, messages } = this.context;
      if (locale && messages && messages[schema.fileName]) {
        localeProps.locale = locale;
        localeProps.messages = messages[schema.fileName];
      }
      const props = {
        ...schema.defaultProps,
        ...localeProps,
        ...otherProps,
        __schema: schema,
        ref: forwardedRef
      };

      return (
        <AppContext.Consumer>
          {context => {
            this.context = context;
            return (
              <CompEngine
                {...props}
                __appHelper={appHelper}
                __components={{ ...components, Component: CompEngine, Block: BlockEngine }}
                __componentsMap={componentsMap}
              />
            );
          }}
        </AppContext.Consumer>
      );
    }
  }

  const ResComp = React.forwardRef((props, ref) => <LNCompView {...props} forwardedRef={ref} />);
  forEach(schema.static, (val, key) => {
    ResComp[key] = val;
  });
  ResComp.version = config.version || '0.0.0';
  return ResComp;
}
