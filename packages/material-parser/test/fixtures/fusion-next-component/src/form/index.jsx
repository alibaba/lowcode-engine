import ConfigProvider from '../config-provider';
import Form from './form';
import Item from './item';
import Submit from './submit';
import Reset from './reset';
import Error from './error';

Form.Item = ConfigProvider.config(Item, {
    transform: /* istanbul ignore next */ (props, deprecated) => {
        if ('validateStatus' in props) {
            deprecated('validateStatus', 'validateState', 'Form.Item');

            const { validateStatus, ...others } = props;
            props = { validateState: validateStatus, ...others };
        }

        return props;
    },
});
Form.Submit = Submit;
Form.Reset = Reset;
Form.Error = Error;

export default ConfigProvider.config(Form, {
    transform: /* istanbul ignore next */ (props, deprecated) => {
        if ('direction' in props) {
            deprecated('direction', 'inline', 'Form');
            const { direction, ...others } = props;
            if (direction === 'hoz') {
                props = { inline: true, ...others };
            }
        }

        return props;
    },
});
