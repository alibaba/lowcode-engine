import ConfigProvider from '../config-provider';
import Rating from './rating';

export default ConfigProvider.config(Rating, {
    transform: /* istanbul ignore next */ (props, deprecated) => {
        if ('type' in props) {
            deprecated('type', 'showGrade', 'Rating');

            const { type, ...others } = props;
            props = { showGrade: type === 'grade', ...others };
        }

        const { disabled, readOnly } = props;
        props.disabled = disabled || readOnly;

        return props;
    },
});
