/**
 * 拒绝
 */
export type REJECTED = 0 | false;
/**
 * 限制性的
 */
export type LIMITED = 2;
/**
 * 允许
 */
export type ALLOWED = true | 4;

export type HandleState = REJECTED | ALLOWED | LIMITED;

/*
 * model.editing:(dbclick) 父级优先（捕获过程）
 *   asCode(gotocode) 默认行为 select - option
 *   asRichText (运行值)
 *   asPlainText (运行值) 仅包含
 *   null|undefined 不响应（默认值）
 *   false 禁用 阻止继续捕获
 *   handle-function
 *
 * ## 检查与控制 handle
 *
 * model.shouldRemoveChild: HandleState | (my, child) => HandleState 移除子节点时（触发时），return false，拒绝移除
 * model.shouldMoveChild: HandleState | (my, child) => HandleState 移动子节点, return false: 拒绝移动;  return 0: 不得改变嵌套关系
 * model.shouldRemove: HandleState | (my) => HandleState
 * model.shouldMove:  HandleState | (my) => HandleState return false, 拒绝移动 return 0; 不得改变嵌套关系
 *
 * ## 类型嵌套检查 (白名单机制)
 *
 * 自定义 locate
 * model.locate: (my, transferData, mouseEvent?) => Location | null, 用于非 node 节点任意数据的定位
 *
 * test-RegExp: /^tagName./
 * test-List: 'tagName,tagName2' | ['tagName', 'tagName2']
 * test-Func: (target, my) => boolean
 * Tester: RegExp | Pattern | Func
 *
 * component.accept
 *   accept: '@CHILD'，从子节点寻找一个容器，针对 slot，比如 TabsLayout，ColumnsLayout, 大纲树误定位则错误信息透出，拒绝投入
 *   accept: false|null 表示不是一个容器，是一个端点，比如input，option
 *   accept: true 表示ok，无任何限制，比如 div,
 *   accept: Tester, 表示限定接受，作为filter条件，比如 select，不接受的主视图跳过定位，大纲树定位进去后红线提示
 * model.nesting 多级过滤，错误信息透出 (nextTick异步检查)，拒绝投入
 *   null | undefined | false | true 未设置 | 无意义值，不作拦截
 *   Tester
 * model.dropTarget
 *   Tester // 实时约束
 *   {
 *     highlight?: Tester | boolean, // 高亮，默认false，设为true时根据 parent | ancestor 取值
 *     parent?: Tester, // 实时约束，主视图限制定位，大纲树定位进去时红线提示
 *     ancestor?: Tester, // 异步检查，上文检查, 设置此值时，parent 可不设置
 *   }
 *   '@ROOT' 只能放根节点，不高亮，异步检查
 *   null | undefined | boolean 未设置|无意义值，不作拦截，不高亮
 *
 * 所有拒绝投放的，在结束时均会检查，并抖动提示原因
 *
 *
 * 1. 分栏容器嵌套栏/UL 嵌套 li 子嵌套约束
 * 2. Form 嵌套 Button, Input 后裔嵌套约束
 * 3. 数据实体 拖入 可接受目标，比如变量拖入富文本编辑器（@千緖）
 * 4. Li 拖拽时高亮所有 UL，根据Li设置的 dropTargetRules 目标规则筛选节点，取并集区域
 * 5. 能弹出提示
 *
 */


export interface BehaviorControl {
  handleMove?: HandleState | ((my: ElementNode) => HandleState);
  handleRemove?: HandleState | ((my: ElementNode) => HandleState);
  handleChildMove?: HandleState | ((my: ElementNode, child: INode) => HandleState);
  handleChildRemove?: HandleState | ((my: ElementNode, child: INode) => HandleState);
}

export const AT_CHILD = Symbol.for('@CHILD');
export const AT_ROOT = Symbol.for('@ROOT');
export type AT_ROOT = typeof AT_ROOT;
export type AT_CHILD = typeof AT_CHILD;

export type AcceptFunc = (
  my: ElementNode,
  e: LocateEvent | KeyboardEvent | MouseEvent,
) => LocationData | INodeParent | AT_CHILD | null;

// should appear couple
export interface AcceptControl {
  /**
   * MouseEvent: drag a entiy from browser out
   * KeyboardEvent: paste a entiy
   * LocateEvent: drag a entiy from pane
   */
  handleLocate?: AcceptFunc | AT_CHILD;
  handleAccept?: (my: ElementNode, locationData: LocationData) => void;
}

export interface ContentEditable {
  propTarget: string;
  selector?: string;
}

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
    extraActions,
    view,
    configure,
    defaultProps,
    initialChildren,
    snippets,
    transducers,
    isContainer,
    rectSelector,
    isModal,
    isFloating,
    descriptor,
    context,
    canOperating,
    canContain,
    canDropTo,
    canDropto,
    canDropIn,
    canDroping,
    // handles
    canDraging, canDragging, // handleDragging
    canResizing, // handleResizing
    // hooks
    didDropOut, // onNodeRemove
    didDropIn,  // onNodeAdd
    onResizeStart, // onResizeStart
    onResize, // onResize
    onResizeEnd, // onResizeEnd
    subtreeModified, // onSubtreeModified
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
  if (extraActions) {
    component.actions = extraActions.map((content) => {
      return {
        name: content.displayName || content.name || 'anonymous',
        content,
        important: true,
      };
    });
  }
  const nestingRule: any = {};
  if (canContain) {
    nestingRule.descendantWhitelist = canContain;
  }
  if (canDropTo || canDropto) {
    nestingRule.parentWhitelist = canDropTo || canDropto;
  }
  if (canDropIn || canDroping) {
    nestingRule.childWhitelist = canDropIn || canDroping;
  }
  component.nestingRule = nestingRule;

  if (canDragging || canDraging) {
    // hooks|handle
  }

  // 未考虑清楚的，放在实验性段落
  const experimental: any = {};
  if (context) {
    // for prototype.getContextInfo
    experimental.context = context;
  }

  const props = {};
  const styles = {};
  const events = {};
  meta.configure = { props, component, styles, events, experimental };

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
