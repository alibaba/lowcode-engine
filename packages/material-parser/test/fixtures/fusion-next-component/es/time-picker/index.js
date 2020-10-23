import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import TimePicker from './time-picker';

export default ConfigProvider.config(TimePicker, {
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('defaultOpen' in props) {
            deprecated('defaultOpen', 'defaultVisible', 'TimePicker');

            var _props = props,
                defaultOpen = _props.defaultOpen,
                others = _objectWithoutProperties(_props, ['defaultOpen']);

            props = _extends({ defaultVisible: defaultOpen }, others);
        }
        if ('open' in props) {
            deprecated('open', 'visible', 'TimePicker');

            var _props2 = props,
                open = _props2.open,
                _others = _objectWithoutProperties(_props2, ['open']);

            props = _extends({ visible: open }, _others);
        }
        if ('onOpenChange' in props) {
            deprecated('onOpenChange', 'onVisibleChange', 'TimePicker');

            var _props3 = props,
                onOpenChange = _props3.onOpenChange,
                _others2 = _objectWithoutProperties(_props3, ['onOpenChange']);

            props = _extends({ onVisibleChange: onOpenChange }, _others2);
        }

        return props;
    }
});