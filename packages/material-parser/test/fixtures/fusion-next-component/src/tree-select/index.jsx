import ConfigProvider from '../config-provider';
import TreeSelect from './tree-select';

export default ConfigProvider.config(TreeSelect, {
    transform: /* istanbul ignore next */ (props, deprecated) => {
        if ('shape' in props) {
            deprecated('shape', 'hasBorder', 'TreeSelect');
            const { shape, ...others } = props;
            props = { hasBorder: shape !== 'arrow-only', ...others };
        }

        if ('container' in props) {
            deprecated('container', 'popupContainer', 'TreeSelect');
            const { container, ...others } = props;
            props = { popupContainer: container, ...others };
        }

        return props;
    },
});
