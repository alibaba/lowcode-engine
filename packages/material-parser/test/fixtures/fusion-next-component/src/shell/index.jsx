import ShellBase from './shell';
import Base from './base';
import ConfigProvider from '../config-provider';

const Shell = ShellBase({
    componentName: 'Shell',
});

[
    'Branding',
    'Navigation',
    'Action',
    'MultiTask',
    'LocalNavigation',
    'AppBar',
    'Content',
    'Footer',
    'Ancillary',
    'ToolDock',
    'ToolDockItem',
].forEach(key => {
    Shell[key] = Base({
        componentName: key,
    });
});

Shell.Page = ConfigProvider.config(
    ShellBase({
        componentName: 'Page',
    })
);

export default ConfigProvider.config(Shell, {
    transform: /* istanbul ignore next */ (props, deprecated) => {
        if ('Component' in props) {
            deprecated('Component', 'component', 'Shell');
            const { Component, component, ...others } = props;
            if ('component' in props) {
                props = { component, ...others };
            } else {
                props = { component: Component, ...others };
            }
        }
        return props;
    },
});
