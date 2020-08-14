import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ShellBase from './shell';
import Base from './base';
import ConfigProvider from '../config-provider';

var Shell = ShellBase({
    componentName: 'Shell'
});

['Branding', 'Navigation', 'Action', 'MultiTask', 'LocalNavigation', 'AppBar', 'Content', 'Footer', 'Ancillary', 'ToolDock', 'ToolDockItem'].forEach(function (key) {
    Shell[key] = Base({
        componentName: key
    });
});

Shell.Page = ConfigProvider.config(ShellBase({
    componentName: 'Page'
}));

export default ConfigProvider.config(Shell, {
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('Component' in props) {
            deprecated('Component', 'component', 'Shell');

            var _props = props,
                Component = _props.Component,
                component = _props.component,
                others = _objectWithoutProperties(_props, ['Component', 'component']);

            if ('component' in props) {
                props = _extends({ component: component }, others);
            } else {
                props = _extends({ component: Component }, others);
            }
        }
        return props;
    }
});