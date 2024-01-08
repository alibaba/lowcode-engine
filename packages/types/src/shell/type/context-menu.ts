import { IPublicEnumContextMenuType } from '../enum';
import { IPublicModelNode } from '../model';
import { IPublicTypeI18nData } from './i8n-data';

export interface IPublicTypeContextMenuItem extends Omit<IPublicTypeContextMenuAction, 'condition' | 'disabled' | 'items'> {
  disabled?: boolean;

  items?: Omit<IPublicTypeContextMenuItem, 'items'>[];
}

export interface IPublicTypeContextMenuAction {

  /**
   * 动作的唯一标识符
   * Unique identifier for the action
   */
  name: string;

  /**
   * 显示的标题，可以是字符串或国际化数据
   * Display title, can be a string or internationalized data
   */
  title?: string | IPublicTypeI18nData;

  /**
   * 菜单项类型
   * Menu item type
   * @see IPublicEnumContextMenuType
   * @default IPublicEnumPContextMenuType.MENU_ITEM
   */
  type?: IPublicEnumContextMenuType;

  /**
   * 点击时执行的动作，可选
   * Action to execute on click, optional
   */
  action?: (nodes: IPublicModelNode[]) => void;

  /**
   * 子菜单项或生成子节点的函数，可选，仅支持两级
   * Sub-menu items or function to generate child node, optional
   */
  items?: Omit<IPublicTypeContextMenuAction, 'items'>[] | ((nodes: IPublicModelNode[]) => Omit<IPublicTypeContextMenuAction, 'items'>[]);

  /**
   * 显示条件函数
   * Function to determine display condition
   */
  condition?: (nodes: IPublicModelNode[]) => boolean;

  /**
   * 禁用条件函数，可选
   * Function to determine disabled condition, optional
   */
  disabled?: (nodes: IPublicModelNode[]) => boolean;
}

