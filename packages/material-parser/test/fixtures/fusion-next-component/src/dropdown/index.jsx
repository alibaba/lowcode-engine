import ConfigProvider from '../config-provider';
import Dropdown from './dropdown';

export default ConfigProvider.config(Dropdown, {
    transform: /* istanbul ignore next */ (props, deprecated) => {
        if ('triggerType' in props) {
            const triggerType = Array.isArray(props.triggerType)
                ? [...props.triggerType]
                : [props.triggerType];

            if (triggerType.indexOf('focus') > -1) {
                deprecated(
                    'triggerType[focus]',
                    'triggerType[hover, click]',
                    'Balloon'
                );
            }
        }

        return props;
    },
});
