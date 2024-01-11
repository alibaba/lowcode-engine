import { IPublicTypeContextMenuAction, IPublicEnumContextMenuType, IPublicTypeContextMenuItem, IPublicApiMaterial, IPublicModelPluginContext } from '@alilc/lowcode-types';
import { IDesigner, INode } from './designer';
import { createContextMenu, parseContextMenuAsReactNode, parseContextMenuProperties, uniqueId } from '@alilc/lowcode-utils';
import { Menu } from '@alifd/next';
import { engineConfig } from '@alilc/lowcode-editor-core';
import './context-menu-actions.scss';

export interface IContextMenuActions {
  actions: IPublicTypeContextMenuAction[];

  adjustMenuLayoutFn: (actions: IPublicTypeContextMenuItem[]) => IPublicTypeContextMenuItem[];

  addMenuAction: IPublicApiMaterial['addContextMenuOption'];

  removeMenuAction: IPublicApiMaterial['removeContextMenuOption'];

  adjustMenuLayout: IPublicApiMaterial['adjustContextMenuLayout'];
}

let adjustMenuLayoutFn: Function = (actions: IPublicTypeContextMenuAction[]) => actions;

export class GlobalContextMenuActions {
  enableContextMenu: boolean;

  dispose: Function[];

  contextMenuActionsMap: Map<string, ContextMenuActions> = new Map();

  constructor() {
    this.dispose = [];

    engineConfig.onGot('enableContextMenu', (enable) => {
      if (this.enableContextMenu === enable) {
        return;
      }
      this.enableContextMenu = enable;
      this.dispose.forEach(d => d());
      if (enable) {
        this.initEvent();
      }
    });
  }

  handleContextMenu = (
    event: MouseEvent,
  ) => {
    event.stopPropagation();
    event.preventDefault();

    const actions: IPublicTypeContextMenuAction[] = [];
    let contextMenu: ContextMenuActions = this.contextMenuActionsMap.values().next().value;
    this.contextMenuActionsMap.forEach((contextMenu) => {
      actions.push(...contextMenu.actions);
    });

    let destroyFn: Function | undefined;

    const destroy = () => {
      destroyFn?.();
    };
    const pluginContext: IPublicModelPluginContext = contextMenu.designer.editor.get('pluginContext') as IPublicModelPluginContext;

    const menus: IPublicTypeContextMenuItem[] = parseContextMenuProperties(actions, {
      nodes: [],
      destroy,
      event,
      pluginContext,
    });

    if (!menus.length) {
      return;
    }

    const layoutMenu = adjustMenuLayoutFn(menus);

    const menuNode = parseContextMenuAsReactNode(layoutMenu, {
      destroy,
      nodes: [],
      pluginContext,
    });

    const target = event.target;

    const { top, left } = target?.getBoundingClientRect();

    const menuInstance = Menu.create({
      target: event.target,
      offset: [event.clientX - left, event.clientY - top],
      children: menuNode,
      className: 'engine-context-menu',
    });

    destroyFn = (menuInstance as any).destroy;
  };

  initEvent() {
    this.dispose.push(
      (() => {
        const handleContextMenu = (e: MouseEvent) => {
          this.handleContextMenu(e);
        };

        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
          document.removeEventListener('contextmenu', handleContextMenu);
        };
      })(),
    );
  }

  registerContextMenuActions(contextMenu: ContextMenuActions) {
    this.contextMenuActionsMap.set(contextMenu.id, contextMenu);
  }
}

const globalContextMenuActions = new GlobalContextMenuActions();

export class ContextMenuActions implements IContextMenuActions {
  actions: IPublicTypeContextMenuAction[] = [];

  designer: IDesigner;

  dispose: Function[];

  enableContextMenu: boolean;

  id: string = uniqueId('contextMenu');;

  constructor(designer: IDesigner) {
    this.designer = designer;
    this.dispose = [];

    engineConfig.onGot('enableContextMenu', (enable) => {
      if (this.enableContextMenu === enable) {
        return;
      }
      this.enableContextMenu = enable;
      this.dispose.forEach(d => d());
      if (enable) {
        this.initEvent();
      }
    });

    globalContextMenuActions.registerContextMenuActions(this);
  }

  handleContextMenu = (
    nodes: INode[],
    event: MouseEvent,
  ) => {
    const designer = this.designer;
    event.stopPropagation();
    event.preventDefault();

    const actions = designer.contextMenuActions.actions;

    const { bounds } = designer.project.simulator?.viewport || { bounds: { left: 0, top: 0 } };
    const { left: simulatorLeft, top: simulatorTop } = bounds;

    let destroyFn: Function | undefined;

    const destroy = () => {
      destroyFn?.();
    };

    const pluginContext: IPublicModelPluginContext = this.designer.editor.get('pluginContext') as IPublicModelPluginContext;

    const menus: IPublicTypeContextMenuItem[] = parseContextMenuProperties(actions, {
      nodes: nodes.map(d => designer.shellModelFactory.createNode(d)!),
      destroy,
      event,
      pluginContext,
    });

    if (!menus.length) {
      return;
    }

    const layoutMenu = adjustMenuLayoutFn(menus);

    const menuNode = parseContextMenuAsReactNode(layoutMenu, {
      destroy,
      nodes: nodes.map(d => designer.shellModelFactory.createNode(d)!),
      pluginContext,
    });

    destroyFn = createContextMenu(menuNode, {
      event,
      offset: [simulatorLeft, simulatorTop],
    });
  };

  initEvent() {
    const designer = this.designer;
    this.dispose.push(
      designer.editor.eventBus.on('designer.builtinSimulator.contextmenu', ({
        node,
        originalEvent,
      }: {
        node: INode;
        originalEvent: MouseEvent;
      }) => {
        // 如果右键的节点不在 当前选中的节点中，选中该节点
        if (!designer.currentSelection.has(node.id)) {
          designer.currentSelection.select(node.id);
        }
        const nodes = designer.currentSelection.getNodes();
        this.handleContextMenu(nodes, originalEvent);
      }),
    );
  }

  addMenuAction(action: IPublicTypeContextMenuAction) {
    this.actions.push({
      type: IPublicEnumContextMenuType.MENU_ITEM,
      ...action,
    });
  }

  removeMenuAction(name: string) {
    const i = this.actions.findIndex((action) => action.name === name);
    if (i > -1) {
      this.actions.splice(i, 1);
    }
  }

  adjustMenuLayout(fn: (actions: IPublicTypeContextMenuItem[]) => IPublicTypeContextMenuItem[]) {
    adjustMenuLayoutFn = fn;
  }
}