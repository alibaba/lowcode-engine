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
  mutator?(
    this: Prop,
    value: any,
    hotValue: any,
    preValue: any,
    preHotValue: any,
  ): void;
  /**
   * other values' change will trigger sync function here
   */
  sync?(this: Prop, value: any): void;
  /**
   * transform runtime data between view and setter
   * @param toHotValue hot value for the setter
   * @param toViewValue static value for the view
   */
  transformer?(
    toHotValue: (data: any) => any,
    toViewValue: (str: string) => any,
  ): any;
  /**
   * user click var to change current field to
   * variable setting field
   */
  useVariableChange?(data: { isUseVariable: boolean }): any;
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


export declare interface IComponentPrototypeConfigure {
  packageName: string; // => npm.package
  uri?: string;
  /**
   * category display in the component pane
   * component will be hidden while the value is: null
   */
  category: string; // => tags
  componentName: string;// =>
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
  context?: { // => ?
    [contextInfoName: string]: any;
  };

  isContainer?: boolean; // => configure.component.isContainer
  isInline?: boolean; // x
  isModal?: boolean; // => configure.component.isModal
  isFloating?: boolean; // => configure.component.isFloating
  descriptor?: string; // => configure.component.descriptor

  /**
   * enable slot-mode
   * @see https://yuque.antfin-inc.com/legao/solutions/atgtdl
   */
  hasSlot?: boolean; // => ?

  // alias to canDragging
  canDraging?: boolean; // => ?
  canDragging?: boolean; // => ?

  canOperating?: boolean; // => disabledActions
  canHovering?: boolean; // x
  canSelecting?: boolean;
  canUseCondition?: boolean; // x
  canLoop?: boolean; // x
  canContain?: (dragment: Node) => boolean; // => nestingRule

  canDropTo?: ((container: Node) => boolean) | string | string[]; // => nestingRule
  canDropto?: (container: Node) => boolean; // => nestingRule

  canDropIn?: ((dragment: Node) => boolean) | string | string[]; // => nestingRule
  canDroping?: (dragment: Node) => boolean; // => nestingRule

  didDropOut?: (container: any | Prototype, dragment: any) => boolean; // => hooks
  didDropIn?: (container: any | Prototype, dragment: any) => boolean; // => hooks

  // => ?
  canResizing?:
    | ((dragment: Node, triggerDirection: string) => boolean)
    | boolean;
  onResizeStart?: (
    e: MouseEvent,
    triggerDirection: string,
    dragment: Node,
  ) => void;
  onResize?: (
    e: MouseEvent,
    triggerDirection: string,
    dragment: Node,
    moveX: number,
    moveY: number,
  ) => void;
  onResizeEnd?: (
    e: MouseEvent,
    triggerDirection: string,
    dragment: Node,
  ) => void;

  /**
   * when sub-node of the current node changed
   * including: sub-node insert / remove
   */
  subtreeModified?(this: Node): any; // => ?
}

export interface IComponentPrototypeExtraConfigs {
  autoGenerated?: boolean;
}
