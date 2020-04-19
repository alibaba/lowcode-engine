import { ComponentType, ReactElement, isValidElement, ComponentClass } from 'react';
import { isI18nData } from '@ali/lowcode-globals';

type Field = any;

export enum DISPLAY_TYPE {
  NONE = 'none',  // => condition'plain'
  PLAIN = 'plain',
  INLINE = 'inline',
  BLOCK = 'block',
  ACCORDION = 'accordion',
  TAB = 'tab', // => 'accordion'
  ENTRY = 'entry',
}

// from vision 5.4
export interface OldPropConfig {
  /**
   * composite share the namespace
   * group just be tie up together
   */
  type?: 'composite' | 'group'; // => composite as objectSetter
  /**
   * when type is composite or group
   */
  items?: OldPropConfig[]; // => items
  /**
   * property name: the field key in props of schema
   */
  name: string; // =>
  title?: string; // =>
  tip?: {
    content?: string;
    url?: string;
  };
  defaultValue?: any; // => extraProps.defaultValue
  initialValue?: any | ((value: any, defaultValue: any) => any); // => extraProps.initialValue
  initial?: (value: any, defaultValue: any) => any  // => extraProps.initialValue

  display?: DISPLAY_TYPE; // => fieldExtraProps
  fieldStyle?: DISPLAY_TYPE; // => fieldExtraProps
  setter?: ComponentClass | ISetterConfig[] | string | SetterGetter; // =>
  supportVariable?: boolean; // => use MixedSetter
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
  hidden?: boolean | ReturnBooleanFunction; // => condition

  /**
   * when use getValue(), accessor shall be called as initializer
   */
  accessor?(this: Field, value: any): any; // => getValue
  /**
   * when current prop value mutate, the mutator function shall be called
   */
  mutator?( // => setValue
    this: Field,
    value: any,
    /*
    hotValue: any, // => x
    preValue: any, // => x
    preHotValue: any, // => x
    */
  ): void;
  /**
   * other values' change will trigger sync function here
   */
  sync?(this: Field, value: any): void; // => autorun
  /**
   * user click var to change current field to
   * variable setting field
   */
  useVariableChange?(this: Field, data: { isUseVariable: boolean }): any; // => as MixinSetter param

  slotName?: string;
  slotTitle?: string;
  initialChildren?: any; // schema
  allowTextInput: boolean;
}

// from vision 5.4
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
  extraActions?: Array<ComponentType<any> | ReactElement> | (() => ReactElement); // => configure.component.actions
  title?: string; // =>
  icon?: ComponentType<any> | ReactElement; // =>
  view: ComponentType; // => ?
  initialChildren?: (props: any) => any[]; // => snippets

  /**
   * Props configurations of node
   */
  configure: OldPropConfig[]; // => configure.props
  snippets?: any[]; // => snippets
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

  didDropOut?: (dragment: any, container: any) => void; // => hooks
  didDropIn?: (dragment: any, container: any) => void; // => hooks

  /**
   * when sub-node of the current node changed
   * including: sub-node insert / remove
   */
  subtreeModified?(this: Node): any; // => ? hooks

  // => ?
  canResizing?: ((dragment: any, triggerDirection: string) => boolean) | boolean;
  onResizeStart?: (e: MouseEvent, triggerDirection: string, dragment: Node) => void;
  onResize?: (e: MouseEvent, triggerDirection: string, dragment: Node, moveX: number, moveY: number) => void;
  onResizeEnd?: (e: MouseEvent, triggerDirection: string, dragment: Node) => void;
}

export interface ISetterConfig {
  setter?: ComponentClass;
  // use value to decide whether this setter is available
  condition?: (value: any) => boolean;
}

type SetterGetter = (this: Field, value: any) => ComponentClass;

type ReturnBooleanFunction = (this: Field, value: any) => boolean;

export function upgradePropConfig(config: OldPropConfig) {
  const {
    type,
    name,
    title,
    tip,
    slotName,
    slotTitle,
    initialChildren,
    allowTextInput,
    initialValue,
    defaultValue,
    display,
    fieldStyle,
    collapse,
    collapsed,
    fieldCollapsed,
    hidden,
    disabled,
    items,
    ignore,
    initial,
    sync,
    accessor,
    mutator,
    setter,
    useVariableChange,
    supportVariable,
  } = config;

  const extraProps: any = {};
  const newConfig: any = {
    type: type === 'group' ? 'group' : 'field',
    name,
    title,
    extraProps,
  };

  if (tip) {
    if (typeof title !== 'object' || isI18nData(title) || isValidElement(title)) {
      newConfig.title = {
        title,
        tip: tip.content,
        docUrl: tip.url
      };
    } else {
      newConfig.title = {
        ...(title as any),
        tip: tip.content,
        docUrl: tip.url
      };
    }
  }

  if (display || fieldStyle) {
    extraProps.display = display || fieldStyle;
    if (extraProps.display === DISPLAY_TYPE.TAB) {
      extraProps.display = DISPLAY_TYPE.ACCORDION;
    }
  }

  if (collapse || collapsed || fieldCollapsed) {
    extraProps.defaultCollapsed = true;
  }
  function isDisabled(field: Field) {
    if (typeof disabled === 'function') {
      return disabled.call(field, field.getValue()) === true;
    }
    return disabled === true;
  }
  function isHidden(field: Field) {
    if (typeof hidden === 'function') {
      return hidden.call(field, field.getValue()) === true;
    }
    return hidden === true;
  }
  if (extraProps.display === DISPLAY_TYPE.NONE) {
    extraProps.display = undefined;
    extraProps.condition = () => false;
  } else if (hidden != null || disabled != null) {
    extraProps.condition = (field: Field) => !(isHidden(field) || isDisabled(field));
  }
  if (ignore != null || disabled != null) {
    extraProps.virtual = (field: Field) => {
      if (isDisabled(field)) { return true; }

      if (typeof ignore === 'function') {
        return ignore.call(field, field.getValue()) === true;
      }
      return ignore === true;
    };
  }

  if (type === 'group') {
    newConfig.items = items ? upgradeConfigure(items) : [];
    return newConfig;
  }

  if (slotName) {
    newConfig.name = slotName;
    if (!newConfig.title && slotTitle) {
      newConfig.title = slotTitle;
    }
    const slotSetter = {
      componentName: 'SlotSetter',
      initialValue: () => ({
        type: 'JSSlot',
        // params:
        value: initialChildren
      }),
    }
    if (allowTextInput === false) {
      newConfig.setter = slotSetter;
    } else {
      newConfig.setter = [{
        componentName: 'StringSetter',
        initialValue,
      }, slotSetter];
    }

    return newConfig;
  }

  if (defaultValue !== undefined) {
    extraProps.defaultValue = defaultValue;
  } else if (typeof initialValue !== 'function') {
    extraProps.defaultValue = initialValue;
  }

  const initialFn = initial || initialValue;
  extraProps.initialValue = (field: Field, defaultValue?: any) => {
    if (defaultValue === undefined) {
      defaultValue = extraProps.defaultValue;
    }

    if (typeof initialFn === 'function') {
      return initialFn(null, defaultValue);
    }

    return defaultValue;
  };

  if (sync) {
    extraProps.autorun = (field: Field) => {
      const value = sync.call(field, field.getValue());
      if (value !== undefined) {
        field.setValue(value);
      }
    }
  }
  if (accessor) {
    extraProps.getValue = (field: Field, fieldValue: any) => {
      return accessor.call(field, fieldValue);
    };
  }
  if (mutator) {
    extraProps.setValue = (field: Field, value: any) => {
      mutator.call(field, value);
    };
  }

  let primarySetter: any;
  if (type === 'composite') {
    const objItems = items ? upgradeConfigure(items) : [];
    primarySetter = {
      componentName: 'ObjectSetter',
      props: {
        config: {
          items: objItems,
        },
      },
      initialValue: (field: Field) => {
        // FIXME: read from objItems
        return extraProps.initialValue(field, {});
      },
    };
  } else if (setter) {
    if (Array.isArray(setter)) {
      primarySetter = setter.map(({ setter, condition }) => {
        return {
          componentName: setter,
          condition: condition ? (field: Field) => {
            return condition.call(field, field.getValue());
          } : null,
        };
      });
    } else {
      primarySetter = setter;
    }
  }
  if (supportVariable) {
    if (primarySetter) {
      const setters = Array.isArray(primarySetter) ? primarySetter.concat('ExpressionSetter') : [primarySetter, 'ExpressionSetter'];
      primarySetter = {
        componentName: 'MixedSetter',
        setters,
        onSetterChange: (field: Field, name: string) => {
          if (useVariableChange) {
            useVariableChange.call(field, { isUseVariable: name === 'ExpressionSetter' });
          }
        }
      };
    } else {
      primarySetter = 'ExpressionSetter';
    }
  }
  newConfig.setter = primarySetter;

  return newConfig;
}

export function upgradeConfigure(items: OldPropConfig[]) {
  const configure = [];
  let ignoreSlotName: any = null;
  return items.forEach((config) => {
    if (config.slotName) {
      ignoreSlotName = config.slotName;
    } else if (ignoreSlotName) {
      if (config.name === ignoreSlotName) {
        ignoreSlotName = null;
        return;
      }
      ignoreSlotName = null;
    }
    configure.push(upgradePropConfig(config));
  });
}

export function upgradeActions(actions?: Array<ComponentType<any> | ReactElement> | (() => ReactElement)) {
  if (!actions) {
    return null;
  }
  if (!Array.isArray(actions)) {
    actions = [actions];
  }
  return actions.map((content) => {
    const type: any = isValidElement(content) ? content.type : content;
    if (typeof content === 'function') {
      const fn = content as (() => ReactElement);
      content = (({ node }: any) => {
        fn.call(node);
      }) as any;
    }
    return {
      name: type.displayName || type.name || 'anonymous',
      content,
      important: true,
    };
  })
}

/**
 * 升级
 */
export function upgradeMetadata(oldConfig: OldPrototypeConfig) {
  const {
    componentName,
    docUrl,
    title,
    icon,
    packageName,
    category,
    extraActions,
    defaultProps,
    initialChildren,
    snippets,
    view,
    configure,
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

    // hooks
    canDraging, canDragging, // handleDragging
    // events
    didDropOut, // onNodeRemove
    didDropIn,  // onNodeAdd
    subtreeModified, // onSubtreeModified

    canResizing, // resizing
    onResizeStart, // onResizeStart
    onResize, // onResize
    onResizeEnd, // onResizeEnd
  } = oldConfig;


  const meta: any = {
    componentName,
    title,
    icon,
    docUrl,
    devMode: 'procode',
  };

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
    component.actions = upgradeActions(extraActions);
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

  // 未考虑清楚的，放在实验性段落
  const experimental: any = {};
  if (context) {
    // for prototype.getContextInfo
    experimental.context = context;
  }
  if (snippets) {
    experimental.snippets = snippets;
  }
  if (defaultProps || initialChildren) {
    const snippet = {
      screenshot: icon,
      label: title,
      schema: {
        componentName,
        props: defaultProps,
        children: initialChildren,
      },
    };
    if (experimental.snippets) {
      experimental.snippets.push(snippet);
    } else {
      experimental.snippets = [snippet];
    }
  }
  if (view) {
    experimental.view = view;
  }
  if (transducers) {
    // Array<{ toStatic, toNative }>
    // ? only twice
    experimental.transducers = transducers;
  }
  if (canResizing) {
    // TODO: enhance
    experimental.getResizingHandlers = (currentNode: any) => {
      const directs = ['n', 'w', 's', 'e'];
      if (canResizing === true) {
        return directs;
      }
      return directs.filter((d) => canResizing(currentNode, d));
    };
  }

  const callbacks: any = {};
  if (canDragging != null || canDraging != null) {
    let v = true;
    if (canDragging === false || canDraging === false) {
      v = false;
    }
    callbacks.onMoveHook = () => v;
  }
  if (didDropIn) {
    callbacks.onNodeAdd = didDropIn;
  }
  if (didDropOut) {
    callbacks.onNodeRemove = didDropOut;
  }
  if (subtreeModified) {
    callbacks.onSubtreeModified = (...args: any[]) => {
      // FIXME! args not correct
      subtreeModified.apply(args[0], args as any);
    };
  }
  if (onResize) {
    callbacks.onResize = (e: any, currentNode: any) => {
      // todo: what is trigger?
      const { trigger, deltaX, deltaY } = e;
      onResize(e, trigger, currentNode, deltaX, deltaY);
    }
  }
  if (onResizeStart) {
    callbacks.onResizeStart = (e: any, currentNode: any) => {
      // todo: what is trigger?
      const { trigger } = e;
      onResizeStart(e, trigger, currentNode);
    }
  }
  if (onResizeEnd) {
    callbacks.onResizeEnd = (e: any, currentNode: any) => {
      // todo: what is trigger?
      const { trigger } = e;
      onResizeEnd(e, trigger, currentNode);
    }
  }

  experimental.callbacks = callbacks;

  const props = upgradeConfigure(configure || []);
  meta.configure = { props, component };
  meta.experimental = experimental;
  return meta;
}


