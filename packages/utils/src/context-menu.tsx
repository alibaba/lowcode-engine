import { Menu, Icon } from '@alifd/next';
import { IDesigner } from '@alilc/lowcode-designer';
import { IPublicEnumContextMenuType, IPublicModelNode, IPublicTypeContextMenuAction, IPublicTypeContextMenuItem } from '@alilc/lowcode-types';
import { Logger } from '@alilc/lowcode-utils';
import React from 'react';
import './context-menu.scss';

const logger = new Logger({ level: 'warn', bizName: 'designer' });
const { Item, Divider, PopupItem } = Menu;

const MAX_LEVEL = 2;

const Tree = (props: {
  node?: IPublicModelNode;
  children?: React.ReactNode;
  options: {
    nodes?: IPublicModelNode[] | null;
    destroy?: Function;
    designer?: IDesigner;
  };
}) => {
  const { node } = props;

  if (!node) {
    return (
      <div className="context-menu-tree-wrap">{ props.children }</div>
    );
  }

  const commonUI = props.options.designer?.editor?.get('commonUI');

  const Title = commonUI?.Title;

  return (
    <Tree {...props} node={node.parent} >
      {props.options.nodes?.[0].id === node.id ? (<Icon className="context-menu-tree-selected-icon" size="small" type="success" />) : null}
      <Title title={node.title} />
      <div
        className="context-menu-tree-children"
      >
        <div
          className="context-menu-tree-bg"
          onClick={() => {
            props.options.destroy?.();
            node.select();
          }}
        >
          <div className="context-menu-tree-bg-inner" />
        </div>
        { props.children }
      </div>
    </Tree>
  );
};

export function parseContextMenuAsReactNode(menus: IPublicTypeContextMenuItem[], options: {
  nodes?: IPublicModelNode[] | null;
  destroy?: Function;
  designer?: IDesigner;
} = {}): React.ReactNode[] {
  const children: React.ReactNode[] = [];
  menus.forEach((menu, index) => {
    if (menu.type === IPublicEnumContextMenuType.SEPARATOR) {
      children.push(<Divider key={menu.name || index} />);
      return;
    }

    if (menu.type === IPublicEnumContextMenuType.MENU_ITEM) {
      if (menu.items && menu.items.length) {
        children.push((
          <PopupItem key={menu.name} label={menu.title}>
            <Menu className="next-context engine-context-menu">
              { parseContextMenuAsReactNode(menu.items, options) }
            </Menu>
          </PopupItem>
        ));
      } else {
        children.push((<Item disabled={menu.disabled} onClick={menu.action} key={menu.name}>{menu.title}</Item>));
      }
    }

    if (menu.type === IPublicEnumContextMenuType.NODE_TREE) {
      children.push((
        <Tree node={options.nodes?.[0]} options={options} />
      ));
    }
  });

  return children;
}

export function parseContextMenuProperties(menus: (IPublicTypeContextMenuAction | Omit<IPublicTypeContextMenuAction, 'items'>)[], options: {
  nodes?: IPublicModelNode[] | null;
  destroy?: Function;
}, level = 1): IPublicTypeContextMenuItem[] {
  const { nodes, destroy } = options;
  if (level > MAX_LEVEL) {
    logger.warn('context menu level is too deep, please check your context menu config');
    return [];
  }

  return menus.filter(menu => !menu.condition || (menu.condition && menu.condition(nodes || []))).map((menu) => {
    const {
      name,
      title,
      type = IPublicEnumContextMenuType.MENU_ITEM,
    } = menu;

    const result: IPublicTypeContextMenuItem = {
      name,
      title,
      type,
      action: () => {
        destroy?.();
        menu.action?.(nodes || []);
      },
      disabled: menu.disabled && menu.disabled(nodes || []) || false,
    };

    if ('items' in menu && menu.items) {
      result.items = parseContextMenuProperties(
        typeof menu.items === 'function' ? menu.items(nodes || []) : menu.items,
        options,
        level + 1,
      );
    }

    return result;
  });
}