import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import TreeSelect from './tree-select';

export default ConfigProvider.config(TreeSelect, {
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('shape' in props) {
            deprecated('shape', 'hasBorder', 'TreeSelect');

            var _props = props,
                shape = _props.shape,
                others = _objectWithoutProperties(_props, ['shape']);

            props = _extends({ hasBorder: shape !== 'arrow-only' }, others);
        }

        if ('container' in props) {
            deprecated('container', 'popupContainer', 'TreeSelect');

            var _props2 = props,
                container = _props2.container,
                _others = _objectWithoutProperties(_props2, ['container']);

            props = _extends({ popupContainer: container }, _others);
        }

        return props;
    }
});