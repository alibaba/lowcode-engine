import ConfigProvider from '../config-provider';
import TimePicker from './time-picker';

export default ConfigProvider.config(TimePicker, {
    transform: /* istanbul ignore next */ (props, deprecated) => {
        if ('defaultOpen' in props) {
            deprecated('defaultOpen', 'defaultVisible', 'TimePicker');
            const { defaultOpen, ...others } = props;
            props = { defaultVisible: defaultOpen, ...others };
        }
        if ('open' in props) {
            deprecated('open', 'visible', 'TimePicker');
            const { open, ...others } = props;
            props = { visible: open, ...others };
        }
        if ('onOpenChange' in props) {
            deprecated('onOpenChange', 'onVisibleChange', 'TimePicker');
            const { onOpenChange, ...others } = props;
            props = { onVisibleChange: onOpenChange, ...others };
        }

        return props;
    },
});
