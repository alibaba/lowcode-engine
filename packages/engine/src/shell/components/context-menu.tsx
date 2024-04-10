import { createContextMenu, parseContextMenuAsReactNode, parseContextMenuProperties } from '@alilc/lowcode-utils';
import { engineConfig } from '@alilc/lowcode-editor-core';
import { IPublicModelPluginContext, IPublicTypeContextMenuAction } from '@alilc/lowcode-types';
import React, { useCallback } from 'react';

export function ContextMenu({ children, menus, pluginContext }: {
  menus: IPublicTypeContextMenuAction[];
  children: React.ReactElement[] | React.ReactElement;
  pluginContext: IPublicModelPluginContext;
}): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    let destroyFn: Function | undefined;
    const destroy = () => {
      destroyFn?.();
    };
    const children: React.ReactNode[] = parseContextMenuAsReactNode(parseContextMenuProperties(menus, {
      destroy,
      pluginContext,
    }), { pluginContext });

    if (!children?.length) {
      return;
    }

    destroyFn = createContextMenu(children, { event });
  }, [menus]);

  if (!engineConfig.get('enableContextMenu')) {
    return (
      <>{ children }</>
    );
  }

  if (!menus) {
    return (
      <>{ children }</>
    );
  }

  // 克隆 children 并添加 onContextMenu 事件处理器
  const childrenWithContextMenu = React.Children.map(children, (child) =>
    React.cloneElement(
      child,
      { onContextMenu: handleContextMenu },
    ));

  return (
    <>{childrenWithContextMenu}</>
  );
}

ContextMenu.create = (pluginContext: IPublicModelPluginContext, menus: IPublicTypeContextMenuAction[], event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();

  const children: React.ReactNode[] = parseContextMenuAsReactNode(parseContextMenuProperties(menus, {
    pluginContext,
  }), {
    pluginContext,
  });

  if (!children?.length) {
    return;
  }

  return createContextMenu(children, {
    event,
  });
};
