import { ComponentType, ReactElement } from 'react';
import { ComponentMetadata, FieldConfig, InitialItem, FilterItem } from '@ali/lowcode-types';
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
import { designer } from '../editor';
import { uniqueId } from '@ali/lowcode-utils';

const GlobalPropsConfigure: Array<{
  position: string;
  initials?: InitialItem[];
  filters?: FilterItem[];
  config: FieldConfig
}> = [];
const Overrides: {
  [componentName: string]: {
    initials?: InitialItem[];
    filters?: FilterItem[];
    override: any;
  };
} = {};

function addGlobalPropsConfigure(config: OldGlobalPropConfig) {
  const initials: InitialItem[] = [];
  const filters: FilterItem[] = [];
  GlobalPropsConfigure.push({
    position: config.position || 'bottom',
    initials,
    filters,
    config: upgradePropConfig(config, {
      addInitial: (item) => {
        initials.push(item);
      },
      addFilter: (item) => {
        filters.push(item);
      },
    })
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
  const addInitial = (item: InitialItem) => {
    initials.push(item);
  };
  const addFilter = (item: FilterItem) => {
    filters.push(item);
  };
  let override: any;
  if (Array.isArray(config)) {
    override = upgradeConfigure(config, { addInitial, addFilter });
  } else {
    override = {};
    Object.keys(config).forEach(key => {
      override[key] = upgradePropConfig(config[key], { addInitial, addFilter });
    });
  }
  Overrides[componentName] = {
    initials,
    filters,
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
  static create(config: OldPrototypeConfig | ComponentMetadata | ComponentMeta) {
    return new Prototype(config);
  }

  private id: string;
  private meta: ComponentMeta;
  readonly options: OldPrototypeConfig | ComponentMetadata;

  constructor(input: OldPrototypeConfig | ComponentMetadata | ComponentMeta) {
    if (isComponentMeta(input)) {
      this.meta = input;
      this.options = input.getMetadata();
    } else {
      this.options = input;
      const metadata = isNewSpec(input) ? input : upgradeMetadata(input);
      this.meta = designer.createComponentMeta(metadata);
    }
    this.id = uniqueId('prototype');
  }

  getId() {
    return this.id;
  }

  getConfig(configName?: keyof (OldPrototypeConfig | ComponentMetadata)) {
    if (configName) {
      return this.options[configName];
    }
    return this.options;
  }

  getPackageName() {
    return this.meta.npm?.package;
  }

  getContextInfo(name: string): any {
    return this.meta.getMetadata().experimental?.context?.[name];
  }

  getTitle() {
    return this.meta.title;
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
    if (this.category != null) {
      return this.category;
    }

    return this.meta.getMetadata().tags?.[0] || '*';
  }

  setCategory(category: string) {
    this.category = category;
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
      this.meta.getMetadata().experimental?.view ||
      designer.currentDocument?.simulator?.getComponent(this.getComponentName())
    );
  }
}

export default Prototype;
