import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';

var _this = this;

import ConfigProvider from '../config-provider';
import Search from './Search';

export default ConfigProvider.config(Search, {
    transfrom: /* istanbul ignore next */function transfrom(props, deprecated) {
        var _props = _this.props,
            onInputFocus = _props.onInputFocus,
            overlayVisible = _props.overlayVisible,
            combox = _props.combox,
            others = _objectWithoutProperties(_props, ['onInputFocus', 'overlayVisible', 'combox']);

        var newprops = others;

        if (onInputFocus) {
            deprecated('onInputFocus', 'onFocus', 'Search');
            newprops.onFocus = onInputFocus;
        }
        if ('overlayVisible' in _this.props) {
            deprecated('overlayVisible', 'visible', 'Search');
            newprops.visible = overlayVisible;
        }
        if (combox) {
            deprecated('combox', 'popupContent', 'Search');
            newprops.popupContent = combox;
        }

        return newprops;
    }
});