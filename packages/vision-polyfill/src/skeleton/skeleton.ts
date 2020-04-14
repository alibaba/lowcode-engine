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
import Editor from '@ali/lowcode-editor-core';
import Panel, { isPanel } from './panel';
import WidgetContainer from './widget-container';
import Area from './area';
import Widget, { isWidget, IWidget } from './widget';
import PanelDock from './panel-dock';
import Dock from './dock';
import { Stage, StageConfig } from './stage';

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
    const { area } = config;
    switch (area) {
      case 'leftArea': case 'left':
        return this.leftArea.add(config as any);
      case 'rightArea': case 'right':
        return this.rightArea.add(config as any);
      case 'topArea': case 'top':
        return this.topArea.add(config as any);
      case 'toolbar':
        return this.toolbar.add(config as any);
      case 'mainArea': case 'main': case 'center': case 'centerArea':
        return this.mainArea.add(config as any);
      case 'bottomArea': case 'bottom':
        return this.bottomArea.add(config as any);
      case 'leftFixedArea':
        return this.leftFixedArea.add(config as any);
      case 'leftFloatArea':
        return this.leftFloatArea.add(config as any);
      case 'stages':
        return this.stages.add(config as any);
    }
  }
}
