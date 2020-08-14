import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import CascaderSelect from './cascader-select';

export default ConfigProvider.config(CascaderSelect, {
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('shape' in props) {
            deprecated('shape', 'hasBorder', 'CascaderSelect');

            var _props = props,
                shape = _props.shape,
                others = _objectWithoutProperties(_props, ['shape']);

            props = _extends({ hasBorder: shape !== 'arrow-only' }, others);
        }

        if ('container' in props) {
            deprecated('container', 'popupContainer', 'CascaderSelect');

            var _props2 = props,
                container = _props2.container,
                _others = _objectWithoutProperties(_props2, ['container']);

            props = _extends({ popupContainer: container }, _others);
        }

        if ('expandTrigger' in props) {
            deprecated('expandTrigger', 'expandTriggerType', 'CascaderSelect');

            var _props3 = props,
                expandTrigger = _props3.expandTrigger,
                _others2 = _objectWithoutProperties(_props3, ['expandTrigger']);

            props = _extends({ expandTriggerType: expandTrigger }, _others2);
        }

        if ('showItemCount' in props) {
            deprecated('showItemCount', 'listStyle | listClassName', 'CascaderSelect');
        }
        if ('labelWidth' in props) {
            deprecated('labelWidth', 'listStyle | listClassName', 'CascaderSelect');
        }

        return props;
    }
});