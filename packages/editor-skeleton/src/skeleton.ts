import { action, makeObservable, obx, engineConfig, IEditor } from '@alilc/lowcode-editor-core';
import {
  DockConfig,
  PanelConfig,
  WidgetConfig,
  PanelDockConfig,
  DialogDockConfig,
  isDockConfig,
  isPanelDockConfig,
  isPanelConfig,
  DividerConfig,
  isDividerConfig,
} from './types';
import { isPanel, Panel } from './widget/panel';
import { WidgetContainer } from './widget/widget-container';
import { Area } from './area';
import { isWidget, IWidget, Widget } from './widget/widget';
import { PanelDock } from './widget/panel-dock';
import { Dock } from './widget/dock';
import { Stage, StageConfig } from './widget/stage';
import { isValidElement } from 'react';
import { isPlainObject, uniqueId, Logger } from '@alilc/lowcode-utils';
import { Divider } from '@alifd/next';
import {
  EditorConfig,
  PluginClassSet,
  IPublicTypeWidgetBaseConfig,
  IPublicTypeWidgetConfigArea,
  IPublicTypeSkeletonConfig,
  IPublicApiSkeleton,
} from '@alilc/lowcode-types';

const logger = new Logger({ level: 'warn', bizName: 'skeleton' });

export enum SkeletonEvents {
  PANEL_DOCK_ACTIVE = 'skeleton.panel-dock.active',
  PANEL_DOCK_UNACTIVE = 'skeleton.panel-dock.unactive',
  PANEL_SHOW = 'skeleton.panel.show',
  PANEL_HIDE = 'skeleton.panel.hide',
  WIDGET_SHOW = 'skeleton.widget.show',
  WIDGET_HIDE = 'skeleton.widget.hide',
  WIDGET_DISABLE = 'skeleton.widget.disable',
  WIDGET_ENABLE = 'skeleton.widget.enable',
}

export interface ISkeleton extends Omit<IPublicApiSkeleton,
  'showPanel' |
  'hidePanel' |
  'showWidget' |
  'enableWidget' |
  'hideWidget' |
  'disableWidget' |
  'showArea' |
  'onShowPanel' |
  'onHidePanel' |
  'onShowWidget' |
  'onHideWidget' |
  'remove' |
  'hideArea' |
  'add'
> {
  editor: IEditor;

  readonly leftArea: Area<DockConfig | PanelDockConfig | DialogDockConfig>;

  readonly topArea: Area<DockConfig | DividerConfig | PanelDockConfig | DialogDockConfig>;

  readonly subTopArea: Area<DockConfig | DividerConfig | PanelDockConfig | DialogDockConfig>;

  readonly toolbar: Area<DockConfig | DividerConfig | PanelDockConfig | DialogDockConfig>;

  readonly leftFixedArea: Area<PanelConfig, Panel>;

  readonly leftFloatArea: Area<PanelConfig, Panel>;

  readonly rightArea: Area<PanelConfig, Panel>;

  readonly mainArea: Area<WidgetConfig | PanelConfig, Widget | Panel>;

  readonly bottomArea: Area<PanelConfig, Panel>;

  readonly stages: Area<StageConfig, Stage>;

  readonly widgets: IWidget[];

  getPanel(name: string): Panel | undefined;

  getWidget(name: string): IWidget | undefined;

  buildFromConfig(config?: EditorConfig, components?: PluginClassSet): void;

  createStage(config: any): string | undefined;

  getStage(name: string): Stage | null;

  createContainer(
    name: string,
    handle: (item: any) => any,
    exclusive?: boolean,
    checkVisible?: () => boolean,
    defaultSetCurrent?: boolean,
  ): WidgetContainer;

  createPanel(config: PanelConfig): Panel;

  add(config: IPublicTypeSkeletonConfig, extraConfig?: Record<string, any>): IWidget | Widget | Panel | Stage | Dock | PanelDock | undefined;
}

export class Skeleton {
  private panels = new Map<string, Panel>();

  private containers = new Map<string, WidgetContainer<any>>();

  readonly leftArea: Area<DockConfig | PanelDockConfig | DialogDockConfig>;

  readonly topArea: Area<DockConfig | DividerConfig | PanelDockConfig | DialogDockConfig>;

  readonly subTopArea: Area<DockConfig | DividerConfig | PanelDockConfig | DialogDockConfig>;

  readonly toolbar: Area<DockConfig | DividerConfig | PanelDockConfig | DialogDockConfig>;

  readonly leftFixedArea: Area<PanelConfig, Panel>;

  readonly leftFloatArea: Area<PanelConfig, Panel>;

  readonly rightArea: Area<PanelConfig, Panel>;

  @obx readonly mainArea: Area<WidgetConfig | PanelConfig, Widget | Panel>;

  readonly bottomArea: Area<PanelConfig, Panel>;

  readonly stages: Area<StageConfig, Stage>;

  readonly widgets: IWidget[] = [];

  constructor(readonly editor: IEditor, readonly viewName: string = 'global') {
    makeObservable(this);
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
    this.subTopArea = new Area(
      this,
      'subTopArea',
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
    this.setupEvents();
  }

  /**
   * setup events
   *
   * @memberof Skeleton
   */
  setupEvents() {
    // adjust pinned status when panel shown
    this.editor.eventBus.on(SkeletonEvents.PANEL_SHOW, (panelName, panel) => {
      const panelNameKey = `${panelName}-pinned-status-isFloat`;
      const isInFloatAreaPreferenceExists = engineConfig.getPreference()?.contains(panelNameKey, 'skeleton');
      if (isInFloatAreaPreferenceExists) {
        const isInFloatAreaFromPreference = engineConfig.getPreference()?.get(panelNameKey, 'skeleton');
        const isCurrentInFloatArea = panel?.isChildOfFloatArea();
        if (isInFloatAreaFromPreference !== isCurrentInFloatArea) {
          this.toggleFloatStatus(panel);
        }
      }
    });
  }

  /**
   * set isFloat status for panel
   *
   * @param {*} panel
   * @memberof Skeleton
   */
  @action
  toggleFloatStatus(panel: Panel) {
    const isFloat = panel?.parent?.name === 'leftFloatArea';
    if (isFloat) {
      this.leftFloatArea.remove(panel);
      this.leftFixedArea.add(panel);
      this.leftFixedArea.container.active(panel);
    } else {
      this.leftFixedArea.remove(panel);
      this.leftFloatArea.add(panel);
      this.leftFloatArea.container.active(panel);
    }
    engineConfig.getPreference().set(`${panel.name}-pinned-status-isFloat`, !isFloat, 'skeleton');
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
        const config: IPublicTypeWidgetBaseConfig = {
          area: area as IPublicTypeWidgetConfigArea,
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
    this.editor.eventBus.emit(event, ...args);
  }

  createWidget(config: IPublicTypeWidgetBaseConfig | IWidget) {
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

  getWidget(name: string): IWidget | undefined {
    return this.widgets.find(widget => widget.name === name);
  }

  createPanel(config: PanelConfig) {
    const parsedConfig = this.parseConfig(config);
    const panel = new Panel(this, parsedConfig as PanelConfig);
    this.panels.set(panel.name, panel);
    logger.debug(`Panel created with name: ${panel.name} \nconfig:`, config, '\n current panels: ', this.panels);
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
    return stage?.getName?.();
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

  private parseConfig(config: IPublicTypeWidgetBaseConfig) {
    if (config.parsed) {
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

  add(config: IPublicTypeSkeletonConfig, extraConfig?: Record<string, any>): IWidget | Widget | Panel | Stage | Dock | PanelDock | undefined {
    const parsedConfig = {
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
        return this.leftArea.add(parsedConfig as PanelDockConfig);
      case 'rightArea':
      case 'right':
        return this.rightArea.add(parsedConfig as PanelConfig);
      case 'topArea':
      case 'top':
        return this.topArea.add(parsedConfig as PanelDockConfig);
      case 'subTopArea':
        return this.subTopArea.add(parsedConfig as PanelDockConfig);
      case 'toolbar':
        return this.toolbar.add(parsedConfig as PanelDockConfig);
      case 'mainArea':
      case 'main':
      case 'center':
      case 'centerArea':
        return this.mainArea.add(parsedConfig as PanelConfig);
      case 'bottomArea':
      case 'bottom':
        return this.bottomArea.add(parsedConfig as PanelConfig);
      case 'leftFixedArea':
        return this.leftFixedArea.add(parsedConfig as PanelConfig);
      case 'leftFloatArea':
        return this.leftFloatArea.add(parsedConfig as PanelConfig);
      case 'stages':
        return this.stages.add(parsedConfig as StageConfig);
      default:
        // do nothing
    }
  }
}
