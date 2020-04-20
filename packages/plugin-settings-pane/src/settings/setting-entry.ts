import { EventEmitter } from 'events';
import { Node, ComponentMeta, Designer } from '@ali/lowcode-designer';
import { CustomView, obx, uniqueId, computed, isCustomView } from '@ali/lowcode-globals';
import Editor from '@ali/lowcode-editor-core';
import { SettingTarget } from './setting-target';
import { SettingField } from './setting-field';

export function generateSessionId(nodes: Node[]) {
  return nodes
    .map((node) => node.id)
    .sort()
    .join(',');
}

export class SettingTopEntry implements SettingTarget {
  private emitter = new EventEmitter();
  private _items: Array<SettingField | CustomView> = [];
  private _componentMeta: ComponentMeta | null = null;
  private _isSame: boolean = true;
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
  get isOneNode(): boolean {
    return this.nodes.length === 1;
  }

  /**
   * 多个
   */
  get isMultiNodes(): boolean {
    return this.nodes.length > 1;
  }

  readonly id: string;
  readonly first: Node;
  readonly designer: Designer;

  constructor(readonly editor: Editor, readonly nodes: Node[], ) {
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
      this._items = this.componentMeta.configure.map((item) => {
        if (isCustomView(item)) {
          return item;
        }
        return new SettingField(this, item as any);
      });
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
    return new SettingPropEntry(this, propName);
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
   * 获取子级属性值
   */
  getPropValue(propName: string): any {
    return this.first.getProp(propName, true)?.getValue();
  }

  /**
   * 获取兄弟项
   */
  getSibling(propName: string | number) {
    return null;
  }

  /**
   * 取得兄弟属性值
   */
  getSiblingValue(propName: string | number): any {
    return null;
  }

  /**
   * 设置兄弟属性值
   */
  setSiblingValue(propName: string | number, value: any): void {
    // noop
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
}

export interface Purgeable {
  purge(): void;
}
export function isPurgeable(obj: any): obj is Purgeable {
  return obj && obj.purge;
}


export class SettingPropEntry implements SettingTarget {
  // === static properties ===
  readonly editor: Editor;
  readonly isSameComponent: boolean;
  readonly isMultiNodes: boolean;
  readonly isOneNode: boolean;
  readonly nodes: Node[];
  readonly componentMeta: ComponentMeta | null;
  readonly designer: Designer;
  readonly top: SettingTarget;
  readonly isGroup: boolean;
  readonly type: 'field' | 'group';
  readonly id = uniqueId('entry');

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

  constructor(readonly parent: SettingTarget, name: string | number, type?: 'field' | 'group') {
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
    this.isMultiNodes = parent.isMultiNodes;
    this.isOneNode = parent.isOneNode;
    this.designer = parent.designer;
    this.top = parent.top;
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

  remove() {
    if (this.type !== 'field') {
      return;
    }
    const propName = this.path.join('.');
    let l = this.nodes.length;
    while (l-- > 1) {
      this.nodes[l].getProp(propName)?.remove()
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
    // TODO: emit value change
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
   * 获取兄弟项
   */
  getSibling(propName: string | number) {
    return this.parent.get(propName);
  }

  /**
   * 取得兄弟属性值
   */
  getSiblingValue(propName: string | number): any {
    return this.parent.getPropValue(propName);
  }

  /**
   * 设置兄弟属性值
   */
  setSiblingValue(propName: string | number, value: any): void {
    this.parent.setPropValue(propName, value);
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

  getProps() {
    return this.top;
  }

  onValueChange() {
    return () => {};
  }
}
