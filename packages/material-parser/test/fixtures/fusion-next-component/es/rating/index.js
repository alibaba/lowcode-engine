import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import Rating from './rating';

export default ConfigProvider.config(Rating, {
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('type' in props) {
            deprecated('type', 'showGrade', 'Rating');

            var _props = props,
                type = _props.type,
                others = _objectWithoutProperties(_props, ['type']);

            props = _extends({ showGrade: type === 'grade' }, others);
        }

        var _props2 = props,
            disabled = _props2.disabled,
            readOnly = _props2.readOnly;

        props.disabled = disabled || readOnly;

        return props;
    }
});