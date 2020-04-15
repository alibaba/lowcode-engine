export enum DISPLAY_TYPE {
  NONE = 'none',
  PLAIN = 'plain',
  INLINE = 'inline',
  BLOCK = 'block',
  ACCORDION = 'accordion',
  TAB = 'tab',
  ENTRY = 'entry',
}

export interface IPropConfig {
  /**
   * composite share the namespace
   * group just be tie up together
   */
  type?: 'composite' | 'group'; // => composite as objectSetter
  /**
   * when type is composite or group
   */
  items?: IPropConfig[]; // => items
  /**
   * property name: the field key in props of schema
   */
  name: string; // =>
  title?: string; // =>
  tip?: {
    // =>
    title?: string;
    content?: string;
    url?: string;
  };
  initialValue?: any; // => ?
  defaultValue?: any; // =>
  display?: DISPLAY_TYPE; // => fieldExtraProps
  fieldStyle?: DISPLAY_TYPE; // => fieldExtraProps
  setter?: ComponentClass | ISetterConfig[] | string | SetterGetter; // =>
  /**
   * if a prop is dynamicProp, every-time while rendering setting field
   *  - getValue() will not include value of getHotValue()
   *  - getValue() will trigger accessor() to calculate a new value
   * this prop usually work out when we need to generate prop value
   * from node of current page
   */
  isDynamicProp?: boolean;
  supportVariable?: boolean; // => use MixinSetter
  /**
   * the prop should be collapsed while display value is accordion
   */
  collapse?: boolean; // => extraProps.defaultCollapsed
  /**
   * alias to collapse
   */
  collapsed?: boolean; // => extraProps.defaultCollapsed
  fieldCollapsed?: boolean; // => extraProps.defaultCollapsed
  /**
   * if a prop is declared as disabled, it will not be saved into
   * schema
   */
  disabled?: boolean | ReturnBooleanFunction; // => hide & virtual ? thinkof global transform
  /**
   * will not export data to schema
   */
  ignore?: boolean | ReturnBooleanFunction; // => ?virtualProp ? thinkof global transform
  /**
   * if a prop is declared as virtual, it will not be saved in
   * schema props, instead it will be saved into context field
   */
  virtual?: boolean | ReturnBooleanFunction; // =>?virtualProp
  hidden?: boolean | ReturnBooleanFunction; // => condition
  /**
   * if a prop is a lifeCycle function
   */
  lifeCycle?: boolean; // =>?
  destroy?: () => any; // => x
  initial?(this: Prop, value: any, initialValue: any): any;
  /**
   * when use getValue(), accessor shall be called as initializer
   */
  accessor?(this: Prop): any; // => getValue
  /**
   * when current prop value mutate, the mutator function shall be called
   */
  mutator?( // => setValue
    this: Prop,
    value: any,
    hotValue: any, // => x
    preValue: any, // => x
    preHotValue: any, // => x
  ): void;
  /**
   * other values' change will trigger sync function here
   */
  sync?(this: Prop, value: any): void; // => ? autorun
  /**
   * transform runtime data between view and setter
   * @param toHotValue hot value for the setter
   * @param toViewValue static value for the view
   */
  transformer?( // =>?
    toHotValue: (data: any) => any,
    toViewValue: (str: string) => any,
  ): any;
  /**
   * user click var to change current field to
   * variable setting field
   */
  useVariableChange?(data: { isUseVariable: boolean }): any; // => ?
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

/**
 * 升级
 */
function upgradeMetadata(oldConfig: OldPrototypeConfig) {
  const {
    componentName,
    docUrl,
    title,
    icon,
    packageName,
    category,
    defaultProps,
    extraActions,
    view,
    initialChildren,
    configure,
    snippets,
    transducers,
    reducers,
    isContainer,
    rectSelector,
    isModal,
    isFloating,
    descriptor,
    context,
    hasSlot,
    canOperating,
    canDraging,
    canDragging,
    canSelecting,
    canContain,
    canDropTo,
    canDropto,
    canDropIn,
    canDroping,
    didDropOut,
    didDropIn,
    canResizing,
    onResizeStart,
    onResize,
    onResizeEnd,
    subtreeModified,
  } = oldConfig;


  const meta: any = {
    componentName,
    title,
    icon,
    docUrl,
    devMode: 'procode',
  }

  if (category) {
    meta.tags = [category];
  }
  if (packageName) {
    meta.npm = {
      componentName,
      package: packageName,
    };
  }

  const component: any = {
    isContainer,
    rectSelector,
    isModal,
    isFloating,
    descriptor,
  };

  if (canOperating === false) {
    component.disableBehaviors = '*';
  }
  nestingRule
  disableBehaviors
  actions
  const props = {};
  const styles = {};
  const events = {};
  meta.configure = { props, component, styles, events };

}

export interface OldPrototypeConfig {
  packageName: string; // => npm.package
  /**
   * category display in the component pane
   * component will be hidden while the value is: null
   */
  category: string; // => tags
  componentName: string; // =>
  docUrl?: string; // =>
  defaultProps?: any; // => ?
  /**
   * extra actions on the outline of current selected node
   * by default we have: remove / clone
   */
  extraActions?: Component[]; // => configure.component.actions
  title?: string; // =>
  icon?: Component; // =>
  view: Component; // => ?
  initialChildren?: (props: any) => any[]; // => snippets

  /**
   * Props configurations of node
   */
  configure: IPropConfig[]; // => configure.props
  snippets?: ISnippet[]; // => snippets
  transducers?: any; // => ?
  reducers?: any; // ?
  /**
   * Selector expression rectangle of a node, it is usually a querySelector string
   * @example '.classname > div'
   */
  rectSelector?: string; // => configure.component.rectSelector
  context?: {
    // => ?
    [contextInfoName: string]: any;
  };

  isContainer?: boolean; // => configure.component.isContainer
  isModal?: boolean; // => configure.component.isModal
  isFloating?: boolean; // => configure.component.isFloating
  descriptor?: string; // => configure.component.descriptor

  /**
   * enable slot-mode
   * @see https://yuque.antfin-inc.com/legao/solutions/atgtdl
   */
  hasSlot?: boolean; // => ?

  // alias to canDragging
  canDraging?: boolean; // => onDrag
  canDragging?: boolean; // => ?

  canOperating?: boolean; // => disabledActions
  canSelecting?: boolean;
  canContain?: (dragment: Node) => boolean; // => nestingRule

  canDropTo?: ((container: Node) => boolean) | string | string[]; // => nestingRule
  canDropto?: (container: Node) => boolean; // => nestingRule

  canDropIn?: ((dragment: Node) => boolean) | string | string[]; // => nestingRule
  canDroping?: (dragment: Node) => boolean; // => nestingRule

  didDropOut?: (container: any | Prototype, dragment: any) => boolean; // => hooks
  didDropIn?: (container: any | Prototype, dragment: any) => boolean; // => hooks

  // => ?
  canResizing?: ((dragment: Node, triggerDirection: string) => boolean) | boolean;
  onResizeStart?: (e: MouseEvent, triggerDirection: string, dragment: Node) => void;
  onResize?: (e: MouseEvent, triggerDirection: string, dragment: Node, moveX: number, moveY: number) => void;
  onResizeEnd?: (e: MouseEvent, triggerDirection: string, dragment: Node) => void;

  /**
   * when sub-node of the current node changed
   * including: sub-node insert / remove
   */
  subtreeModified?(this: Node): any; // => ? hooks
}
