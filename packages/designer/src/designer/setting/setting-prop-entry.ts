import { obx, computed, autorun } from '@ali/lowcode-editor-core';
import { IEditor, isJSExpression } from '@ali/lowcode-types';
import { uniqueId } from '@ali/lowcode-utils';
import { SettingEntry } from './setting-entry';
import { Node } from '../../document';
import { ComponentMeta } from '../../component-meta';
import { Designer } from '../designer';
import { EventEmitter } from 'events';

export class SettingPropEntry implements SettingEntry {
  // === static properties ===
  readonly editor: IEditor;
  readonly isSameComponent: boolean;
  readonly isMultiple: boolean;
  readonly isSingle: boolean;
  readonly nodes: Node[];
  readonly componentMeta: ComponentMeta | null;
  readonly designer: Designer;
  readonly top: SettingEntry;
  readonly isGroup: boolean;
  readonly type: 'field' | 'group';
  readonly id = uniqueId('entry');

  readonly emitter = new EventEmitter();

  // ==== dynamic properties ====
  @obx.ref private _name: string | number;
  get name() {
    return this._name;
  }
  @computed get path() {
    const path = this.parent.path.slice();
    if (this.type === 'field') {
      path.push(this.name);
    }
    return path;
  }

  extraProps: any = {};

  constructor(readonly parent: SettingEntry, name: string | number, type?: 'field' | 'group') {
    if (type == null) {
      const c = typeof name === 'string' ? name.substr(0, 1) : '';
      if (c === '#') {
        this.type = 'group';
      } else {
        this.type = 'field';
      }
    } else {
      this.type = type;
    }
    // initial self properties
    this._name = name;
    this.isGroup = this.type === 'group';

    // copy parent static properties
    this.editor = parent.editor;
    this.nodes = parent.nodes;
    this.componentMeta = parent.componentMeta;
    this.isSameComponent = parent.isSameComponent;
    this.isMultiple = parent.isMultiple;
    this.isSingle = parent.isSingle;
    this.designer = parent.designer;
    this.top = parent.top;
  }

  getId() {
    return this.id;
  }

  setKey(key: string | number) {
    if (this.type !== 'field') {
      return;
    }
    const propName = this.path.join('.');
    let l = this.nodes.length;
    while (l-- > 1) {
      this.nodes[l].getProp(propName, true)!.key = key;
    }
    this._name = key;
  }

  getKey() {
    return this._name;
  }

  remove() {
    if (this.type !== 'field') {
      return;
    }
    const propName = this.path.join('.');
    let l = this.nodes.length;
    while (l-- > 1) {
      this.nodes[l].getProp(propName)?.remove();
    }
  }

  // ====== 当前属性读写 =====

  /**
   * 获取当前属性值
   */
  @computed getValue(): any {
    let val: any = null;
    if (this.type === 'field') {
      val = this.parent.getPropValue(this.name);
    }
    const { getValue } = this.extraProps;
    return getValue ? getValue(this, val) : val;
  }

  /**
   * 设置当前属性值
   */
  setValue(val: any) {
    if (this.type === 'field') {
      this.parent.setPropValue(this.name, val);
    }
    const { setValue } = this.extraProps;
    if (setValue) {
      setValue(this, val);
    }
  }

  /**
   * 获取子项
   */
  get(propName: string | number) {
    const path = this.path.concat(propName).join('.');
    return this.top.get(path);
  }

  /**
   * 设置子级属性值
   */
  setPropValue(propName: string | number, value: any) {
    const path = this.path.concat(propName).join('.');
    this.top.setPropValue(path, value);
  }

  /**
   * 获取子级属性值
   */
  getPropValue(propName: string | number): any {
    return this.top.getPropValue(this.path.concat(propName).join('.'));
  }

  /**
   * 获取顶层附属属性值
   */
  getExtraPropValue(propName: string) {
    return this.top.getExtraPropValue(propName);
  }

  /**
   * 设置顶层附属属性值
   */
  setExtraPropValue(propName: string, value: any) {
    this.top.setExtraPropValue(propName, value);
  }

  // ======= compatibles for vision ======
  getNode() {
    return this.nodes[0];
  }

  getName(): string {
    return this.path.join('.');
  }

  getProps() {
    return this.top;
  }

  // add settingfield props
  get props() {
    return this.top;
  }

  onValueChange(func: () => any) {
    this.emitter.on('valuechange', func);

    return () => {
      this.emitter.removeListener('valuechange', func);
    };
  }

  /**
   * @deprecated
   */
  valueChange() {
    this.emitter.emit('valuechange');
  }

  getDefaultValue() {
    return this.extraProps.defaultValue;
  }

  isIgnore() {
    return false;
  }
  /*
  getConfig<K extends keyof IPropConfig>(configName?: K): IPropConfig[K] | IPropConfig {
    if (configName) {
      return this.config[configName];
    }

    return this.config;
  }
  */
  getVariableValue() {
    const v = this.getValue();
    if (isJSExpression(v)) {
      return v.value;
    }
    return '';
  }
  setVariableValue(value: string) {
    const v = this.getValue();
    this.setValue({
      type: 'JSExpression',
      value,
      mock: isJSExpression(v) ? v.mock : v,
    });
  }
  setUseVariable(flag: boolean) {
    if (this.isUseVariable() === flag) {
      return;
    }
    const v = this.getValue();
    if (isJSExpression(v)) {
      this.setValue(v.mock);
    } else {
      this.setValue({
        type: 'JSExpression',
        value: '',
        mock: v,
      });
    }
  }
  isUseVariable() {
    return isJSExpression(this.getValue());
  }
  getMockOrValue() {
    const v = this.getValue();
    if (isJSExpression(v)) {
      return v.mock;
    }
    return v;
  }
}
