import { Component } from 'react';
import { EventEmitter } from 'events';
import { fromJS, Iterable, Map as IMMap } from 'immutable';
import logger from '@ali/vu-logger';
import { cloneDeep, isDataEqual, combineInitial, Transducer } from '@ali/ve-utils';
import I18nUtil from '@ali/ve-i18n-util';
import { editor, setters } from '@ali/lowcode-engine';
import { OldPropConfig, DISPLAY_TYPE } from './bundle/upgrade-metadata';
import { uniqueId } from '@ali/lowcode-utils';

const { getSetter } = setters;

type IPropConfig = OldPropConfig;

// 1: chain -1: start 0: discard
const CHAIN_START = -1;
const CHAIN_HAS_REACH = 0;

export enum PROP_VALUE_CHANGED_TYPE {
  /**
   * normal set value
   */
  SET_VALUE = 'SET_VALUE',
  /**
   * value changed caused by sub-prop value change
   */
  SUB_VALUE_CHANGE = 'SUB_VALUE_CHANGE',
}

/**
 * Dynamic setter will use 've.plugin.setterProvider' to
 * calculate setter type in runtime
 */
let dynamicSetterProvider: any;

export interface IHotDataMap extends IMMap<string, any> {
  value: any;
  hotValue: any;
}

export interface ISetValueOptions {
  disableMutator?: boolean;
  type?: PROP_VALUE_CHANGED_TYPE;
}

export interface IVariableSettable {
  useVariable?: boolean;
  variableValue: string;
  isUseVariable: () => boolean;
  isSupportVariable: () => boolean;
  setVariableValue: (value: string) => void;
  setUseVariable: (flag?: boolean) => void;
  getVariableValue: () => string;
  onUseVariableChange: (func: (data: { isUseVariable: boolean }) => any) => void;
}

export default class Prop implements IVariableSettable {
  /**
   * Setters predefined as default options
   * can by selected by user for every prop
   *
   * @static
   * @memberof Prop
   */
  public static INSET_SETTER = {};

  public id: string;

  public emitter: EventEmitter;

  public inited: boolean;

  public i18nLink: any;

  public loopLock: boolean;

  public props: any;

  public parent: any;

  public config: IPropConfig;

  public initial: any;

  public initialData: any;

  public expanded: boolean;

  public useVariable?: boolean;

  /**
   * value to be saved in schema it is usually JSON serialized
   * prototype.js can config Transducer.toNative to generate value
   */
  public value: any;

  /**
   * value to be used in VisualDesigner more flexible
   * prototype.js can config Transducer.toHot to generate hotValue
   */
  public hotValue: any;

  /**
   * 启用变量之后，变量表达式字符串值
   */
  public variableValue: string;

  public hotData: IMMap<string, IHotDataMap>;

  public defaultValue: any;

  public transducer: any;

  public inGroup: boolean;

  constructor(parent: any, config: IPropConfig, data?: any) {
    if (parent.isProps) {
      this.props = parent;
      this.parent = null;
    } else {
      this.props = parent.getProps();
      this.parent = parent;
    }

    this.id = uniqueId('prop');

    if (typeof config.setter === 'string') {
      config.setter = getSetter(config.setter)?.component as any;
    }
    this.config = config;
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(100);
    this.initialData = data;
    this.useVariable = false;

    dynamicSetterProvider = editor.get('ve.plugin.setterProvider');

    this.beforeInit();
  }

  public getId() {
    return this.id;
  }

  public isTab() {
    return this.getDisplay() === 'tab';
  }

  public isGroup() {
    return false;
  }

  public beforeInit() {
    if (IMMap.isMap(this.initialData)) {
      this.value = this.initialData.get('value');
      if (this.value && typeof this.value.toJS === 'function') {
        this.value = this.value.toJS();
      }
      this.hotData = this.initialData;
    } else {
      this.value = this.initialData;
    }

    this.resolveValue();

    let defaultValue = null;
    if (this.config.defaultValue !== undefined) {
      defaultValue = this.config.defaultValue;
    } else if (typeof this.config.initialValue !== 'function') {
      defaultValue = this.config.initialValue;
    }
    this.defaultValue = defaultValue;
    this.transducer = new Transducer(this, this.config);
    this.initial = combineInitial(this, this.config);
  }

  public resolveValue() {
    if (this.value && this.value.type === 'variable') {
      const { value, variable } = this.value;
      this.value = value;
      this.variableValue = variable;
      this.useVariable = this.isSupportVariable();
    } else {
      this.useVariable = false;
    }
  }

  public init(defaultValue?: any) {
    if (this.inited) { return; }

    this.value = this.initial(this.value,
      this.defaultValue != null ? this.defaultValue : defaultValue);

    if (this.hotData) {
      const tempVal = this.hotData.get('value');
      // if we create a prop from runtime data, we don't need initial() or set with defaultValue process
      // but if we got an empty value, we fill with the initial() process and default value
      if (Iterable.isIterable(tempVal)) {
        this.value = tempVal.toJS() || this.value;
      } else {
        this.value = tempVal || this.value;
      }
      this.resolveValue();
    }

    this.i18nLink = I18nUtil.attach(this, this.value,
      ((val: any) => { this.setValue(val, false, true); }) as any);

    // call config.accessor
    const value = this.getValue();

    if (this.hotData) {
      this.hotValue = this.hotData.get('hotValue');
      if (this.hotValue && Iterable.isIterable(this.hotValue)) {
        this.hotValue = this.hotValue.toJS();
      }
    } else {
      try {
        this.hotValue = this.transducer.toHot(value);
      } catch (e) {
        logger.log('ERROR_PROP_VALUE');
        logger.warn('属性初始化错误：', this);
      }

      this.hotData = fromJS({
        hotValue: this.hotValue,
        value: this.getMixValue(value),
      });
    }
    this.inited = true;
  }

  public isInited() {
    return this.inited;
  }

  public getHotData() {
    return this.hotData;
  }

  public getProps() {
    return this.props;
  }

  public getNode(): any {
    return this.getProps().getNode();
  }

  /**
   * 获得属性名称
   *
   * @returns {string}
   */
  public getName(): string {
    const ns = this.parent ? `${this.parent.getName()}.` : '';
    return ns + this.config.name;
  }

  public getKey() {
    return this.config.name;
  }

  /**
   * 获得属性标题
   *
   * @returns {string}
   */
  public getTitle() {
    return this.config.title || this.getName();
  }

  public getTip() {
    return this.config.tip || null;
  }

  public getValue(disableCache?: boolean, options?: {
    disableAccessor?: boolean;
  }) {
    const { accessor } = this.config;
    if (accessor && (!options || !options.disableAccessor)) {
      const value = accessor.call(this as any, this.value);
      if (!disableCache) {
        this.value = value;
      }
      return value;
    }
    return this.value;
  }

  public getMixValue(value?: any) {
    if (value == null) {
      value = this.getValue();
    }
    if (this.isUseVariable()) {
      value = {
        type: 'variable',
        value,
        variable: this.getVariableValue(),
      };
    }
    return value;
  }

  public toData() {
    return cloneDeep(this.getMixValue());
  }

  public getDefaultValue() {
    return this.defaultValue;
  }

  public getHotValue() {
    return this.hotValue;
  }

  public getConfig<K extends keyof IPropConfig>(configName?: K): IPropConfig[K] | IPropConfig {
    if (configName) {
      return this.config[configName];
    }

    return this.config;
  }

  public sync() {
    if (this.props.hasReach(this)) {
      return;
    }

    const { sync } = this.config;
    if (sync) {
      const value = sync.call(this as any, this.getValue(true));
      if (value !== undefined) {
        this.setValue(value);
      }
    } else {
      // sync 的时候不再需要调用经过 accessor 处理之后的值了
      // 这里之所以需要 setValue 是为了过 getValue() 中的 accessor 修饰函数
      this.setValue(this.getValue(true), false, false, {
        disableMutator: true,
      });
    }
  }

  public isUseVariable() {
    return this.useVariable || false;
  }

  public isSupportVariable() {
    return this.config.supportVariable || false;
  }

  public setVariableValue(value: string) {
    if (!this.isUseVariable()) { return; }

    const state = this.props.chainReach(this);
    if (state === CHAIN_HAS_REACH) {
      return;
    }

    this.variableValue = value;

    if (this.modify()) {
      this.valueChange();
      this.props.syncPass(this);
    }

    if (state === CHAIN_START) {
      this.props.endChain();
    }
  }

  public setUseVariable(flag = false) {
    if (this.useVariable === flag) { return; }

    const state = this.props.chainReach(this);
    if (state === CHAIN_HAS_REACH) {
      return;
    }

    this.useVariable = flag;
    this.expanded = true;

    if (this.modify()) {
      this.valueChange();
      this.props.syncPass(this);
    }

    if (state === CHAIN_START) {
      this.props.endChain();
    }

    this.emitter.emit('ve.prop.useVariableChange', { isUseVariable: flag });
    if (this.config.useVariableChange) {
      this.config.useVariableChange.call(this as any, { isUseVariable: flag });
    }
  }

  public getVariableValue() {
    return this.variableValue;
  }

  /**
   * @param value
   * @param isHotValue 是否为设计器热状态值
   * @param force 是否强制触发更新
   */
  public setValue(value: any, isHotValue?: boolean, force?: boolean, extraOptions?: ISetValueOptions) {
    const state = this.props.chainReach(this);
    if (state === CHAIN_HAS_REACH) {
      return;
    }

    const preValue = this.value;
    const preHotValue = this.hotValue;

    if (isHotValue) {
      this.hotValue = value;
      this.value = this.transducer.toNative(this.hotValue);
    } else {
      if (!isDataEqual(value, this.value)) {
        this.hotValue = this.transducer.toHot(value);
      }
      this.value = value;
    }

    this.i18nLink = I18nUtil.attach(this, this.value, ((val: any) => this.setValue(val, false, true)) as any);

    const { mutator } = this.config;

    if (!extraOptions) {
      extraOptions = {};
    }

    if (mutator && !extraOptions.disableMutator) {
      mutator.call(this as any, this.value);
    }

    if (this.modify(force)) {
      this.valueChange(extraOptions);
      this.props.syncPass(this);
    }

    if (state === CHAIN_START) {
      this.props.endChain();
    }
  }

  public setHotValue(hotValue: any, options?: ISetValueOptions) {
    try {
      this.setValue(hotValue, true, false, options);
    } catch (e) {
      logger.log('ERROR_PROP_VALUE');
      logger.warn('属性值设置错误：', e, hotValue);
    }
  }

  /**
   * 验证是否存在变更
   * @param force 是否强制返回已变更
   */
  public modify(force?: boolean) {
    const hotData = this.hotData.merge(fromJS({
      hotValue: this.getHotValue(),
      value: this.getMixValue(),
    }));

    if (!force && hotData.equals(this.hotData)) {
      return false;
    }

    this.hotData = hotData;

    (this.parent || this.props).modify(this.getName());

    return true;
  }

  public setHotData(hotData: IMMap<string, IHotDataMap>, options?: ISetValueOptions) {
    if (!IMMap.isMap(hotData)) {
      return;
    }
    this.hotData = hotData;
    let value = hotData.get('value');
    if (value && typeof value.toJS === 'function') {
      value = value.toJS();
    }
    let hotValue = hotData.get('hotValue');
    if (hotValue && typeof hotValue.toJS === 'function') {
      hotValue = hotValue.toJS();
    }

    const preValue = value;
    const preHotValue = hotValue;

    this.value = value;
    this.hotValue = hotValue;
    this.resolveValue();

    if (!options || !options.disableMutator) {
      const { mutator } = this.config;
      if (mutator) {
        mutator.call(this as any, value);
      }
    }

    this.valueChange();
  }

  public valueChange(options?: ISetValueOptions) {
    if (this.loopLock) { return; }

    this.emitter.emit('valuechange', options);
    if (this.parent) {
      this.parent.valueChange(options);
    }
  }

  public getDisplay() {
    return this.config.display || this.config.fieldStyle || 'block';
  }

  public isHidden() {
    if (!this.isInited() || this.getDisplay() === DISPLAY_TYPE.NONE || this.isDisabled()) {
      return true;
    }

    let { hidden } = this.config;
    if (typeof hidden === 'function') {
      hidden = hidden.call(this as any, this.getValue());
    }
    return hidden === true;
  }

  public isDisabled() {
    let { disabled } = this.config;
    if (typeof disabled === 'function') {
      disabled = disabled.call(this as any, this.getValue());
    }
    return disabled === true;
  }

  public isIgnore() {
    if (this.isDisabled()) { return true; }

    let { ignore } = this.config;
    if (typeof ignore === 'function') {
      ignore = ignore.call(this as any, this.getValue());
    }
    return ignore === true;
  }

  public isExpand() {
    if (this.expanded == null) {
      this.expanded = !(this.config.collapsed || this.config.fieldCollapsed);
    }
    return this.expanded;
  }

  public toggleExpand() {
    if (this.expanded) {
      this.expanded = false;
    } else {
      this.expanded = true;
    }
    this.emitter.emit('expandchange', this.expanded);
  }

  public getSetter() {
    if (dynamicSetterProvider) {
      const setter = dynamicSetterProvider.call(this, this, this.getNode().getPrototype());
      if (setter) {
        return setter;
      }
    }
    const setterConfig = this.config.setter;
    if (typeof setterConfig === 'function' && !(setterConfig.prototype instanceof Component)) {
      return (setterConfig as any).call(this, this.getValue());
    }
    if (Array.isArray(setterConfig)) {
      let item;
      for (item of setterConfig) {
        if (item.condition?.call(this, this.getValue())) {
          return item.setter;
        }
      }
      return setterConfig[0].setter;
    }
    return setterConfig;
  }

  public getSetterData(): any {
    if (Array.isArray(this.config.setter)) {
      let item;
      for (item of this.config.setter) {
        if (item.condition?.call(this, this.getValue())) {
          return item;
        }
      }
      return this.config.setter[0];
    }
    return { };
  }

  public destroy() {
    if (this.i18nLink) {
      this.i18nLink.detach();
    }
  }

  public onValueChange(func: () => any) {
    this.emitter.on('valuechange', func);
    return () => {
      this.emitter.removeListener('valuechange', func);
    };
  }

  public onExpandChange(func: () => any) {
    this.emitter.on('expandchange', func);
    return () => {
      this.emitter.removeListener('expandchange', func);
    };
  }

  public onUseVariableChange(func: (data: { isUseVariable: boolean }) => any) {
    this.emitter.on('ve.prop.useVariableChange', func);
    return () => {
      this.emitter.removeListener('ve.prop.useVariableChange', func);
    };
  }
}
