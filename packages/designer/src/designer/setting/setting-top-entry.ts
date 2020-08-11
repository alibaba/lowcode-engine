import { EventEmitter } from 'events';
import { CustomView, isCustomView, IEditor } from '@ali/lowcode-types';
import { computed } from '@ali/lowcode-editor-core';
import { SettingEntry } from './setting-entry';
import { SettingField, isSettingField } from './setting-field';
import { SettingPropEntry } from './setting-prop-entry';
import { Node } from '../../document';
import { ComponentMeta } from '../../component-meta';
import { Designer } from '../designer';

function generateSessionId(nodes: Node[]) {
  return nodes
    .map((node) => node.id)
    .sort()
    .join(',');
}

export class SettingTopEntry implements SettingEntry {
  private emitter = new EventEmitter();
  private _items: Array<SettingField | CustomView> = [];
  private _componentMeta: ComponentMeta | null = null;
  private _isSame: boolean = true;
  private _settingFieldMap: { [prop: string]: SettingField } = {};
  readonly path = [];
  readonly top = this;
  readonly parent = this;

  get componentMeta() {
    return this._componentMeta;
  }

  get items() {
    return this._items;
  }

  /**
   * 同样的
   */
  get isSameComponent(): boolean {
    return this._isSame;
  }

  /**
   * 一个
   */
  get isSingle(): boolean {
    return this.nodes.length === 1;
  }

  /**
   * 多个
   */
  get isMultiple(): boolean {
    return this.nodes.length > 1;
  }

  readonly id: string;
  readonly first: Node;
  readonly designer: Designer;

  constructor(readonly editor: IEditor, readonly nodes: Node[]) {
    if (nodes.length < 1) {
      throw new ReferenceError('nodes should not be empty');
    }
    this.id = generateSessionId(nodes);
    this.first = nodes[0];
    this.designer = this.first.document.designer;

    // setups
    this.setupComponentMeta();

    // clear fields
    this.setupItems();
  }

  private setupComponentMeta() {
    // todo: enhance compile a temp configure.compiled
    const first = this.first;
    const meta = first.componentMeta;
    const l = this.nodes.length;
    let theSame = true;
    for (let i = 1; i < l; i++) {
      const other = this.nodes[i];
      if (other.componentMeta !== meta) {
        theSame = false;
        break;
      }
    }
    if (theSame) {
      this._isSame = true;
      this._componentMeta = meta;
    } else {
      this._isSame = false;
      this._componentMeta = null;
    }
  }

  private setupItems() {
    if (this.componentMeta) {
      const settingFieldMap: { [prop: string]: SettingField } = {};
      const settingFieldCollector = (name: string | number, field: SettingField) => {
        settingFieldMap[name] = field;
      }
      this._items = this.componentMeta.configure.map((item) => {
        if (isCustomView(item)) {
          return item;
        }
        return new SettingField(this, item as any, settingFieldCollector);
      });
      this._settingFieldMap = settingFieldMap;
    }
  }

  /**
   * 获取当前属性值
   */
  @computed getValue(): any {
    this.first.propsData;
  }

  /**
   * 设置当前属性值
   */
  setValue(val: any) {
    this.setProps(val);
    // TODO: emit value change
  }

  /**
   * 获取子项
   */
  get(propName: string | number): SettingPropEntry {
    return this._settingFieldMap[propName] || (new SettingPropEntry(this, propName));
  }

  /**
   * 设置子级属性值
   */
  setPropValue(propName: string, value: any) {
    this.nodes.forEach((node) => {
      node.setPropValue(propName, value);
    });
  }

  /**
   * 清除已设置值
   */
  clearPropValue(propName: string) {
    this.nodes.forEach((node) => {
      node.clearPropValue(propName);
    });
  }

  /**
   * 获取子级属性值
   */
  getPropValue(propName: string): any {
    return this.first.getProp(propName, true)?.getValue();
  }

  /**
   * 获取顶层附属属性值
   */
  getExtraPropValue(propName: string) {
    return this.first.getExtraProp(propName, false)?.getValue();
  }

  /**
   * 设置顶层附属属性值
   */
  setExtraPropValue(propName: string, value: any) {
    this.nodes.forEach((node) => {
      node.getExtraProp(propName, true)?.setValue(value);
    });
  }

  // 设置多个属性值，替换原有值
  setProps(data: object) {
    this.nodes.forEach((node) => {
      node.setProps(data as any);
    });
  }

  // 设置多个属性值，和原有值合并
  mergeProps(data: object) {
    this.nodes.forEach((node) => {
      node.mergeProps(data as any);
    });
  }

  private disposeItems() {
    this._items.forEach((item) => isPurgeable(item) && item.purge());
    this._items = [];
  }

  purge() {
    this.disposeItems();
    this.emitter.removeAllListeners();
  }


  // ==== compatibles for vision =====
  getProp(propName: string | number) {
    return this.get(propName);
  }

  // ==== copy some Node api =====
  // `VE.Node.getProps`
  getStatus() {

  }
  setStatus() {

  }
  getChildren() {
    // this.nodes.map()
  }
  getDOMNode() {

  }
  getId() {
    return this.id;
  }
  getPage() {
    return this.first.document;
  }

  /**
   * @deprecated
   */
  getNode() {
    return this.nodes[0];
  }
}

interface Purgeable {
  purge(): void;
}
function isPurgeable(obj: any): obj is Purgeable {
  return obj && obj.purge;
}
