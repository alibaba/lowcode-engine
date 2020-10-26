import { untracked, computed, obx } from '@ali/lowcode-editor-core';
import { CompositeValue, isJSExpression, isJSSlot, JSSlot, SlotSchema } from '@ali/lowcode-types';
import { uniqueId, isPlainObject, hasOwnProperty } from '@ali/lowcode-utils';
import { PropStash } from './prop-stash';
import { valueToSource } from './value-to-source';
import { Props } from './props';
import { SlotNode, Node } from '../node';
import { TransformStage } from '../transform-stage';

export const UNSET = Symbol.for('unset');
export type UNSET = typeof UNSET;

export interface IPropParent {
  delete(prop: Prop): void;
  readonly props: Props;
  readonly owner: Node;
}

export type ValueTypes = 'unset' | 'literal' | 'map' | 'list' | 'expression' | 'slot';

export class Prop implements IPropParent {
  readonly isProp = true;

  readonly owner: Node;

  private stash: PropStash | undefined;

  /**
   * 键值
   */
  @obx key: string | number | undefined;
  /**
   * 扩展值
   */
  @obx spread: boolean;

  readonly props: Props;
  readonly options: any;

  constructor(
    public parent: IPropParent,
    value: CompositeValue | UNSET = UNSET,
    key?: string | number,
    spread = false,
    options = {},
  ) {
    this.owner = parent.owner;
    this.props = parent.props;
    this.key = key;
    this.spread = spread;
    this.options = options;
    if (value !== UNSET) {
      this.setValue(value);
    }
  }

  /**
   * @see SettingTarget
   */
  getPropValue(propName: string | number): any {
    return this.get(propName)!.getValue();
  }

  /**
   * @see SettingTarget
   */
  setPropValue(propName: string | number, value: any): void {
    this.set(propName, value);
  }

  /**
   * @see SettingTarget
   */
  clearPropValue(propName: string | number): void {
    this.get(propName, false)?.unset();
  }

  readonly id = uniqueId('prop$');

  @obx.ref private _type: ValueTypes = 'unset';

  /**
   * 属性类型
   */
  get type(): ValueTypes {
    return this._type;
  }

  @obx.ref private _value: any = UNSET;

  /**
   * 属性值
   */
  @computed get value(): CompositeValue | UNSET {
    return this.export(TransformStage.Serilize);
  }

  export(stage: TransformStage = TransformStage.Save): CompositeValue | UNSET {
    const type = this._type;

    // 在设计器里，所有组件都需要展示
    if (stage === TransformStage.Render && this.key === '___condition___') {
      return true;
    }

    if (type === 'unset') {
      // return UNSET; @康为 之后 review 下这块改造
      return undefined;
    }

    if (type === 'literal' || type === 'expression') {
      // TODO 后端改造之后删除此逻辑
      if (this._value === null && stage === TransformStage.Save) {
        return '';
      }
      return this._value;
    }

    if (type === 'slot') {
      const schema = this._slotNode?.export(stage) || {};
      if (stage === TransformStage.Render) {
        return {
          type: 'JSSlot',
          params: schema.params,
          value: schema,
        };
      }
      return {
        type: 'JSSlot',
        params: schema.params,
        value: schema.children,
        title: schema.title,
        name: schema.name,
      };
    }

    if (type === 'map') {
      if (!this._items) {
        return this._value;
      }
      const maps: any = {};
      this.items!.forEach((prop, key) => {
        const v = prop.export(stage);
        // if (v !== UNSET) {
        //   maps[prop.key == null ? key : prop.key] = v;
        // }
        // @康为 之后 review 下这块改造
        maps[prop.key == null ? key : prop.key] = v;
      });
      return maps;
    }

    if (type === 'list') {
      if (!this._items) {
        return this._value;
      }
      return this.items!.map((prop) => {
        const v = prop.export(stage);
        return v === UNSET ? undefined : v;
      });
    }

    return undefined;
  }

  private _code: string | null = null;

  /**
   * 获得表达式值
   */
  @computed get code() {
    if (isJSExpression(this.value)) {
      return this.value.value;
    }
    // todo: JSFunction ...
    if (this.type === 'slot') {
      return JSON.stringify(this._slotNode!.export(TransformStage.Save));
    }
    return this._code != null ? this._code : JSON.stringify(this.value);
  }

  /**
   * 设置表达式值
   */
  set code(code: string) {
    if (isJSExpression(this._value)) {
      this.setValue({
        ...this._value,
        value: code,
      });
      this._code = code;
      return;
    }

    try {
      const v = JSON.parse(code);
      this.setValue(v);
      this._code = code;
      return;
    } catch (e) {
      // ignore
    }

    this.setValue({
      type: 'JSExpression',
      value: code,
      mock: this._value,
    });
    this._code = code;
  }

  @computed getAsString(): string {
    if (this.type === 'literal') {
      return this._value ? String(this._value) : '';
    }
    return '';
  }

  /**
   * set value, val should be JSON Object
   */
  setValue(val: CompositeValue) {
    this._value = val;
    this._code = null;
    const t = typeof val;
    if (val == null) {
      // this._value = undefined;
      this._type = 'literal';
    } else if (t === 'string' || t === 'number' || t === 'boolean') {
      this._type = 'literal';
    } else if (Array.isArray(val)) {
      this._type = 'list';
    } else if (isPlainObject(val)) {
      if (isJSSlot(val) && this.options.skipSetSlot !== true) {
        this.setAsSlot(val);
        return;
      }
      if (isJSExpression(val)) {
        this._type = 'expression';
      } else {
        this._type = 'map';
      }
    } else {
      this._type = 'expression';
      this._value = {
        type: 'JSExpression',
        value: valueToSource(val),
      };
    }
    this.dispose();
  }

  @computed getValue(): CompositeValue {
    const v = this.export(TransformStage.Serilize);
    if (v === UNSET) {
      return undefined;
    }
    return v;
  }

  private dispose() {
    const items = untracked(() => this._items);
    if (items) {
      items.forEach((prop) => prop.purge());
    }
    this._items = null;
    this._maps = null;
    if (this.stash) {
      this.stash.clear();
    }
    if (this._type !== 'slot' && this._slotNode) {
      this._slotNode.purge();
      this._slotNode = undefined;
    }
  }

  private _slotNode?: SlotNode;

  get slotNode() {
    return this._slotNode;
  }

  setAsSlot(data: JSSlot) {
    this._type = 'slot';
    const slotSchema: SlotSchema = {
      componentName: 'Slot',
      title: data.title,
      name: data.name,
      params: data.params,
      children: data.value,
    };
    if (this._slotNode) {
      this._slotNode.import(slotSchema);
    } else {
      const { owner } = this.props;
      this._slotNode = owner.document.createNode<SlotNode>(slotSchema);
      owner.addSlot(this._slotNode);
      this._slotNode.internalSetSlotFor(this);
    }
    this.dispose();
  }

  /**
   * 取消设置值
   */
  unset() {
    this._type = 'unset';
  }

  /**
   * 是否未设置值
   */
  isUnset() {
    return this._type === 'unset';
  }

  isVirtual() {
    return typeof this.key === 'string' && this.key.charAt(0) === '!';
  }

  /**
   * @returns  0: the same 1: maybe & like 2: not the same
   */
  compare(other: Prop | null): number {
    if (!other || other.isUnset()) {
      return this.isUnset() ? 0 : 2;
    }
    if (other.type !== this.type) {
      return 2;
    }
    // list
    if (this.type === 'list') {
      return this.size === other.size ? 1 : 2;
    }
    if (this.type === 'map') {
      return 1;
    }

    // 'literal' | 'map' | 'expression' | 'slot'
    return this.code === other.code ? 0 : 2;
  }

  @obx.val private _items: Prop[] | null = null;

  @obx.val private _maps: Map<string | number, Prop> | null = null;

  @computed private get items(): Prop[] | null {
    let _items: any;
    untracked(() => {
      _items = this._items;
    });
    if (!_items) {
      if (this._type === 'list') {
        const data = this._value;
        const items = [];
        for (const item of data) {
          items.push(new Prop(this, item));
        }
        _items = items;
        this._maps = null;
      } else if (this._type === 'map') {
        const data = this._value;
        const items = [];
        const maps = new Map<string, Prop>();
        const keys = Object.keys(data);
        for (const key of keys) {
          const prop = new Prop(this, data[key], key);
          items.push(prop);
          maps.set(key, prop);
        }
        _items = items;
        this._maps = maps;
      } else {
        _items = null;
        this._maps = null;
      }
      this._items = _items;
    }
    return _items;
  }

  @computed private get maps(): Map<string | number, Prop> | null {
    if (!this.items) {
      return null;
    }
    return this._maps;
  }

  /**
   * 获取某个属性
   * @param stash 如果不存在，临时获取一个待写入
   */
  get(path: string | number, stash = true): Prop | null {
    const type = this._type;
    if (type !== 'map' && type !== 'list' && type !== 'unset' && !stash) {
      return null;
    }

    const maps = type === 'map' ? this.maps : null;
    const items = type === 'list' ? this.items : null;

    let entry = path;
    let nest = '';
    if (typeof path !== 'number') {
      const i = path.indexOf('.');
      if (i > 0) {
        nest = path.slice(i + 1);
        if (nest) {
          entry = path.slice(0, i);
        }
      }
    }

    let prop: any;
    if (type === 'list') {
      if (isValidArrayIndex(entry, this.size)) {
        prop = items![entry];
      }
    } else if (type === 'map') {
      prop = maps?.get(entry);
    }

    if (prop) {
      return nest ? prop.get(nest, stash) : prop;
    }

    if (stash) {
      if (!this.stash) {
        this.stash = new PropStash(this.props, (item) => {
          // item take effect
          if (item.key) {
            this.set(item.key, item, true);
          }
          item.parent = this;
        });
      }
      prop = this.stash.get(entry);
      if (nest) {
        return prop.get(nest, true);
      }

      return prop;
    }

    return null;
  }

  /**
   * 从父级移除本身
   */
  remove() {
    this.parent.delete(this);
  }

  /**
   * 删除项
   */
  delete(prop: Prop): void {
    if (this.items) {
      const i = this.items.indexOf(prop);
      if (i > -1) {
        this.items.slice(i, 1);
        prop.purge();
      }
      if (this._maps && prop.key) {
        this._maps.delete(String(prop.key));
      }
    }
  }

  /**
   * 删除 key
   */
  deleteKey(key: string): void {
    if (this.maps) {
      const prop = this.maps.get(key);
      if (prop) {
        this.delete(prop);
      }
    }
  }

  /**
   * 元素个数
   */
  get size(): number {
    return this.items?.length || 0;
  }

  /**
   * 添加值到列表
   *
   * @param force 强制
   */
  add(value: CompositeValue, force = false): Prop | null {
    const type = this._type;
    if (type !== 'list' && type !== 'unset' && !force) {
      return null;
    }
    if (type === 'unset' || (force && type !== 'list')) {
      this.setValue([]);
    }
    const prop = new Prop(this, value);
    this.items!.push(prop);
    return prop;
  }

  /**
   * 设置值到字典
   *
   * @param force 强制
   */
  set(key: string | number, value: CompositeValue | Prop, force = false) {
    const type = this._type;
    if (type !== 'map' && type !== 'list' && type !== 'unset' && !force) {
      return null;
    }
    if (type === 'unset' || (force && type !== 'map')) {
      if (isValidArrayIndex(key)) {
        if (type !== 'list') {
          this.setValue([]);
        }
      } else {
        this.setValue({});
      }
    }
    const prop = isProp(value) ? value : new Prop(this, value, key);
    const items = this.items!;
    if (this.type === 'list') {
      if (!isValidArrayIndex(key)) {
        return null;
      }
      items[key] = prop;
    } else if (this.maps) {
      const { maps } = this;
      const orig = maps.get(key);
      if (orig) {
        // replace
        const i = items.indexOf(orig);
        if (i > -1) {
          items.splice(i, 1, prop)[0].purge();
        }
        maps.set(key, prop);
      } else {
        // push
        items.push(prop);
        maps.set(key, prop);
      }
    } else {
      return null;
    }

    return prop;
  }

  /**
   * 是否存在 key
   */
  has(key: string): boolean {
    if (this._type !== 'map') {
      return false;
    }
    if (this._maps) {
      return this._maps.has(key);
    }
    return hasOwnProperty(this._value, key);
  }

  private purged = false;

  /**
   * 回收销毁
   */
  purge() {
    if (this.purged) {
      return;
    }
    this.purged = true;
    if (this.stash) {
      this.stash.purge();
    }
    if (this._items) {
      this._items.forEach((item) => item.purge());
    }
    this._maps = null;
    if (this._slotNode && this._slotNode.slotFor === this) {
      this._slotNode.purge();
    }
  }

  /**
   * 迭代器
   */
  [Symbol.iterator](): { next(): { value: Prop } } {
    let index = 0;
    const { items } = this;
    const length = items?.length || 0;
    return {
      next() {
        if (index < length) {
          return {
            value: items![index++],
            done: false,
          };
        }
        return {
          value: undefined as any,
          done: true,
        };
      },
    };
  }

  /**
   * 遍历
   */
  forEach(fn: (item: Prop, key: number | string | undefined) => void): void {
    const { items } = this;
    if (!items) {
      return;
    }
    const isMap = this._type === 'map';
    items.forEach((item, index) => {
      return isMap ? fn(item, item.key) : fn(item, index);
    });
  }

  /**
   * 遍历
   */
  map<T>(fn: (item: Prop, key: number | string | undefined) => T): T[] | null {
    const { items } = this;
    if (!items) {
      return null;
    }
    const isMap = this._type === 'map';
    return items.map((item, index) => {
      return isMap ? fn(item, item.key) : fn(item, index);
    });
  }

  getProps() {
    return this.parent;
  }

  getNode() {
    return this.owner;
  }
}

export function isProp(obj: any): obj is Prop {
  return obj && obj.isProp;
}

export function isValidArrayIndex(key: any, limit = -1): key is number {
  const n = parseFloat(String(key));
  return n >= 0 && Math.floor(n) === n && isFinite(n) && (limit < 0 || n < limit);
}
