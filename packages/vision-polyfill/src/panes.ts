import { skeleton, editor } from '@ali/lowcode-engine';
import { ReactElement } from 'react';
import { IWidgetBaseConfig } from '@ali/lowcode-editor-skeleton';
import { IconType } from '@ali/lowcode-types';
import { uniqueId } from '@ali/lowcode-utils';
import bus from './bus';

export interface IContentItemConfig {
  title: string;
  content: JSX.Element;
  tip?: {
    content: string;
    url?: string;
  };
}

export interface OldPaneConfig {
  // 'dock' | 'action' | 'tab' | 'widget' | 'stage'
  type?: string; // where

  id?: string;
  name: string;
  title?: string;
  content?: any;

  place?: string; // align: left|right|top|center|bottom
  description?: string; // tip?
  tip?:
  | string
  | {
    // as help tip
    url?: string;
    content?: string | JSX.Element;
  }; // help

  init?: () => any;
  destroy?: () => any;
  props?: any;

  contents?: IContentItemConfig[];
  hideTitleBar?: boolean;
  width?: number;
  maxWidth?: number;
  height?: number;
  maxHeight?: number;
  position?: string | string[]; // todo
  menu?: JSX.Element; // as title
  index?: number; // todo
  isAction?: boolean; // as normal dock
  fullScreen?: boolean; // todo
  canSetFixed?: boolean; // 是否可以设置固定模式
  defaultFixed?: boolean; // 是否默认固定
  enableDrag?: boolean;
  icon?: IconType; // 支持旧vision pane传icon （menu是title, 并非icon）
}

function upgradeConfig(config: OldPaneConfig): IWidgetBaseConfig & { area: string } {
  const { type, id, name, title, content, place, description, init, destroy, props, index } = config;

  const newConfig: any = {
    id,
    name,
    content,
    props: {
      title,
      description,
      align: place,
    },
    contentProps: props,
    index: index || props?.index,
  };

  if (type === 'dock') {
    newConfig.type = 'PanelDock';
    newConfig.area = 'left';
    newConfig.props.description = description || title;
    const {
      contents,
      hideTitleBar,
      tip,
      width,
      maxWidth,
      height,
      maxHeight,
      menu,
      icon,
      isAction,
      canSetFixed,
      defaultFixed,
      enableDrag,
    } = config;
    if (menu) {
      newConfig.props.title = menu;
    }
    if (icon) {
      newConfig.props.icon = icon;
    }
    if (isAction) {
      newConfig.type = 'Dock';
    } else {
      newConfig.panelProps = {
        title,
        hideTitleBar,
        help: tip,
        width,
        maxWidth,
        height,
        maxHeight,
        canSetFixed,
        enableDrag,
      };

      if (defaultFixed) {
        newConfig.panelProps.area = 'leftFixedArea';
      }

      if (contents && Array.isArray(contents)) {
        newConfig.content = contents.map(({ title, content, tip }, index) => {
          return {
            type: 'Panel',
            name: typeof title === 'string' ? title : `${name}:${index}`,
            content,
            contentProps: props,
            props: {
              title,
              help: tip,
            },
          };
        });
      }
    }
  } else if (type === 'action') {
    newConfig.area = 'top';
    newConfig.type = 'Dock';
  } else if (type === 'tab') {
    newConfig.area = 'right';
    newConfig.type = 'Panel';
  } else if (type === 'stage') {
    newConfig.area = 'stages';
    newConfig.type = 'Widget';
  } else {
    newConfig.area = 'main';
    newConfig.type = 'Widget';
  }
  newConfig.props.onInit = init;
  newConfig.props.onDestroy = destroy;
  return newConfig;
}

function add(config: (() => OldPaneConfig) | OldPaneConfig, extraConfig?: any) {
  if (typeof config === 'function') {
    config = config.call(null);
  }
  if (!config || !config.type) {
    return null;
  }
  if (extraConfig) {
    config = { ...config, ...extraConfig };
  }

  const upgraded = upgradeConfig(config);
  if (upgraded.area === 'stages') {
    if (upgraded.id) {
      upgraded.name = upgraded.id;
    } else if (!upgraded.name) {
      upgraded.name = uniqueId('stage');
    }
    const stage = skeleton.add(upgraded);
    return stage?.getName();
  } else {
    return skeleton.add(upgraded);
  }
}

const actionPane = Object.assign(skeleton.topArea, {
  /**
   * compatible *VE.actionPane.getActions*
   */
  getActions(): any {
    return skeleton.topArea.container.items;
  },
  /**
   * compatible *VE.actionPane.activeDock*
   */
  setActions() {
    // empty
  },
  get actions() {
    return skeleton.topArea.container.items;
  },
});
const dockPane = Object.assign(skeleton.leftArea, {
  /**
   * compatible *VE.dockPane.activeDock*
   */
  activeDock(item: any) {
    if (!item) {
      skeleton.leftFloatArea?.current?.hide();
      return;
    }
    const name = item.name || item;
    const pane = skeleton.getPanel(name);
    if (!pane) {
      console.warn(`Could not find pane with name ${name}`);
    }
    pane?.active();
    bus.emit('ve.dock_pane.active_doc', pane);
  },

  /**
   * compatible *VE.dockPane.onDockShow*
   */
  onDockShow(fn: (dock: any) => void): () => void {
    const f = (_: any, dock: any) => {
      fn(dock);
    };
    editor.on('skeleton.panel-dock.active', f);
    return () => {
      editor.removeListener('skeleton.panel-dock.active', f);
    };
  },
  /**
   * compatible *VE.dockPane.onDockHide*
   */
  onDockHide(fn: (dock: any) => void): () => void {
    const f = (_: any, dock: any) => {
      fn(dock);
    };
    editor.on('skeleton.panel-dock.unactive', f);
    return () => {
      editor.removeListener('skeleton.panel-dock.unactive', f);
    };
  },
  /**
   * compatible *VE.dockPane.setFixed*
   */
  setFixed(flag: boolean) {
    // todo:
  },
  getDocks() {
    return skeleton.leftFloatArea?.container.items;
  },
});
const tabPane = Object.assign(skeleton.rightArea, {
  setFloat(flag: boolean) {
    // todo:
  },
});
const toolbar = Object.assign(skeleton.toolbar, {
  setContents(contents: ReactElement) {
    // todo:
  },
});
const widgets = skeleton.mainArea;

const stages = Object.assign(skeleton.stages, {
  getStage(name: string) {
    return skeleton.stages.container.get(name);
  },

  createStage(config: any) {
    config = upgradeConfig(config);
    if (config.id) {
      config.name = config.id;
    } else if (!config.name) {
      config.name = uniqueId('stage');
    }

    const stage = skeleton.stages.add(config);
    return stage.getName();
  },
});

export default {
  ActionPane: actionPane, // topArea
  actionPane, //
  DockPane: dockPane, // leftArea
  dockPane,
  TabPane: tabPane, // rightArea
  tabPane,
  add,
  toolbar, // toolbar
  Stages: stages,
  Widgets: widgets, // centerArea
  widgets,
};
