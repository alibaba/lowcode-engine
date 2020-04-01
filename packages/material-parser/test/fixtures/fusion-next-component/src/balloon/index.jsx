import ConfigProvider from '../config-provider';
import Balloon from './balloon';
import Tooltip from './tooltip';
import Inner from './inner';

Balloon.Tooltip = ConfigProvider.config(Tooltip, {
    transform: /* istanbul ignore next */ (props, deprecated) => {
        if ('text' in props) {
            deprecated('text', 'children', 'Tooltip');
            const { text, ...others } = props;
            props = { children: text, ...others };
        }

        return props;
    },
});
Balloon.Inner = Inner;

export default ConfigProvider.config(Balloon, {
    transform: /* istanbul ignore next */ (props, deprecated) => {
        if (props.alignment) {
            deprecated('alignment', 'alignEdge', 'Balloon');
            const { alignment, ...others } = props;
            props = { alignEdge: alignment === 'edge', ...others };
        }
        if (props.onCloseClick) {
            deprecated(
                'onCloseClick',
                'onVisibleChange(visible, [type = "closeClick"])',
                'Balloon'
            );
            const { onCloseClick, onVisibleChange, ...others } = props;
            const newOnVisibleChange = (visible, type) => {
                if (type === 'closeClick') {
                    onCloseClick();
                }
                if (onVisibleChange) {
                    onVisibleChange(visible, type);
                }
            };
            props = { onVisibleChange: newOnVisibleChange, ...others };
        }

        return props;
    },
});
