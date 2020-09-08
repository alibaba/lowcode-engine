import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import Progress from './view/progress';

export default ConfigProvider.config(Progress, {
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('type' in props) {
            deprecated('type', 'progressive', 'Progress');

            var _props = props,
                type = _props.type,
                others = _objectWithoutProperties(_props, ['type']);

            props = _extends({ progressive: type === 'progressive' }, others);
        }

        if ('showInfo' in props) {
            deprecated('showInfo', 'textRender', 'Progress');

            var _props2 = props,
                showInfo = _props2.showInfo,
                _others = _objectWithoutProperties(_props2, ['showInfo']);

            if (showInfo) {
                props = _others;
            } else {
                props = _extends({ textRender: function textRender() {
                        return false;
                    } }, _others);
            }
        }

        if ('suffix' in props) {
            deprecated('suffix', 'textRender', 'Progress');

            var _props3 = props,
                suffix = _props3.suffix,
                _others2 = _objectWithoutProperties(_props3, ['suffix']);

            props = _extends({ textRender: function textRender() {
                    return suffix;
                } }, _others2);
        }

        return props;
    }
});