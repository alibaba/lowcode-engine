import { Editor } from '@ali/lowcode-editor-core';
import {
  DockConfig,
  PanelConfig,
  WidgetConfig,
  IWidgetBaseConfig,
  PanelDockConfig,
  DialogDockConfig,
  isDockConfig,
  isPanelDockConfig,
  isPanelConfig,
} from './types';
import Panel, { isPanel } from './panel';
import WidgetContainer from './widget-container';
import Area from './area';
import Widget, { isWidget, IWidget } from './widget';
import PanelDock from './panel-dock';
import Dock from './dock';
import { Stage, StageConfig } from './stage';
import { isValidElement } from 'react';

export enum SkeletonEvents {
  PANEL_DOCK_ACTIVE = 'skeleton.panel-dock.active',
  PANEL_DOCK_UNACTIVE = 'skeleton.panel-dock.unactive',
  PANEL_SHOW = 'skeleton.panel.show',
  PANEL_HIDE = 'skeleton.panel.hide',
  WIDGET_SHOW = 'skeleton.widget.show',
  WIDGET_HIDE = 'skeleton.widget.hide',
}

export class Skeleton {
  private panels = new Map<string, Panel>();
  private containers = new Map<string, WidgetContainer<any>>();
  readonly leftArea: Area<DockConfig | PanelDockConfig | DialogDockConfig>;
  readonly topArea: Area<DockConfig | PanelDockConfig | DialogDockConfig>;
  readonly toolbar: Area<DockConfig | PanelDockConfig | DialogDockConfig>;
  readonly leftFixedArea: Area<PanelConfig, Panel>;
  readonly leftFloatArea: Area<PanelConfig, Panel>;
  readonly rightArea: Area<PanelConfig, Panel>;
  readonly mainArea: Area<WidgetConfig | PanelConfig, Widget | Panel>;
  readonly bottomArea: Area<PanelConfig, Panel>;
  readonly stages: Area<StageConfig, Stage>;

  constructor(readonly editor: Editor) {
    this.leftArea = new Area(
      this,
      'leftArea',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      false,
    );
    this.topArea = new Area(
      this,
      'topArea',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      false,
    );
    this.toolbar = new Area(
      this,
      'toolbar',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      false,
    );
    this.leftFixedArea = new Area(
      this,
      'leftFixedArea',
      (config) => {
        if (isPanel(config)) {
          return config;
        }
        return this.createPanel(config);
      },
      true,
    );
    this.leftFloatArea = new Area(
      this,
      'leftFloatArea',
      (config) => {
        if (isPanel(config)) {
          return config;
        }
        return this.createPanel(config);
      },
      true,
    );
    this.rightArea = new Area(
      this,
      'rightArea',
      (config) => {
        if (isPanel(config)) {
          return config;
        }
        return this.createPanel(config);
      },
      true,
      true,
    );
    this.mainArea = new Area(
      this,
      'mainArea',
      (config) => {
        if (isWidget(config)) {
          return config as Widget;
        }
        return this.createWidget(config) as Widget;
      },
      true,
      true,
    );
    this.bottomArea = new Area(
      this,
      'bottomArea',
      (config) => {
        if (isPanel(config)) {
          return config;
        }
        return this.createPanel(config);
      },
      true,
    );
    this.stages = new Area(this, 'stages', (config) => {
      if (isWidget(config)) {
        return config;
      }
      return new Stage(this, config);
    });

    this.setupPlugins();
  }

  private setupPlugins() {
    const { config, componentsMap } = this.editor;
    const { plugins } = config;
    if (!plugins) {
      return;
    }
    Object.keys(plugins).forEach((area) => {
      plugins[area].forEach(item => {
        const { pluginKey, type, props = {}, pluginProps } = item;
        const config: any = {
          area,
          type: "Widget",
          name: pluginKey,
          contentProps: pluginProps,
        };
        const { dialogProps, balloonProps, panelProps, linkProps, ...restProps } = props;
        config.props = restProps;
        if (dialogProps) {
          config.dialogProps = dialogProps;
        }
        if (balloonProps) {
          config.balloonProps = balloonProps;
        }
        if (panelProps) {
          config.panelProps = panelProps;
        }
        if (linkProps) {
          config.linkProps = linkProps;
        }
        if (type === 'TabPanel') {
          config.type = 'Panel';
        } else if (/Icon$/.test(type)) {
          config.type = type.replace('Icon', 'Dock');
        }
        if (pluginKey in componentsMap) {
          config.content = componentsMap[pluginKey];
        }
        this.add(config);
      });
    })
  }

  postEvent(event: SkeletonEvents, ...args: any[]) {
    this.editor.emit(event, ...args);
  }

  createWidget(config: IWidgetBaseConfig | IWidget) {
    if (isWidget(config)) {
      return config;
    }
    if (isDockConfig(config)) {
      if (isPanelDockConfig(config)) {
        return new PanelDock(this, config);
      }

      return new Dock(this, config);
    }
    if (isPanelConfig(config)) {
      return this.createPanel(config);
    }
    return new Widget(this, config as WidgetConfig);
  }

  createPanel(config: PanelConfig) {
    const panel = new Panel(this, config);
    this.panels.set(panel.name, panel);
    return panel;
  }

  getPanel(name: string): Panel | undefined {
    return this.panels.get(name);
  }

  createContainer(
    name: string,
    handle: (item: any) => any,
    exclusive: boolean = false,
    checkVisible: () => boolean = () => true,
    defaultSetCurrent: boolean = false,
  ) {
    const container = new WidgetContainer(name, handle, exclusive, checkVisible, defaultSetCurrent);
    this.containers.set(name, container);
    return container;
  }

  add(config: IWidgetBaseConfig & { area: string }) {
    const { content, ...restConfig } = config;
    if (content) {
      if (typeof content === 'object' && !isValidElement(content)) {
        Object.keys(content).forEach(key => {
          if (/props$/i.test(key) && restConfig[key]) {
            restConfig[key] = {
              ...restConfig[key],
              ...content[key],
            };
          } else {
            restConfig[key] = content[key];
          }
        });
      } else {
        restConfig.content = content;
      }
    }
    const { area } = restConfig;
    switch (area) {
      case 'leftArea': case 'left':
        return this.leftArea.add(restConfig as any);
      case 'rightArea': case 'right':
        return this.rightArea.add(restConfig as any);
      case 'topArea': case 'top':
        return this.topArea.add(restConfig as any);
      case 'toolbar':
        return this.toolbar.add(restConfig as any);
      case 'mainArea': case 'main': case 'center': case 'centerArea':
        return this.mainArea.add(restConfig as any);
      case 'bottomArea': case 'bottom':
        return this.bottomArea.add(restConfig as any);
      case 'leftFixedArea':
        return this.leftFixedArea.add(restConfig as any);
      case 'leftFloatArea':
        return this.leftFloatArea.add(restConfig as any);
      case 'stages':
        return this.stages.add(restConfig as any);
    }
  }
}
