import { skeleton, editor } from './editor';
import { ReactElement } from 'react';
import { IWidgetBaseConfig } from '@ali/lowcode-editor-skeleton';

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
      onInit: init,
      onDestroy: destroy,
    },
    contentProps: props,
    index,
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
      isAction
    } = config;
    if (menu) {
      newConfig.props.title = menu;
    }
    if (!isAction) {
      newConfig.panelProps = {
        hideTitleBar,
        help: tip,
        width,
        maxWidth,
        height,
        maxHeight,
      };

      if (contents && Array.isArray(contents)) {
        newConfig.content = contents.map(({ title, content, tip }) => {
          return {
            type: "Panel",
            content,
            props: {
              title,
              help: tip,
            }
          }
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

  skeleton.add(upgradeConfig(config));
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
});
const dockPane = Object.assign(skeleton.leftArea, {
  /**
   * compatible *VE.dockPane.activeDock*
   */
  activeDock(item: any) {
    const name = item.name || item;
    skeleton.getPanel(name)?.active();
  },

  /**
   * compatible *VE.dockPane.onDockShow*
   */
  onDockShow(fn: (dock: any) => void): () => void {
    const f = (_: any, dock: any) => {
      fn(dock);
    };
    editor.on('skeleton.panel-dock.show', f);
    return () => {
      editor.removeListener('skeleton.panel-dock.show', f);
    };
  },
  /**
   * compatible *VE.dockPane.onDockHide*
   */
  onDockHide(fn: (dock: any) => void): () => void {
    const f = (_: any, dock: any) => {
      fn(dock);
    };
    editor.on('skeleton.panel-dock.hide', f);
    return () => {
      editor.removeListener('skeleton.panel-dock.hide', f);
    };
  },
  /**
   * compatible *VE.dockPane.setFixed*
   */
  setFixed(flag: boolean) {
    // todo:
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
    skeleton.stages.container.get(name);
  },

  createStage(config: any) {
    config = upgradeConfig(config);
    if (config.id) {
      config.name = config.id;
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
