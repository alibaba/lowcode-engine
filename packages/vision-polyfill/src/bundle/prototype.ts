import { assign, flow, get, isFunction, isObject } from 'lodash';
import { Component, ComponentClass } from 'react';
import { Node } from '../../core/pages/node';
import Prop from '../../core/pages/prop';

export enum DISPLAY_TYPE {
  NONE = 'none',
  PLAIN = 'plain',
  INLINE = 'inline',
  BLOCK = 'block',
  ACCORDION = 'accordion',
  TAB = 'tab',
  ENTRY = 'entry',
}

let PID = 0;
const GlobalNodeCanDragConfig: Array<(node: Node | false) => {}> = [];
const GlobalPropsReducers: any[] = [];
const GlobalPropsConfigure: IGlobalPropConfig[] = [
  {
    position: 'bottom',
    title: '条件渲染',
    type: 'group',
    name: '',
    display: DISPLAY_TYPE.ACCORDION,
    collapsed: true,
    tip: {
      content: '点击查看详细用法',
      url: 'https://yuque.antfin-inc.com/legao/help3.0/conditional-render',
    },
    items: [
      {
        name: '___condition___',
        title: '是否渲染',
        display: DISPLAY_TYPE.INLINE,
        initialValue: true,
        supportVariable: true,
        setter: 'Switch',
      },
    ],
    disabled() {
      const proto = this.getProps()
        .getNode()
        .getPrototype();
      if (!proto) {
        return true;
      }
      if (!proto.canUseCondition()) {
        return true;
      }
      return false;
    },
  },
  {
    position: 'bottom',
    title: '循环渲染',
    type: 'group',
    name: '',
    display: DISPLAY_TYPE.ACCORDION,
    collapsed: true,
    tip: {
      content: '点击查看详细用法',
      url: 'https://yuque.antfin-inc.com/legao/help3.0/loop-render',
    },
    items: [
      {
        name: '___loop___',
        title: '循环数据',
        display: DISPLAY_TYPE.INLINE,
        setter: 'Object',
        supportVariable: true,
      },
      {
        name: '___loopArgs___',
        title: '循环参数',
        display: DISPLAY_TYPE.INLINE,
        initialValue: ['item', 'index'],
        setter: 'Object',
      },
      {
        name: 'key',
        title: '循环key111',
        display: DISPLAY_TYPE.INLINE,
        initialValue: '',
        setter: 'Input',
        ignore() {
          if (this.getValue() || this.getVariableValue()) {
            return false;
          }
          return true;
        },
        supportVariable: true,
      },
    ],
    disabled() {
      const proto = this.getProps()
        .getNode()
        .getPrototype();
      if (!proto) {
        return true;
      }
      if (!proto.canLoop()) {
        return true;
      }
      return false;
    },
  },
];
const GlobalExtraActions: any[] = [];
const Overrides: any = {};

function addGlobalPropsReducer(reducer: () => any) {
  GlobalPropsReducers.push(reducer);
}

function addGlobalPropsConfigure(config: IGlobalPropConfig) {
  GlobalPropsConfigure.push(config);
}

function addGlobalExtraActions(actions: () => React.Component[]) {
  GlobalExtraActions.push(actions);
}

function addGlobalNodeCanDragConfig(drag: () => boolean) {
  if (!isFunction(drag)) {
    /* tslint:disable no-console */
    console.error('ERROR: the global canDrag configure should be a function.');
    return;
  }
  GlobalNodeCanDragConfig.push(drag);
}

function removeGlobalPropsConfigure(name: string) {
  let l = GlobalPropsConfigure.length;
  while (l-- > 0) {
    if (GlobalPropsConfigure[l].name === name) {
      GlobalPropsConfigure.splice(l, 1);
    }
  }
}

function overridePropsConfigure(componentName: string, configure: any) {
  Overrides[componentName] = configure;
}

export interface ISetterConfig {
  title?: string;
  setter?: ComponentClass;
  componentName?: string;
  props?: object;
  initialValue?: any;
  // use value to decide whether this setter is available
  condition?: (value: any) => boolean;
}

export type SetterGetter = (this: Prop, value: any) => ComponentClass;

type ReturnBooleanFunction = () => boolean;

export interface IPropConfig {
  /**
   * composite share the namespace
   * group just be tie up together
   */
  type?: 'composite' | 'group';
  /**
   * when type is composite or group
   */
  items?: IPropConfig[];
  /**
   * property name: the field key in props of schema
   */
  name: string;
  title?: string;
  tip?: {
    title?: string;
    content?: string;
    url?: string;
  };
  initialValue?: any;
  defaultValue?: any;
  display?: DISPLAY_TYPE;
  fieldStyle?: DISPLAY_TYPE;
  setter?: ComponentClass | ISetterConfig[] | string | SetterGetter;
  /**
   * if a prop is dynamicProp, every-time while rendering setting field
   *  - getValue() will not include value of getHotValue()
   *  - getValue() will trigger accessor() to calculate a new value
   * this prop usually work out when we need to generate prop value
   * from node of current page
   */
  isDynamicProp?: boolean;
  supportVariable?: boolean;
  /**
   * the prop should be collapsed while display value is accordion
   */
  collapse?: boolean;
  /**
   * alias to collapse
   */
  collapsed?: boolean;
  fieldCollapsed?: boolean;
  /**
   * if a prop is declared as disabled, it will not be saved into
   * schema
   */
  disabled?: boolean | ReturnBooleanFunction;
  /**
   * will not export data to schema
   */
  ignore?: boolean | ReturnBooleanFunction;
  /**
   * if a prop is declared as virtual, it will not be saved in
   * schema props, instead it will be saved into context field
   */
  virtual?: boolean | ReturnBooleanFunction;
  hidden?: boolean | ReturnBooleanFunction;
  /**
   * if a prop is a lifeCycle function
   */
  lifeCycle?: boolean;
  destroy?: () => any;
  initial?(this: Prop, value: any, initialValue: any): any;
  /**
   * when use getValue(), accessor shall be called as initializer
   */
  accessor?(this: Prop): any;
  /**
   * when current prop value mutate, the mutator function shall be called
   */
  mutator?(this: Prop, value: any, hotValue: any, preValue: any, preHotValue: any): void;
  /**
   * other values' change will trigger sync function here
   */
  sync?(this: Prop, value: any): void;
  /**
   * transform runtime data between view and setter
   * @param toHotValue hot value for the setter
   * @param toViewValue static value for the view
   */
  transformer?(toHotValue: (data: any) => any, toViewValue: (str: string) => any): any;
  /**
   * user click var to change current field to
   * variable setting field
   */
  useVariableChange?(data: { isUseVariable: boolean }): any;
}

export interface IGlobalPropConfig extends IPropConfig {
  position?: 'top' | 'bottom' | { [key in 'before' | 'after']: { prop: string; value: any } };
}

export interface SettingFieldConfig {
  type?: 'field';
  title?: string;
  name: string;
  setter: ComponentClass | ISetterConfig[] | string | SetterGetter;
  extraProps?: {
    [key: string]: any;
  };
}

export interface SettingGroupConfig {
  type: 'group';
  title?: string;
  items: Array<SettingGroupConfig | SettingFieldConfig>;
  extraProps?: {
    [key: string]: any;
  };
}

export interface ComponentDecoratorSpec {
  componentName: string;
  title?: string;
  description?: string;
  docUrl?: string;
  screenshot?: string;
  icon?: string;
  category?: string;
  tags?: string | string[];
  mode?: 'lowcode' | 'procode';
  uri?: string;
  npm?: {
    package: string;
    exportName?: string;
    subName?: string;
    destructuring?: boolean;
    main?: string;
    version: string;
  };
  props?: Array<{
    name: string;
    description?: string;
    propType: string | { type: string; value: any };
    defaultValue?: any;
  }>;
  configure?: {
    props?: Array<SettingGroupConfig | SettingFieldConfig>;
    component?: {
      isContainer?: boolean;
      isModal?: boolean;
      descriptor?: string;
      nestingRule?: {
        childWhitelist?: string[];
        parentWhitelist?: string[];
      };
    };
    callbacks?: object;
  };
}

export interface ISnippet {
  screenshot: string;
  label: string;
  schema: any;
}

function toPropConfig(configure: Array<SettingFieldConfig | SettingGroupConfig>): IPropConfig[] {
  if (!configure) {
    return [];
  }
  return configure.map((item) => {
    if (item.type === 'group') {
      return {
        type: 'group',
        name: '',
        title: item.title,
        items: toPropConfig(item.items),
        ...item.extraProps,
      };
    } else {
      return {
        name: item.name,
        title: item.title,
        // defaultValue: any,
        setter: item.setter,
        supportVariable: true,
        ...item.extraProps,
      };
    }
  });
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

function getSubComponent(component: any, paths: string[] | string) {
  if (!Array.isArray(paths)) {
    paths = paths.split('.');
  }
  const l = paths.length;
  if (l < 1) {
    return component;
  }
  if (l === 1 && paths[0] === 'default') {
    try {
      if ((component as any).default) {
        return (component as any).default;
      }
      return component;
    } catch (e) {
      return null;
    }
  }
  let i = 0;
  while (i < l) {
    const key = paths[i]!;
    try {
      component = (component as any)[key];
    } catch (e) {
      return null;
    }
    if (!component) {
      return null;
    }
    i++;
  }
  return component;
}

function getViewByURI(uri: string): any {
  const [packName, paths] = uri.split(':');
  const component = getPackage(packName);
  if (!paths) {
    return component;
  }
  return getSubComponent(component, paths);
}

function generateConfigure(
  props: Array<{
    name: string;
    propType: string | { type: string; value: any };
    defaultValue?: any;
    description?: string;
  }>,
): any {
  return [];
}

function npmToURI(npm: {
  package: string;
  exportName?: string;
  subName?: string;
  destructuring?: boolean;
  main?: string;
  version: string;
}): string {
  const pkg = [];
  if (npm.package) {
    pkg.push(npm.package);
  }
  if (npm.main) {
    if (npm.main[0] === '/') {
      pkg.push(npm.main.slice(1));
    } else if (npm.main.slice(0, 2) === './') {
      pkg.push(npm.main.slice(2));
    } else {
      pkg.push(npm.main);
    }
  }

  let uri = pkg.join('/');
  uri += `:${npm.destructuring && npm.exportName ? npm.exportName : 'default'}`;

  if (npm.subName) {
    uri += `.${npm.subName}`;
  }

  return uri;
}

function toOlderSpec(options: ComponentDecoratorSpec): IComponentPrototypeConfigure {
  const uri = options.uri || npmToURI(options.npm);
  const spec: any = {
    packageName: options.npm ? options.npm.package : '',
    category: options.category || (Array.isArray(options.tags) ? options.tags[0] : options.tags),
    componentName: options.componentName,
    docUrl: options.docUrl,
    defaultProps: {},
    title: options.title,
    icon: options.icon,
    uri,
    view: getViewByURI(uri),
    configure:
      options.configure && options.configure.props
        ? toPropConfig(options.configure.props)
        : generateConfigure(options.props),
  };

  if (options.configure && options.configure.component) {
    if (options.configure.component.isModal) {
      spec.isModal = true;
    }
    if (options.configure.component.isContainer) {
      spec.isContainer = true;
    }
    if (options.configure.component.descriptor) {
      spec.descriptor = options.configure.component.descriptor;
    }
    if (options.configure.component.nestingRule) {
      if (options.configure.component.nestingRule.childWhitelist) {
        spec.canDropIn = options.configure.component.nestingRule.childWhitelist;
      }
      if (options.configure.component.nestingRule.parentWhitelist) {
        spec.canDropTo = options.configure.component.nestingRule.parentWhitelist;
      }
    }
  }

  return spec;
}

function isNewSpec(options: any): options is ComponentDecoratorSpec {
  return (
    options &&
    (options.npm || options.props || (options.configure && (options.configure.props || options.configure.component)))
  );
}

export declare interface IComponentPrototypeConfigure {
  packageName: string;
  uri?: string;
  /**
   * category display in the component pane
   * component will be hidden while the value is: null
   */
  category: string;
  componentName: string;
  docUrl?: string;
  defaultProps?: any;
  /**
   * extra actions on the outline of current selected node
   * by default we have: remove / clone
   */
  extraActions?: Component[];
  title?: string;
  icon?: Component;
  view: Component;
  initialChildren?: (props: any) => any[];

  /**
   * Props configurations of node
   */
  configure: IPropConfig[];
  snippets?: ISnippet[];
  transducers?: any;
  reducers?: any;
  /**
   * Selector expression rectangle of a node, it is usually a querySelector string
   * @example '.classname > div'
   */
  rectSelector?: string;
  context?: {
    [contextInfoName: string]: any;
  };

  isContainer?: boolean;
  isInline?: boolean;
  isModal?: boolean;
  isFloating?: boolean;
  descriptor?: string;

  /**
   * enable slot-mode
   * @see https://yuque.antfin-inc.com/legao/solutions/atgtdl
   */
  hasSlot?: boolean;

  // alias to canDragging
  canDraging?: boolean;
  canDragging?: boolean;

  canOperating?: boolean;
  canHovering?: boolean;
  canSelecting?: boolean;
  canUseCondition?: boolean;
  canLoop?: boolean;
  canContain?: (dragment: Node) => boolean;

  canDropTo?: ((container: Node) => boolean) | string | string[];
  canDropto?: (container: Node) => boolean;

  canDropIn?: ((dragment: Node) => boolean) | string | string[];
  canDroping?: (dragment: Node) => boolean;

  didDropOut?: (container: any | Prototype, dragment: any) => boolean;
  didDropIn?: (container: any | Prototype, dragment: any) => boolean;

  canResizing?: ((dragment: Node, triggerDirection: string) => boolean) | boolean;
  onResizeStart?: (e: MouseEvent, triggerDirection: string, dragment: Node) => void;
  onResize?: (e: MouseEvent, triggerDirection: string, dragment: Node, moveX: number, moveY: number) => void;
  onResizeEnd?: (e: MouseEvent, triggerDirection: string, dragment: Node) => void;

  /**
   * when sub-node of the current node changed
   * including: sub-node insert / remove
   */
  subtreeModified?(this: Node): any;
}

export interface IComponentPrototypeExtraConfigs {
  autoGenerated?: boolean;
}

class Prototype {
  static addGlobalNodeCanDragConfig = addGlobalNodeCanDragConfig;
  static addGlobalPropsReducer = addGlobalPropsReducer;
  static addGlobalPropsConfigure = addGlobalPropsConfigure;
  static addGlobalExtraActions = addGlobalExtraActions;
  static removeGlobalPropsConfigure = removeGlobalPropsConfigure;
  static overridePropsConfigure = overridePropsConfigure;
  static create = function create(
    options: IComponentPrototypeConfigure | ComponentDecoratorSpec,
    extraConfigs: IComponentPrototypeExtraConfigs = {},
  ) {
    return new Prototype(options, extraConfigs);
  };

  private options: IComponentPrototypeConfigure;
  private id: string;
  private packageName: string;
  private componentName: string;
  private category: string;
  private view: ComponentClass;

  /**
   * is this prototype auto-generated by prototypeMocker
   * from a normal VIEW file (React Component Class)
   */
  private autoGenerated = false;

  constructor(
    options: IComponentPrototypeConfigure | ComponentDecoratorSpec,
    extraConfigs: IComponentPrototypeExtraConfigs = {},
  ) {
    this.options = isNewSpec(options) ? toOlderSpec(options) : options;
    this.id = `prototype-${PID++}`;
    if (extraConfigs.autoGenerated) {
      this.autoGenerated = extraConfigs.autoGenerated;
    }
    if (this.options.hasSlot && !this.isContainer()) {
      this.options.isContainer = true;
      this.options.canDropIn = () => false;
    }
  }

  getId() {
    return this.id;
  }

  getUri() {
    return this.options.uri;
  }

  getConfig(configName?: keyof IComponentPrototypeConfigure) {
    if (configName) {
      return this.options[configName];
    }
    return this.options;
  }

  getPackageName() {
    return this.packageName || this.options.packageName;
  }

  getContextInfo(name?: string): any {
    return name ? get(this.options, ['context', name], '') : this.options;
  }

  getTitle() {
    return this.options.title || this.getComponentName();
  }

  getComponentName() {
    return this.componentName || this.options.componentName || null;
  }

  getDocUrl() {
    return this.options.docUrl;
  }

  getDefaultProps() {
    return this.options.defaultProps || {};
  }

  getPropConfigs() {
    return this.options;
  }

  getExtraActions() {
    let extraActions = this.options.extraActions;
    if (!extraActions) {
      return GlobalExtraActions;
    }
    if (!Array.isArray(extraActions)) {
      extraActions = [extraActions];
    }
    return [...GlobalExtraActions, ...extraActions];
  }

  getCategory() {
    if (this.category !== undefined) {
      return this.category;
    }
    if (this.options.hasOwnProperty('category')) {
      return this.options.category;
    }
    return '*';
  }

  hasSlot() {
    return this.options.hasSlot;
  }

  setCategory(category: string) {
    this.category = category;
  }

  getIcon() {
    return this.options.icon || '';
  }

  setView(view: ComponentClass) {
    this.view = view;
  }

  getView() {
    return this.view || this.options.view || null;
  }

  getInitialChildren() {
    return this.options.initialChildren || null;
  }

  getConfigure() {
    let res = (this.options.configure || []).slice();
    GlobalPropsConfigure.forEach((config) => {
      const position = config.position || 'bottom';

      if (position === 'top') {
        res.unshift(config);
      } else if (position === 'bottom') {
        res.push(config);
      } else if (isObject(position.before || position.after)) {
        const { prop, value } = position.before || position.after;
        let index = -1;
        if (prop && value) {
          index = res.findIndex((e: any) => e[prop] === value);
        }
        if (index > -1) {
          if (position.hasOwnProperty('after')) {
            index += 1;
          }
          res.splice(index, 0, config);
        }
      }
    });

    const override = Overrides[this.getComponentName()];
    if (override) {
      if (Array.isArray(override)) {
        res = override;
      } else {
        let l = res.length;
        let item;
        while (l-- > 0) {
          item = res[l];
          if (item.name in override) {
            if (override[item.name]) {
              res.splice(l, 1, override[item.name]);
            } else {
              res.splice(l, 1);
            }
          }
        }
      }
    }
    return res;
  }

  getRectSelector() {
    return this.options.rectSelector;
  }

  isInline() {
    return this.options.isInline != null ? this.options.isInline : null;
  }

  isContainer() {
    if (isFunction(this.options.isContainer)) {
      return (this.options.isContainer as any)(this);
    }
    return this.options.isContainer != null ? this.options.isContainer : false;
  }

  isModal() {
    return this.options.isModal || false;
  }

  isFloating() {
    return this.options.isFloating || false;
  }

  isAutoGenerated() {
    return this.autoGenerated;
  }

  setPackageName(name: string) {
    this.packageName = name;
  }

  setComponentName(componentName: string) {
    this.componentName = componentName;
  }

  /**
   * transform value from hot-value to view
   */
  reduce(props: any) {
    let reducers = this.options.reducers || [];

    if (!Array.isArray(reducers)) {
      reducers = [reducers];
    }

    // prepend global reducers
    reducers = GlobalPropsReducers.concat(reducers);

    if (reducers.length < 1) {
      return props;
    }

    props = reducers.reduce((xprops: any, reducer: any) => {
      if (typeof reducer === 'function') {
        return reducer(xprops);
      }
      return xprops;
    }, props);
    return props;
  }

  transformToActive(props: any) {
    let transducers = this.options.transducers;
    if (!transducers) {
      return props;
    }
    if (!Array.isArray(transducers)) {
      transducers = [transducers];
    }
    props = transducers.reduce((xprops: any, transducer: any) => {
      if (transducer && typeof transducer.toActive === 'function') {
        return transducer.toActive(xprops);
      }
      return xprops;
    }, props);
    return props;
  }

  transformToStatic(props: any) {
    let transducers = this.options.transducers;
    if (!transducers) {
      return props;
    }
    if (!Array.isArray(transducers)) {
      transducers = [transducers];
    }
    props = transducers.reduce((xprops: any, transducer: any) => {
      if (transducer && typeof transducer.toStatic === 'function') {
        return transducer.toStatic(xprops);
      }
      return xprops;
    }, props);
    return props;
  }

  canDragging(node?: Node) {
    if (this.canSelecting()) {
      const draggable = this.options.canDragging === false || this.options.canDraging === false ? false : true;
      if (GlobalNodeCanDragConfig.length > 0) {
        if (!flow(GlobalNodeCanDragConfig)(node)) {
          return false;
        }
      }
      if (isFunction(draggable)) {
        return draggable.call(node, node);
      }
      return draggable;
    }
    return false;
  }

  canHovering() {
    return this.options.canHovering != null ? this.options.canHovering : true;
  }

  canSelecting() {
    return this.options.canSelecting != null ? this.options.canSelecting : true;
  }

  canOperating() {
    return this.options.canOperating != null ? this.options.canOperating : true;
  }

  canSetting() {
    return this.canSelecting();
  }

  canUseCondition() {
    return this.options.canUseCondition != null ? this.options.canUseCondition : true;
  }

  canLoop() {
    return this.options.canLoop != null ? this.options.canLoop : true;
  }

  canDropTo(container: Node) {
    if (!this.canDragging()) {
      return false;
    }

    const oCanDropTo = this.options.canDropTo != null ? this.options.canDropTo : this.options.canDropto;
    if (oCanDropTo != null) {
      return this.xcan(oCanDropTo, container);
    }
    return true;
  }

  canDropIn(dragment: Node) {
    const oCanDropIn = this.options.canDropIn != null ? this.options.canDropIn : this.options.canDroping;
    if (oCanDropIn != null) {
      return this.xcan(oCanDropIn, dragment);
    }
    return true;
  }

  didDropIn(dragment: Node, container: any) {
    const fn = this.options.didDropIn;
    if (typeof fn === 'function') {
      fn.call(container || this, dragment);
    }
  }

  didDropOut(dragment: Node, container: any) {
    const fn = this.options.didDropOut;
    if (typeof fn === 'function') {
      fn.call(container || this, dragment);
    }
  }

  canContain(dragment: Node) {
    const oCanContain = this.options.canContain;
    if (oCanContain != null) {
      return this.xcan(oCanContain, dragment);
    }
    return true;
  }

  clone(options: IComponentPrototypeConfigure) {
    return new Prototype(assign({}, this.options, options || {}));
  }

  private xcan(ocan: ((dragment: Node) => boolean) | string | string[], placement: Node): boolean;
  private xcan(ocan: any, placement: Node): boolean {
    const t = typeof ocan;
    if (t === 'function') {
      return ocan(placement);
    } else if (Array.isArray(ocan)) {
      return ocan.indexOf(placement.getComponentName()) > -1;
    } else if (t === 'string') {
      return (
        ocan
          .trim()
          .split(/[ ,;|]+/)
          .indexOf(placement.getComponentName()) > -1
      );
    }
    return ocan;
  }
}

export default Prototype;
