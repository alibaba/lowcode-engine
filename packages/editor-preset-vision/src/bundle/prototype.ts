import { ComponentType, ReactElement, Component, FunctionComponent } from 'react';
import { ComponentMetadata, FieldConfig, InitialItem, FilterItem, AutorunItem, isI18nData } from '@ali/lowcode-types';
import {
  ComponentMeta,
  addBuiltinComponentAction,
  isComponentMeta,
  registerMetadataTransducer,
  TransformStage,
} from '@ali/lowcode-designer';
import {
  OldPropConfig,
  OldPrototypeConfig,
  upgradeMetadata,
  upgradeActions,
  upgradePropConfig,
  upgradeConfigure,
} from './upgrade-metadata';
import { intl } from '@ali/lowcode-editor-core';
import { designer } from '../editor';

const GlobalPropsConfigure: Array<{
  position: string;
  initials?: InitialItem[];
  filters?: FilterItem[];
  autoruns?: AutorunItem[];
  config: FieldConfig;
}> = [];
const Overrides: {
  [componentName: string]: {
    initials?: InitialItem[];
    filters?: FilterItem[];
    autoruns?: AutorunItem[];
    override: any;
  };
} = {};

function addGlobalPropsConfigure(config: OldGlobalPropConfig) {
  const initials: InitialItem[] = [];
  const filters: FilterItem[] = [];
  const autoruns: AutorunItem[] = [];
  GlobalPropsConfigure.push({
    position: config.position || 'bottom',
    initials,
    filters,
    autoruns,
    config: upgradePropConfig(config, {
      addInitial: (item) => {
        initials.push(item);
      },
      addFilter: (item) => {
        filters.push(item);
      },
      addAutorun: (item) => {
        autoruns.push(item);
      },
    }),
  });
}
function removeGlobalPropsConfigure(name: string) {
  let l = GlobalPropsConfigure.length;
  while (l-- > 0) {
    if (GlobalPropsConfigure[l].config.name === name) {
      GlobalPropsConfigure.splice(l, 1);
    }
  }
}
function overridePropsConfigure(componentName: string, config: { [name: string]: OldPropConfig } | OldPropConfig[]) {
  const initials: InitialItem[] = [];
  const filters: FilterItem[] = [];
  const autoruns: AutorunItem[] = [];
  const addInitial = (item: InitialItem) => {
    initials.push(item);
  };
  const addFilter = (item: FilterItem) => {
    filters.push(item);
  };
  const addAutorun = (item: AutorunItem) => {
    autoruns.push(item);
  };
  let override: any;
  if (Array.isArray(config)) {
    override = upgradeConfigure(config, { addInitial, addFilter, addAutorun });
  } else {
    override = {};
    Object.keys(config).forEach((key) => {
      override[key] = upgradePropConfig(config[key], { addInitial, addFilter, addAutorun });
    });
  }
  Overrides[componentName] = {
    initials,
    filters,
    autoruns,
    override,
  };
}
registerMetadataTransducer(
  (metadata) => {
    const {
      configure: { combined, props },
      componentName,
    } = metadata;
    let top: FieldConfig[];
    let bottom: FieldConfig[];
    if (combined) {
      top = combined?.[0].items || combined;
      bottom = combined?.[combined.length - 1].items || combined;
    } else if (props) {
      top = props;
      bottom = props;
    } else {
      metadata.configure.props = top = bottom = [];
    }

    GlobalPropsConfigure.forEach((item) => {
      const position = item.position || 'bottom';

      if (position === 'top') {
        top.unshift(item.config);
      } else if (position === 'bottom') {
        bottom.push(item.config);
      }
      // TODO: replace autoruns,initials,filters
    });

    const override = Overrides[componentName]?.override;
    if (override) {
      if (Array.isArray(override)) {
        metadata.configure.combined = override;
      } else {
        let l = top.length;
        let item;
        while (l-- > 0) {
          item = top[l];
          if (item.name in override) {
            if (override[item.name]) {
              top.splice(l, 1, override[item.name]);
            } else {
              top.splice(l, 1);
            }
          }
        }
      }
      // TODO: replace autoruns,initials,filters
    }

    return metadata;
  },
  100,
  'vision-polyfill',
);

function addGlobalExtraActions(action: () => ReactElement) {
  upgradeActions(action)?.forEach(addBuiltinComponentAction);
}

// const GlobalPropsReducers: any[] = [];
function addGlobalPropsReducer(reducer: () => any) {
  // GlobalPropsReducers.push(reducer);
  designer.addPropsReducer(reducer, TransformStage.Render);
}

export interface OldGlobalPropConfig extends OldPropConfig {
  position?: 'top' | 'bottom';
}

const packageMaps: any = {};

function accessLibrary(library: string | object) {
  if (typeof library !== 'string') {
    return library;
  }

  // TODO: enhance logic
  return (window as any)[library];
}

export function setPackages(packages: Array<{ package: string; library: object | string }>) {
  packages.forEach((item) => {
    let lib: any;
    if (packageMaps.hasOwnProperty(item.package)) {
      return;
    }
    Object.defineProperty(packageMaps, item.package, {
      get() {
        if (lib === undefined) {
          lib = accessLibrary(item.library);
        }
        return lib;
      },
    });
  });
}

export function getPackage(name: string): object | null {
  if (packageMaps.hasOwnProperty(name)) {
    return packageMaps[name];
  }

  return null;
}

function isNewSpec(options: any): options is ComponentMetadata {
  return (
    options &&
    (options.npm || options.props || (options.configure && (options.configure.props || options.configure.component)))
  );
}

class Prototype {
  static addGlobalPropsReducer = addGlobalPropsReducer;

  static addGlobalPropsConfigure = addGlobalPropsConfigure;

  static addGlobalExtraActions = addGlobalExtraActions;

  static removeGlobalPropsConfigure = removeGlobalPropsConfigure;

  static overridePropsConfigure = overridePropsConfigure;

  static create(config: OldPrototypeConfig | ComponentMetadata | ComponentMeta, extraConfigs: any = null, lookup = false) {
    return new Prototype(config, extraConfigs, lookup);
  }

  readonly isPrototype = true;

  readonly meta: ComponentMeta;

  readonly options: OldPrototypeConfig | ComponentMetadata;

  get componentName() {
    return this.getId();
  }

  get packageName() {
    return this.meta.npm?.package;
  }

  // 兼容原 vision 用法
  view: ComponentType | undefined;

  constructor(input: OldPrototypeConfig | ComponentMetadata | ComponentMeta, extraConfigs: any = null, lookup = false) {
    if (lookup) {
      this.meta = designer.getComponentMeta(input.componentName);
      this.options = this.meta.getMetadata();
      return this.meta.prototype || this;
    } else {
      if (isComponentMeta(input)) {
        this.meta = input;
        this.options = input.getMetadata();
      } else {
        this.options = input;
        const metadata = isNewSpec(input) ? input : upgradeMetadata(input);
        this.meta = designer.createComponentMeta(metadata);
      }
      (this.meta as any).prototype = this;
    }
  }

  getId() {
    return this.getComponentName();
  }

  getConfig(configName?: keyof (OldPrototypeConfig | ComponentMetadata)) {
    if (configName) {
      return this.options[configName];
    }
    return this.options;
  }

  getPackageName() {
    return this.packageName;
  }

  getContextInfo(name: string): any {
    return this.meta.getMetadata().experimental?.context?.[name];
  }

  getTitle() {
    return intl(this.meta.title);
  }

  getComponentName() {
    return this.meta.componentName;
  }

  getDocUrl() {
    return this.meta.getMetadata().docUrl;
  }

  getPropConfigs() {
    return this.options;
  }

  private category?: string;

  getCategory() {
    if (this.options.category != null) {
      return this.options.category;
    }

    return this.meta.getMetadata().tags?.[0] || '*';
  }

  setCategory(category: string) {
    this.options.category = category;
  }

  getIcon() {
    return this.meta.icon;
  }

  getConfigure() {
    return this.meta.configure;
  }

  getRectSelector() {
    return this.meta.rootSelector;
  }

  isContainer() {
    return this.meta.isContainer;
  }

  isModal() {
    return this.meta.isModal;
  }

  isAutoGenerated() {
    return false;
  }

  setPackageName(name: string) {
    this.meta.setNpm({
      package: name,
      componentName: this.getComponentName(),
    });
  }

  setView(view: ComponentType<any>) {
    this.view = view;
    const metadata = this.meta.getMetadata();
    if (!metadata.experimental) {
      metadata.experimental = {
        view,
      };
    } else {
      metadata.experimental.view = view;
    }
  }

  getView() {
    return (
      this.view ||
      this.meta.getMetadata().experimental?.view ||
      designer.currentDocument?.simulator?.getComponent(this.getComponentName())
    );
  }
}

export function isPrototype(obj: any): obj is Prototype {
  return obj && obj.isPrototype;
}

export default Prototype;
