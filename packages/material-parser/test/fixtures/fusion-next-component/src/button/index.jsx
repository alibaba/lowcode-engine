import ConfigProvider from '../config-provider';
import Button from './view/button';
import ButtonGroup from './view/group';

Button.Group = ButtonGroup;

export default ConfigProvider.config(Button, {
    transform: /* istanbul ignore next */ (props, deprecated) => {
        if ('shape' in props) {
            deprecated('shape', 'text | warning | ghost', 'Button');

            const { shape, type, ...others } = props;

            let newType = type;
            if (
                type === 'light' ||
                type === 'dark' ||
                (type === 'secondary' && shape === 'warning')
            ) {
                newType = 'normal';
            }

            let ghost;
            if (shape === 'ghost') {
                ghost = {
                    primary: 'dark',
                    secondary: 'dark',
                    normal: 'light',
                    dark: 'dark',
                    light: 'light',
                }[type || Button.defaultProps.type];
            }

            const text = shape === 'text';
            const warning = shape === 'warning';

            props = { type: newType, ghost, text, warning, ...others };
        }

        return props;
    },
});
