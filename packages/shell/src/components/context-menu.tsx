import { Menu } from '@alifd/next';
import { parseContextMenuAsReactNode, parseContextMenuProperties } from '@alilc/lowcode-utils';
import { engineConfig } from '@alilc/lowcode-editor-core';
import { IPublicTypeContextMenuAction } from '@alilc/lowcode-types';
import React from 'react';

export function ContextMenu({ children, menus }: {
  menus: IPublicTypeContextMenuAction[];
  children: React.ReactElement[];
}): React.ReactElement<any, string | React.JSXElementConstructor<any>>[] {
  if (!engineConfig.get('enableContextMenu')) {
    return children;
  }

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target;
    const { top, left } = target?.getBoundingClientRect();
    let destroyFn: Function | undefined;
    const destroy = () => {
      destroyFn?.();
    };
    const children: React.ReactNode[] = parseContextMenuAsReactNode(parseContextMenuProperties(menus, {
      destroy,
    }));

    const menuInstance = Menu.create({
      target: event.target,
      offset: [event.clientX - left, event.clientY - top],
      children,
    });

    destroyFn = (menuInstance as any).destroy;
  };

  // 克隆 children 并添加 onContextMenu 事件处理器
  const childrenWithContextMenu = React.Children.map(children, (child) =>
    React.cloneElement(
      child,
      { onContextMenu: handleContextMenu },
    ));

  return childrenWithContextMenu;
}