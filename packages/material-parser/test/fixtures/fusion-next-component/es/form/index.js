import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import Form from './form';
import Item from './item';
import Submit from './submit';
import Reset from './reset';
import Error from './error';

Form.Item = ConfigProvider.config(Item, {
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('validateStatus' in props) {
            deprecated('validateStatus', 'validateState', 'Form.Item');

            var _props = props,
                validateStatus = _props.validateStatus,
                others = _objectWithoutProperties(_props, ['validateStatus']);

            props = _extends({ validateState: validateStatus }, others);
        }

        return props;
    }
});
Form.Submit = Submit;
Form.Reset = Reset;
Form.Error = Error;

export default ConfigProvider.config(Form, {
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('direction' in props) {
            deprecated('direction', 'inline', 'Form');

            var _props2 = props,
                direction = _props2.direction,
                others = _objectWithoutProperties(_props2, ['direction']);

            if (direction === 'hoz') {
                props = _extends({ inline: true }, others);
            }
        }

        return props;
    }
});