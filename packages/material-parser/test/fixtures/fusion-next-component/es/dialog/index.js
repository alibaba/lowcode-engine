import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import { log } from '../util';
import Dialog from './dialog';
import Inner from './inner';
import { show, alert, confirm } from './show';

Dialog.Inner = Inner;
Dialog.show = function (config) {
    var _ConfigProvider$getCo = ConfigProvider.getContextProps(config, 'Dialog'),
        warning = _ConfigProvider$getCo.warning;

    if (warning !== false) {
        config = processProps(config, log.deprecated);
    }
    return show(config);
};
Dialog.alert = function (config) {
    var _ConfigProvider$getCo2 = ConfigProvider.getContextProps(config, 'Dialog'),
        warning = _ConfigProvider$getCo2.warning;

    if (warning !== false) {
        config = processProps(config, log.deprecated);
    }
    return alert(config);
};
Dialog.confirm = function (config) {
    var _ConfigProvider$getCo3 = ConfigProvider.getContextProps(config, 'Dialog'),
        warning = _ConfigProvider$getCo3.warning;

    if (warning !== false) {
        config = processProps(config, log.deprecated);
    }
    return confirm(config);
};

/* istanbul ignore next */
function processProps(props, deprecated) {
    if ('closable' in props) {
        deprecated('closable', 'closeable', 'Dialog');

        var _props = props,
            closable = _props.closable,
            others = _objectWithoutProperties(_props, ['closable']);

        props = _extends({ closeable: closable }, others);
    }

    var overlayPropNames = ['target', 'offset', 'beforeOpen', 'onOpen', 'afterOpen', 'beforePosition', 'onPosition', 'cache', 'safeNode', 'wrapperClassName', 'container'];
    overlayPropNames.forEach(function (name) {
        if (name in props) {
            var _extends2;

            deprecated(name, 'overlayProps.' + name, 'Dialog');

            var _props2 = props,
                overlayProps = _props2.overlayProps,
                _others = _objectWithoutProperties(_props2, ['overlayProps']);

            var newOverlayProps = _extends((_extends2 = {}, _extends2[name] = props[name], _extends2), overlayProps || {});
            delete _others[name];
            props = _extends({ overlayProps: newOverlayProps }, _others);
        }
    });

    return props;
}

export default ConfigProvider.config(Dialog, {
    transform: function transform(props, deprecated) {
        return processProps(props, deprecated);
    }
});