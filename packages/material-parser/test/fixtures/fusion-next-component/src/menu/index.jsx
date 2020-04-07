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
const transform = (props, deprecated) => {
    if ('indentSize' in props) {
        deprecated('indentSize', 'inlineIndent', 'Menu');

        const { indentSize, ...others } = props;
        props = { inlineIndent: indentSize, ...others };
    }

    if ('onDeselect' in props) {
        deprecated('onDeselect', 'onSelect', 'Menu');
        if (props.onDeselect) {
            const { onDeselect, onSelect, ...others } = props;
            const newOnSelect = (selectedKeys, item, extra) => {
                if (!extra.select) {
                    onDeselect(extra.key);
                }
                if (onSelect) {
                    onSelect(selectedKeys, item, extra);
                }
            };

            props = { onSelect: newOnSelect, ...others };
        }
    }

    return props;
};

export default ConfigProvider.config(Menu, {
    transform,
});
