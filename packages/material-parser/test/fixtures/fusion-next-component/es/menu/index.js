import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import ConfigProvider from '../config-provider';
import Menu from './view/menu';
import SubMenu from './view/sub-menu';
import SelectableItem from './view/selectable-item';
import CheckboxItem from './view/checkbox-item';
import RadioItem from './view/radio-item';
import PopupItem from './view/popup-item';
import Group from './view/group';
import Divider from './view/divider';
import create from './view/create';

Menu.SubMenu = SubMenu;
Menu.Item = SelectableItem;
Menu.CheckboxItem = CheckboxItem;
Menu.RadioItem = RadioItem;
Menu.PopupItem = PopupItem;
Menu.Group = Group;
Menu.Divider = Divider;
Menu.create = create;

/* istanbul ignore next */
var transform = function transform(props, deprecated) {
    if ('indentSize' in props) {
        deprecated('indentSize', 'inlineIndent', 'Menu');

        var _props = props,
            indentSize = _props.indentSize,
            others = _objectWithoutProperties(_props, ['indentSize']);

        props = _extends({ inlineIndent: indentSize }, others);
    }

    if ('onDeselect' in props) {
        deprecated('onDeselect', 'onSelect', 'Menu');
        if (props.onDeselect) {
            var _props2 = props,
                onDeselect = _props2.onDeselect,
                onSelect = _props2.onSelect,
                _others = _objectWithoutProperties(_props2, ['onDeselect', 'onSelect']);

            var newOnSelect = function newOnSelect(selectedKeys, item, extra) {
                if (!extra.select) {
                    onDeselect(extra.key);
                }
                if (onSelect) {
                    onSelect(selectedKeys, item, extra);
                }
            };

            props = _extends({ onSelect: newOnSelect }, _others);
        }
    }

    return props;
};

export default ConfigProvider.config(Menu, {
    transform: transform
});