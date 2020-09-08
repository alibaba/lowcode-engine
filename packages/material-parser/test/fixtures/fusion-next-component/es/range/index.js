import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import Range from './view/range';

export default ConfigProvider.config(Range, {
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('hasTips' in props) {
            deprecated('hasTips', 'hasTip', 'Range');

            var _props = props,
                hasTips = _props.hasTips,
                others = _objectWithoutProperties(_props, ['hasTips']);

            props = _extends({ hasTip: hasTips }, others);
        }

        if ('tipFormatter' in props) {
            deprecated('tipFormatter', 'tipRender', 'Range');

            var _props2 = props,
                tipFormatter = _props2.tipFormatter,
                _others = _objectWithoutProperties(_props2, ['tipFormatter']);

            props = _extends({ tipRender: tipFormatter }, _others);
        }

        return props;
    }
});