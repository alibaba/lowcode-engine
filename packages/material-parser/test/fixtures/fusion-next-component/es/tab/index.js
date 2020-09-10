import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import Tab from './tab';
import Item from './tabs/tab-item';

Tab.Item = Item;

Tab.TabPane = ConfigProvider.config(Item, {
    transform: function transform(props, deprecated) {
        deprecated('Tab.TabPane', 'Tab.Item', 'Tab');
        return props;
    }
});

export default ConfigProvider.config(Tab, {
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        if ('type' in props) {
            deprecated('type', 'shape', 'Tab');

            var _props = props,
                type = _props.type,
                others = _objectWithoutProperties(_props, ['type']);

            props = _extends({ shape: type }, others);
        }
        if ('resDirection' in props) {
            var _props2 = props,
                resDirection = _props2.resDirection,
                _others = _objectWithoutProperties(_props2, ['resDirection']);

            var excessMode = void 0;
            if (resDirection === 'horizontal') {
                deprecated('resDirection=horizontal', 'excessMode=slide', 'Tab');

                excessMode = 'slide';
            } else if (resDirection === 'vertical') {
                deprecated('resDirection=vertical', 'excessMode=dropdown', 'Tab');

                excessMode = 'dropdown';
            }
            props = _extends({ excessMode: excessMode }, _others);
        }
        if ('tabBarExtraContent' in props) {
            deprecated('tabBarExtraContent', 'extra', 'Tab');

            var _props3 = props,
                tabBarExtraContent = _props3.tabBarExtraContent,
                _others2 = _objectWithoutProperties(_props3, ['tabBarExtraContent']);

            props = _extends({ extra: tabBarExtraContent }, _others2);
        }

        return props;
    }
});