import { ComponentType, ReactElement, isValidElement, ComponentClass } from 'react';
import { omit } from 'lodash';
import { isPlainObject, uniqueId, isVariable } from '@ali/lowcode-utils';
import {
  isI18nData,
  SettingTarget,
  InitialItem,
  FilterItem,
  isJSSlot,
  ProjectSchema,
  AutorunItem,
  isJSBlock,
  isJSExpression,
} from '@ali/lowcode-types';
import { editorCabin, designerCabin } from '@ali/lowcode-engine';

const { SettingField } = designerCabin;
const { untracked } = editorCabin;

type Field = SettingTarget;

export enum DISPLAY_TYPE {
  NONE = 'none', // => condition'plain'
  PLAIN = 'plain',
  INLINE = 'inline',
  BLOCK = 'block',
  ACCORDION = 'accordion',
  TAB = 'tab', // => 'accordion'
  ENTRY = 'entry',
}

type Tip = string | {
  content?: string;
  url?: string;
  [key: string]: string | undefined;
};
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
  tip?: Tip;
  defaultValue?: any; // => extraProps.defaultValue
  initialValue?: any | ((value: any, defaultValue: any) => any); // => initials.initialValue
  initial?: (value: any, defaultValue: any) => any; // => initials.initialValue

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
    hotValue: any,
  ): /*
    preValue: any, // => x
    preHotValue: any, // => x
    */
  void;
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
  liveTextEditing?: any;
}

type ResizeHandler = (dragment: any, triggerDirection: string) => boolean;
type ResizeCompositeHandler = { handle: ResizeHandler; availableDirects: string[] | undefined };
type CanResize = boolean | ResizeHandler | ResizeCompositeHandler;

function isResizeCompositeHandler(resize: CanResize): resize is ResizeCompositeHandler {
  if ((resize as any).handle) {
    return true;
  }
  return false;
}

// from vision 5.4
export interface OldPrototypeConfig {
  packageName: string; // => npm.package
  /**
   * category display in the component pane·
   * component will be hidden while the value is: null
   */
  category: string; // => tags
  componentName: string; // =>
  docUrl?: string; // =>
  defaultProps?: any; // => ?
  isMinimalRenderUnit?: boolean; // => false
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
  isAbsoluteLayoutContainer?: boolean; // => meta.experimental.isAbsoluteLayoutContainer 是否是绝对定位容器
  hideSelectTools?: boolean; // => meta.experimental.hideSelectTools
  isModal?: boolean; // => configure.component.isModal
  isFloating?: boolean; // => configure.component.isFloating
  descriptor?: string; // => configure.component.descriptor

  // alias to canDragging
  canDraging?: boolean; // => onDrag
  canDragging?: boolean; // => ?
  canHovering?: ((dragment: Node) => boolean) | boolean;
  canSelecting?: boolean; // => onClickHook
  canOperating?: boolean; // => disabledActions
  canUseCondition?: boolean;
  canLoop?: boolean;
  canContain?: (dragment: Node) => boolean; // => nestingRule

  canDropTo?: ((container: Node) => boolean) | boolean | string | string[]; // => nestingRule
  canDropto?: ((container: Node) => boolean) | boolean | string | string[]; // => nestingRule

  canDropIn?: ((dragment: Node) => boolean) | boolean | string | string[]; // => nestingRule
  canDroping?: ((dragment: Node) => boolean) | boolean | string | string[]; // => nestingRule

  didDropOut?: (dragment: any, container: any) => void; // => hooks
  didDropIn?: (dragment: any, container: any) => void; // => hooks

  /**
   * when sub-node of the current node changed
   * including: sub-node insert / remove
   */
  subtreeModified?(this: Node): any; // => ? hooks

  // => ?
  canResizing?: CanResize;
  onResizeStart?: (e: MouseEvent, triggerDirection: string, dragment: Node) => void;
  onResize?: (
    e: MouseEvent,
    triggerDirection: string,
    dragment: Node,
    moveX: number,
    moveY: number,
  ) => void;
  onResizeEnd?: (e: MouseEvent, triggerDirection: string, dragment: Node) => void;
  devMode?: string;
  schema?: ProjectSchema;
  isTopFixed?: boolean;
}

export interface ISetterConfig {
  setter?: ComponentClass;
  // use value to decide whether this setter is available
  condition?: (value: any) => boolean;
}

type SetterGetter = (this: Field, value: any) => ComponentClass;

type ReturnBooleanFunction = (this: Field, value: any) => boolean;

/**
 * 获取剥去 variable / JSExpression 结构后的值
 * @param propValue
 * @returns
 */
function getRawValue(propValue: any) {
  if (isVariable(propValue)) {
    return propValue.value;
  }
  if (isJSExpression(propValue)) {
    return propValue.mock;
  }
  return propValue;
}

/**
 * 根据原始值的数据结构（JSExpression / variable / 普通）转换 value，保持相同结构
 * @param originalValue
 * @param value
 * @returns
 */
function formatPropValue(originalValue: any, value: any) {
  if (isJSExpression(originalValue)) {
    return {
      type: originalValue.type,
      value: originalValue.value,
      mock: value,
      ...omit(originalValue, ['type', 'value']),
    };
  } else if (isVariable(originalValue)) {
    return {
      type: originalValue.type,
      variable: originalValue.variable,
      value,
    };
  }
  return value;
}

function isTipString(tip: Tip): tip is string {
  return typeof tip === 'string';
}

function getTipAttr(tip: Tip, attrName: string, decorator: (originalValue: string) => string = v => v): string {
  if (isTipString(tip)) {
    return attrName === 'content' ? decorator(tip) : '';
  }
  return decorator(tip[attrName]!);
}

function getTipContent(tip: Tip, name: string): string {
  return getTipAttr(tip, 'content', (v) => `属性：${name} | 说明：${v}`);
}

export function upgradePropConfig(config: OldPropConfig, collector: ConfigCollector) {
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
    liveTextEditing,
  } = config;

  const extraProps: any = {
    display: DISPLAY_TYPE.BLOCK,
  };
  const newConfig: any = {
    type: type === 'group' ? 'group' : 'field',
    name: type === 'group' && !name ? uniqueId('group') : name,
    title,
    extraProps,
  };

  if (tip) {
    if (typeof title !== 'object' || isI18nData(title) || isValidElement(title)) {
      newConfig.title = {
        label: title,
        tip: getTipContent(tip, name),
        docUrl: getTipAttr(tip, 'url'),
      };
    } else {
      newConfig.title = {
        ...(title as any),
        tip: getTipContent(tip, name),
        docUrl: getTipAttr(tip, 'url'),
      };
    }
  }

  if (display || fieldStyle) {
    extraProps.display = display || fieldStyle;
    if (extraProps.display === DISPLAY_TYPE.TAB) {
      extraProps.display = DISPLAY_TYPE.ACCORDION;
    }
  }

  if (collapse || collapsed || fieldCollapsed || extraProps.display === DISPLAY_TYPE.ENTRY) {
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

  if (type === 'group') {
    newConfig.items = items ? upgradeConfigure(items, collector) : [];
    return newConfig;
  }

  if (defaultValue !== undefined) {
    extraProps.defaultValue = defaultValue;
  } else if (typeof initialValue !== 'function') {
    extraProps.defaultValue = initialValue;
  }

  let initialFn = (slotName ? null : initial) || initialValue;
  if (slotName && initialValue === true) {
    initialFn = (value: any, defaultValue: any) => {
      // initialValue 为 true，但 value 为 false / '' 等值，说明被关闭了
      if (value === false || value === '') return value;
      if (isJSBlock(value) || isJSSlot(value)) {
        return value;
      }
      return {
        type: 'JSSlot',
        title: slotTitle || title,
        name: slotName,
        value: initialChildren,
      };
    };
  }

  if (!slotName) {
    if (accessor) {
      extraProps.getValue = (field: Field, fieldValue: any) => {
        return accessor.call(field, fieldValue);
      };
    }

    if (sync || accessor) {
      collector.addAutorun({
        name,
        autorun: (field: Field) => {
          let fieldValue = untracked(() => field.getValue());
          if (accessor) {
            fieldValue = accessor.call(field, fieldValue);
          }
          if (sync) {
            fieldValue = sync.call(field, fieldValue);
            if (fieldValue !== undefined) {
              field.setValue(fieldValue);
            }
          } else {
            field.setValue(fieldValue);
          }
        },
      });
    }

    if (mutator) {
      extraProps.setValue = (field: Field, value: any) => {
        // TODO: 兼容代码，不触发查询组件的 Mutator
        if (field instanceof SettingField && field.componentMeta?.componentName === 'Filter') {
          return;
        }
        mutator.call(field, value, value);
      };
    }
  }

  const setterInitial = getInitialFromSetter(setter);

  if (type !== 'composite') {
    collector.addInitial({
      // FIXME! name could be "xxx.xxx"
      name: slotName || name,
      initial: (field: Field, currentValue: any) => {
        // FIXME! read from prototype.defaultProps
        const defaults = extraProps.defaultValue;

        if (typeof initialFn !== 'function') {
          initialFn = defaultInitial;
        }

        const rawValue = getRawValue(currentValue);
        const v = initialFn.call(field, rawValue, defaults);

        if (setterInitial) {
          return formatPropValue(currentValue, setterInitial.call(field, v, defaults));
        }

        return formatPropValue(currentValue, v);
      },
    });
  }

  if (ignore != null || disabled != null) {
    collector.addFilter({
      // FIXME! name should be "xxx.xxx"
      name: slotName || name,
      filter: (field: Field, currentValue: any) => {
        let disabledValue: boolean;
        if (typeof disabled === 'function') {
          disabledValue = disabled.call(field, currentValue) === true;
        } else {
          disabledValue = disabled === true;
        }
        if (disabledValue) {
          return false;
        }
        if (typeof ignore === 'function') {
          return ignore.call(field, currentValue) !== true;
        }
        return ignore !== true;
      },
    });
  }

  if (slotName) {
    newConfig.name = slotName;
    if (!newConfig.title && slotTitle) {
      newConfig.title = slotTitle;
    }
    const setters: any[] = [
      {
        componentName: 'SlotSetter',
        initialValue: (field: any, value: any) => {
          if (isJSSlot(value)) {
            return {
              title: slotTitle || title,
              ...value,
            };
          }
          return {
            type: 'JSSlot',
            title: slotTitle || title,
            name: slotName,
            value: value == null ? initialChildren : value,
          };
        },
      },
    ];
    if (allowTextInput) {
      setters.unshift('I18nSetter');
    }
    if (supportVariable) {
      setters.push('VariableSetter');
    }
    newConfig.setter = setters.length > 1 ? setters : setters[0];

    return newConfig;
  }

  let primarySetter: any;
  if (type === 'composite') {
    const initials: InitialItem[] = [];
    const objItems = items
      ? upgradeConfigure(items, {
          addInitial: (item) => {
            initials.push(item);
          },
          addFilter: (item) => {
            collector.addFilter({
              name: `${name}.${item.name}`,
              filter: item.filter,
            });
          },
          addAutorun: (item) => {
            collector.addAutorun({
              name: `${name}.${item.name}`,
              autorun: item.autorun,
            });
          },
        })
      : [];
    newConfig.items = objItems;

    const initial = (target: SettingTarget, value?: any) => {
      // TODO:
      const defaults = extraProps.defaultValue;
      const data: any = {};
      initials.forEach((item) => {
        // FIXME! Target may be a wrong
        data[item.name] = item.initial(target, isPlainObject(value) ? value[item.name] : null);
      });
      return data;
    };
    collector.addInitial({
      name,
      initial,
    });
    primarySetter = {
      componentName: 'ObjectSetter',
      props: {
        config: {
          items: objItems,
        },
      },
      initialValue: (field: Field) => {
        return initial(field, field.getValue());
      },
    };
  } else if (setter) {
    if (Array.isArray(setter)) {
      // FIXME! read initial from setter
      primarySetter = setter.map(({ setter, condition }) => {
        return {
          componentName: setter,
          condition: condition
            ? (field: Field) => {
                return condition.call(field, field.getValue());
              }
            : null,
        };
      });
    } else {
      primarySetter = setter;
    }
  }
  if (!primarySetter) {
    primarySetter = 'I18nSetter';
  }
  if (supportVariable) {
    const setters = Array.isArray(primarySetter)
      ? primarySetter.concat('VariableSetter')
      : [primarySetter, 'VariableSetter'];
    primarySetter = {
      componentName: 'MixedSetter',
      props: {
        setters,
        onSetterChange: (field: Field, name: string) => {
          if (useVariableChange) {
            useVariableChange.call(field, { isUseVariable: name === 'VariableSetter' });
          }
        },
      },
    };
  }
  newConfig.setter = primarySetter;

  if (liveTextEditing) {
    extraProps.liveTextEditing = liveTextEditing;
  }

  return newConfig;
}

type AddInitial = (initialItem: InitialItem) => void;
type AddFilter = (filterItem: FilterItem) => void;
type AddAutorun = (autorunItem: AutorunItem) => void;

type ConfigCollector = {
  addInitial: AddInitial;
  addFilter: AddFilter;
  addAutorun: AddAutorun;
};

function getInitialFromSetter(setter: any) {
  return (
    (setter &&
      (setter.initial ||
        setter.Initial ||
        (setter.type && (setter.type.initial || setter.type.Initial)))) ||
    null
  ); // eslint-disable-line
}

function defaultInitial(value: any, defaultValue: any) {
  return value == null ? defaultValue : value;
}

export function upgradeConfigure(items: OldPropConfig[], collector: ConfigCollector) {
  const configure: any[] = [];
  let ignoreSlotName: any = null;
  items.forEach((config) => {
    if (config.slotName) {
      ignoreSlotName = config.slotName;
    } else if (ignoreSlotName) {
      if (config.name === ignoreSlotName) {
        ignoreSlotName = null;
        return;
      }
      ignoreSlotName = null;
    }
    configure.push(upgradePropConfig(config, collector));
  });
  return configure;
}

export function upgradeActions(
  actions?: Array<ComponentType<any> | ReactElement> | (() => ReactElement),
) {
  if (!actions) {
    return null;
  }
  if (!Array.isArray(actions)) {
    actions = [actions];
  }
  return actions.map((content) => {
    const type: any = isValidElement(content) ? content.type : content;
    if (typeof content === 'function') {
      const fn = content as () => ReactElement;
      content = (({ node }: any) => {
        return fn.call(node);
      }) as any;
    }
    return {
      name: type.displayName || type.name || 'anonymous',
      content,
      important: true,
    };
  });
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
    isAbsoluteLayoutContainer,
    hideSelectTools,
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
    canUseCondition,
    canLoop,

    // hooks
    canDraging,
    canDragging, // handleDragging
    canSelecting, // onClickHook
    canHovering,
    // events
    didDropOut, // onNodeRemove
    didDropIn, // onNodeAdd
    subtreeModified, // onSubtreeModified

    onResizeStart, // onResizeStart
    onResize, // onResize
    onResizeEnd, // onResizeEnd
    devMode,
    schema,
    isTopFixed,

    // render
    isMinimalRenderUnit,
  } = oldConfig;
  let {
    canResizing, // resizing
  } = oldConfig;

  const meta: any = {
    componentName,
    title,
    icon,
    docUrl,
    devMode: devMode || 'procode',
    schema: schema?.componentsTree[0],
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
    rootSelector: rectSelector,
    isModal,
    isFloating,
    descriptor,
    isMinimalRenderUnit,
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
  if (canDropTo != null || canDropto != null) {
    if (canDropTo === false || canDropto === false) {
      nestingRule.parentWhitelist = () => false;
    } else if (canDropTo !== true && canDropto !== true) {
      nestingRule.parentWhitelist = canDropTo || canDropto;
    }
  }
  if (canDropIn != null || canDroping != null) {
    if (canDropIn === false || canDroping === false) {
      nestingRule.childWhitelist = () => false;
    } else if (canDropIn !== true && canDroping !== true) {
      nestingRule.childWhitelist = canDropIn || canDroping;
    }
  }
  component.nestingRule = nestingRule;

  // 未考虑清楚的，放在实验性段落
  const experimental: any = {
    isAbsoluteLayoutContainer,
    hideSelectTools,
  };
  if (context) {
    // for prototype.getContextInfo
    experimental.context = context;
  }
  if (snippets) {
    experimental.snippets = snippets.map((data) => {
      const { schema = {} } = data;
      if (!schema.children && initialChildren && typeof initialChildren !== 'function') {
        schema.children = initialChildren;
      }
      return {
        ...data,
        schema,
      };
    });
  }
  // FIXME! defaultProps for initial input
  // initialChildren maybe a function
  else if (defaultProps || initialChildren) {
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
  if (initialChildren) {
    experimental.initialChildren =
      typeof initialChildren === 'function'
        ? (node: any) => {
            return initialChildren.call(node, node.settingEntry);
          }
        : initialChildren;
  }
  if (view) {
    experimental.view = view;
  }
  if (isTopFixed) {
    experimental.isTopFixed = isTopFixed;
  }
  if (transducers) {
    // Array<{ toStatic, toNative }>
    // ? only twice
    experimental.transducers = transducers;
  }
  if (canResizing) {
    let availableDirects = ['n', 'e', 's', 'w'];
    if (isResizeCompositeHandler(canResizing)) {
      availableDirects = canResizing.availableDirects || availableDirects;
      canResizing = canResizing.handle;
    }
    experimental.getResizingHandlers = (currentNode: any) => {
      if (canResizing === true) {
        return availableDirects;
      }
      return availableDirects.filter((d) => (canResizing as ResizeHandler)(currentNode, d));
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
  if (canSelecting != null) {
    let v = true;
    if (canSelecting === false) {
      v = false;
    }
    callbacks.onClickHook = () => v;
  }
  if (canHovering != null) {
    callbacks.onHoverHook = typeof canHovering === 'boolean' ? () => canHovering : canHovering;
  }
  if (didDropIn) {
    callbacks.onNodeAdd = didDropIn;
  }
  if (didDropOut) {
    callbacks.onNodeRemove = didDropOut;
  }
  if (subtreeModified) {
    callbacks.onSubtreeModified = subtreeModified;
  }
  if (onResize) {
    callbacks.onResize = (e: any, currentNode: any) => {
      // todo: what is trigger?
      const { trigger, deltaX, deltaY } = e;
      onResize(e, trigger, currentNode, deltaX, deltaY);
    };
  }
  if (onResizeStart) {
    callbacks.onResizeStart = (e: any, currentNode: any) => {
      // todo: what is trigger?
      const { trigger } = e;
      onResizeStart(e, trigger, currentNode);
    };
  }
  if (onResizeEnd) {
    callbacks.onResizeEnd = (e: any, currentNode: any) => {
      // todo: what is trigger?
      const { trigger } = e;
      onResizeEnd(e, trigger, currentNode);
    };
  }

  experimental.callbacks = callbacks;

  const initials: InitialItem[] = [];
  const filters: FilterItem[] = [];
  const autoruns: AutorunItem[] = [];
  const props = upgradeConfigure(configure || [], {
    addInitial: (item) => {
      initials.push(item);
    },
    addFilter: (item) => {
      filters.push(item);
    },
    addAutorun: (item) => {
      autoruns.push(item);
    },
  });
  experimental.initials = initials;
  experimental.filters = filters;
  experimental.autoruns = autoruns;

  const supports: any = {};
  if (canUseCondition != null) {
    supports.condition = canUseCondition;
  }
  if (canLoop != null) {
    supports.loop = canLoop;
  }
  meta.configure = { props, component, supports };
  meta.experimental = experimental;
  return meta;
}
