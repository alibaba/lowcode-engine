import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import Cascader from './cascader';

export default ConfigProvider.config(Cascader, {
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('expandTrigger' in props) {
            deprecated('expandTrigger', 'expandTriggerType', 'Cascader');

            var _props = props,
                expandTrigger = _props.expandTrigger,
                others = _objectWithoutProperties(_props, ['expandTrigger']);

            props = _extends({ expandTriggerType: expandTrigger }, others);
        }

        if ('showItemCount' in props) {
            deprecated('showItemCount', 'listStyle | listClassName', 'Cascader');
        }
        if ('labelWidth' in props) {
            deprecated('labelWidth', 'listStyle | listClassName', 'Cascader');
        }

        return props;
    },
    exportNames: ['setFocusValue']
});