import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AddonEngine from '../engine/addonEngine';
import BlockEngine from '../engine/blockEngine';
import AppContext from '../context/appContext';
import { forEach, isFileSchema } from '../utils';
export default function addonFactory(schema, components = {}, componentsMap = {}, config = {}) {
  class LNAddonView extends PureComponent {
    static dislayName = 'luna-addon-factory';
    static version = config.version || '0.0.0';
    static contextType = AppContext;
    static propTypes = {
      forwardedRef: PropTypes.func
    };
    render() {
      if (!schema || schema.componentName !== 'Addon' || !isFileSchema(schema)) {
        console.warn('编辑器插件模型结构异常！');
        return null;
      }
      const { forwardedRef, ...otherProps } = this.props;
      const props = {
        ...schema.defaultProps,
        ...otherProps,
        __schema: schema,
        ref: forwardedRef
      };
      return (
        <AppContext.Provider
          value={{
            ...this.context,
            appHelper: window.__ctx && window.__ctx.appHelper, // 插件上下文中的appHelper使用IDE的appHelper
            components: { ...components, Addon: AddonEngine, Block: BlockEngine },
            componentsMap,
            config,
            locale: props.locale,
            messages: props.messages
          }}
        >
          <AddonEngine
            {...props}
            __components={{ ...components, Addon: AddonEngine, Block: BlockEngine }}
            __componentsMap={componentsMap}
            __appHelper={window.__ctx && window.__ctx.appHelper}
          />
        </AppContext.Provider>
      );
    }
  }
  const ResComp = React.forwardRef((props, ref) => <LNAddonView {...props} forwardedRef={ref} />);
  forEach(schema.static, (val, key) => {
    ResComp[key] = val;
  });
  ResComp.version = config.version || '0.0.0';
  return ResComp;
}
