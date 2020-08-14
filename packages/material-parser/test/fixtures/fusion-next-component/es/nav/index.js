import Menu from '../menu';
import Nav from './nav';
import Item from './item';
import Group from './group';
import SubNav from './sub-nav';
import PopupItem from './popup-item';

Nav.Item = Item;
Nav.Group = Group;
Nav.SubNav = SubNav;
Nav.PopupItem = PopupItem;
Nav.Divider = Menu.Divider;

export default Nav;