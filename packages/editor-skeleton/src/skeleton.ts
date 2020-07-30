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
  DividerConfig,
  isDividerConfig
} from './types';
import Panel, { isPanel } from './widget/panel';
import WidgetContainer from './widget/widget-container';
import Area from './area';
import Widget, { isWidget, IWidget } from './widget/widget';
import PanelDock from './widget/panel-dock';
import Dock from './widget/dock';
import { Stage, StageConfig } from './widget/stage';
import { isValidElement } from 'react';
import { isPlainObject, uniqueId } from '@ali/lowcode-utils';
import { Divider } from '@alifd/next';
import { EditorConfig, PluginClassSet } from '@ali/lowcode-types';

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
  readonly topArea: Area<DockConfig | DividerConfig | PanelDockConfig | DialogDockConfig>;
  readonly toolbar: Area<DockConfig | DividerConfig | PanelDockConfig | DialogDockConfig>;
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
      false,
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

  buildFromConfig(config?: EditorConfig, components: PluginClassSet = {}) {
    if (config) {
      this.editor.init(config, components);
    }
    this.setupPlugins();
  }

  private setupPlugins() {
    const { config, components = {} } = this.editor;
    if (!config) {
      return;
    }

    const { plugins } = config;
    if (!plugins) {
      return;
    }
    Object.keys(plugins).forEach((area) => {
      plugins[area].forEach((item) => {
        const { pluginKey, type, props = {}, pluginProps } = item;
        const config: any = {
          area,
          type: 'Widget',
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
        if (pluginKey in components) {
          config.content = components[pluginKey];
        }
        this.add(config);
      });
    });
  }

  postEvent(event: SkeletonEvents, ...args: any[]) {
    this.editor.emit(event, ...args);
  }

  readonly widgets: IWidget[] = [];
  createWidget(config: IWidgetBaseConfig | IWidget) {
    if (isWidget(config)) {
      return config;
    }

    config = this.parseConfig(config);
    let widget: IWidget;
    if (isDockConfig(config)) {
      if (isPanelDockConfig(config)) {
        widget = new PanelDock(this, config);
      } else if (false) {
        // DialogDock
        // others...
      } else {

        widget = new Dock(this, config);
      }
    } else if (isDividerConfig(config)) {
      widget = new Widget(this, {
        ...config,
        type: 'Widget',
        content: Divider,
      });
    } else if (isPanelConfig(config)) {
      widget = this.createPanel(config);
    } else {
      widget = new Widget(this, config as WidgetConfig);
    }
    this.widgets.push(widget);
    return widget;
  }

  createPanel(config: PanelConfig) {
    config = this.parseConfig(config);
    const panel = new Panel(this, config);
    this.panels.set(panel.name, panel);
    return panel;
  }

  getPanel(name: string): Panel | undefined {
    return this.panels.get(name);
  }

  getStage(name: string) {
    return this.stages.container.get(name);
  }

  createStage(config: any) {
    const stage = this.add({
      name: uniqueId('stage'),
      area: 'stages',
      ...config,
    });
    return stage?.getName();
  }

  createContainer(
    name: string,
    handle: (item: any) => any,
    exclusive = false,
    checkVisible: () => boolean = () => true,
    defaultSetCurrent = false,
  ) {
    const container = new WidgetContainer(name, handle, exclusive, checkVisible, defaultSetCurrent);
    this.containers.set(name, container);
    return container;
  }

  private parseConfig(config: IWidgetBaseConfig): any {
    if ((config as any).parsed) {
      return config;
    }
    const { content, ...restConfig } = config;
    if (content) {
      if (isPlainObject(content) && !isValidElement(content)) {
        Object.keys(content).forEach((key) => {
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
    restConfig.pluginKey = restConfig.name;
    restConfig.parsed = true;
    return restConfig;
  }

  add(config: IWidgetBaseConfig & { area?: string }, extraConfig?: object) {
    const parsedConfig: any = {
      ...this.parseConfig(config),
      ...extraConfig,
    };
    let { area } = parsedConfig;
    if (!area) {
      if (parsedConfig.type === 'Panel') {
        area = 'leftFloatArea';
      } else if (parsedConfig.type === 'Widget') {
        area = 'mainArea';
      } else {
        area = 'leftArea';
      }
    }
    switch (area) {
      case 'leftArea':
      case 'left':
        return this.leftArea.add(parsedConfig);
      case 'rightArea':
      case 'right':
        return this.rightArea.add(parsedConfig);
      case 'topArea':
      case 'top':
        return this.topArea.add(parsedConfig);
      case 'toolbar':
        return this.toolbar.add(parsedConfig);
      case 'mainArea':
      case 'main':
      case 'center':
      case 'centerArea':
        return this.mainArea.add(parsedConfig);
      case 'bottomArea':
      case 'bottom':
        return this.bottomArea.add(parsedConfig);
      case 'leftFixedArea':
        return this.leftFixedArea.add(parsedConfig);
      case 'leftFloatArea':
        return this.leftFloatArea.add(parsedConfig);
      case 'stages':
        return this.stages.add(parsedConfig);
    }
  }
}
