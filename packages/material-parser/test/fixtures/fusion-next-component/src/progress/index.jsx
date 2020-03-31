import ConfigProvider from '../config-provider';
import Progress from './view/progress';

export default ConfigProvider.config(Progress, {
    transform: /* istanbul ignore next */ (props, deprecated) => {
        if ('type' in props) {
            deprecated('type', 'progressive', 'Progress');

            const { type, ...others } = props;
            props = { progressive: type === 'progressive', ...others };
        }

        if ('showInfo' in props) {
            deprecated('showInfo', 'textRender', 'Progress');

            const { showInfo, ...others } = props;
            if (showInfo) {
                props = others;
            } else {
                props = { textRender: () => false, ...others };
            }
        }

        if ('suffix' in props) {
            deprecated('suffix', 'textRender', 'Progress');

            const { suffix, ...others } = props;
            props = { textRender: () => suffix, ...others };
        }

        return props;
    },
});
