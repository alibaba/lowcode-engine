import { untracked, computed, obx, engineConfig, action, makeObservable, mobx, runInAction } from '@alilc/lowcode-editor-core';
import { GlobalEvent, IPublicEnumTransformStage } from '@alilc/lowcode-types';
import type { IPublicTypeCompositeValue, IPublicTypeJSSlot, IPublicTypeSlotSchema, IPublicModelProp } from '@alilc/lowcode-types';
import { uniqueId, isPlainObject, hasOwnProperty, compatStage, isJSExpression, isJSSlot, isNodeSchema } from '@alilc/lowcode-utils';
import { valueToSource } from './value-to-source';
import { IPropParent } from './props';
import type { IProps } from './props';
import { ISlotNode, INode } from '../node';
// import { TransformStage } from '../transform-stage';

const { set: mobxSet, isObservableArray } = mobx;
export const UNSET = Symbol.for('unset');
// eslint-disable-next-line no-redeclare
export type UNSET = typeof UNSET;

export interface IProp extends Omit<IPublicModelProp<
  INode
>, 'exportSchema' | 'node'>, IPropParent {
  key: string | number | undefined;

  readonly props: IProps;

  readonly owner: INode;

  delete(prop: IProp): void;

  export(stage: IPublicEnumTransformStage): IPublicTypeCompositeValue;

  getNode(): INode;

  getAsString(): string;

  unset(): void;

  get value(): IPublicTypeCompositeValue | UNSET;

  compare(other: IProp | null): number;

  isUnset(): boolean;

  purge(): void;

  setupItems(): IProp[] | null;

  get type(): ValueTypes;

  get size(): number;

  get code(): string;
}

export type ValueTypes = 'unset' | 'literal' | 'map' | 'list' | 'expression' | 'slot';

export class Prop implements IProp, IPropParent {
  readonly isProp = true;

  readonly owner: INode;

  /**
   * 键值
   */
  @obx key: string | number | undefined;

  /**
   * 扩展值
   */
  @obx spread: boolean;

  readonly props: IProps;

  readonly options: any;

  readonly id = uniqueId('prop$');

  @obx.ref private _type: ValueTypes = 'unset';

  /**
   * 属性类型
   */
  get type(): ValueTypes {
    return this._type;
  }

  @obx private _value: any = UNSET;

  /**
   * 属性值
   */
  @computed get value(): IPublicTypeCompositeValue | UNSET {
    return this.export(IPublicEnumTransformStage.Serilize);
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
      return JSON.stringify(this._slotNode!.export(IPublicEnumTransformStage.Save));
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

  private _slotNode?: INode | null;

  get slotNode(): INode | null {
    return this._slotNode || null;
  }

  @obx.shallow private _items: IProp[] | null = null;

  @obx.shallow private _maps: Map<string | number, IProp> | null = null;

  /**
   * 作为 _maps 的一层缓存机制，主要是复用部分已存在的 Prop，保持响应式关系，比如：
   * 当前 Prop#_value 值为 { a: 1 }，当调用 setValue({ a: 2 }) 时，所有原来的子 Prop 均被销毁，
   * 导致假如外部有 mobx reaction（常见于 observer），此时响应式链路会被打断，
   * 因为 reaction 监听的是原 Prop(a) 的 _value，而不是新 Prop(a) 的 _value。
   */
  private _prevMaps: Map<string | number, IProp> | null = null;

  /**
   * 构造 items 属性，同时构造 maps 属性
   */
  private get items(): IProp[] | null {
    if (this._items) return this._items;
    return runInAction(() => {
      let items: IProp[] | null = null;
      if (this._type === 'list') {
        const maps = new Map<string, IProp>();
        const data = this._value;
        data.forEach((item: any, idx: number) => {
          items = items || [];
          let prop;
          if (this._prevMaps?.has(idx.toString())) {
            prop = this._prevMaps.get(idx.toString())!;
            prop.setValue(item);
          } else {
            prop = new Prop(this, item, idx);
          }
          maps.set(idx.toString(), prop);
          items.push(prop);
        });
        this._maps = maps;
      } else if (this._type === 'map') {
        const data = this._value;
        const maps = new Map<string, IProp>();
        const keys = Object.keys(data);
        for (const key of keys) {
          let prop: IProp;
          if (this._prevMaps?.has(key)) {
            prop = this._prevMaps.get(key)!;
            prop.setValue(data[key]);
          } else {
            prop = new Prop(this, data[key], key);
          }
          items = items || [];
          items.push(prop);
          maps.set(key, prop);
        }
        this._maps = maps;
      } else {
        items = null;
        this._maps = null;
      }
      this._items = items;
      return this._items;
    });
  }

  @computed private get maps(): Map<string | number, IProp> | null {
    if (!this.items) {
      return null;
    }
    return this._maps;
  }

  get path(): string[] {
    return (this.parent.path || []).concat(this.key as string);
  }

  /**
   * 元素个数
   */
  get size(): number {
    return this.items?.length || 0;
  }

  private purged = false;

  constructor(
    public parent: IPropParent,
    value: IPublicTypeCompositeValue | UNSET = UNSET,
    key?: string | number,
    spread = false,
    options = {},
  ) {
    makeObservable(this);
    this.owner = parent.owner;
    this.props = parent.props;
    this.key = key;
    this.spread = spread;
    this.options = options;
    if (value !== UNSET) {
      this.setValue(value);
    }
    this.setupItems();
  }

  // TODO: 先用调用方式触发子 prop 的初始化，后续须重构
  @action
  setupItems() {
    return this.items;
  }

  /**
   * @see SettingTarget
   */
  @action
  getPropValue(propName: string | number): any {
    return this.get(propName)!.getValue();
  }

  /**
   * @see SettingTarget
   */
  @action
  setPropValue(propName: string | number, value: any): void {
    this.set(propName, value);
  }

  /**
   * @see SettingTarget
   */
  @action
  clearPropValue(propName: string | number): void {
    this.get(propName, false)?.unset();
  }

  export(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Save): IPublicTypeCompositeValue {
    stage = compatStage(stage);
    const type = this._type;
    if (stage === IPublicEnumTransformStage.Render && this.key === '___condition___') {
      // 在设计器里，所有组件默认需要展示，除非开启了 enableCondition 配置
      if (engineConfig?.get('enableCondition') !== true) {
        return true;
      }
      return this._value;
    }

    if (type === 'unset') {
      return undefined;
    }

    if (type === 'literal' || type === 'expression') {
      // TODO 后端改造之后删除此逻辑
      if (this._value === null && stage === IPublicEnumTransformStage.Save) {
        return '';
      }
      return this._value;
    }

    if (type === 'slot') {
      const schema = this._slotNode?.export(stage) || {} as any;
      if (stage === IPublicEnumTransformStage.Render) {
        return {
          type: 'JSSlot',
          params: schema.params,
          value: schema,
          id: schema.id,
        };
      }
      return {
        type: 'JSSlot',
        params: schema.params,
        value: schema.children,
        title: schema.title,
        name: schema.name,
        id: schema.id,
      };
    }

    if (type === 'map') {
      if (!this._items) {
        return this._value;
      }
      let maps: any;
      this.items!.forEach((prop, key) => {
        if (!prop.isUnset()) {
          const v = prop.export(stage);
          if (v != null) {
            maps = maps || {};
            maps[prop.key || key] = v;
          }
        }
      });
      return maps;
    }

    if (type === 'list') {
      if (!this._items) {
        return this._value;
      }
      const values = this.items!.map((prop) => {
        return prop?.export(stage);
      });
      if (values.every((val) => val === undefined)) {
        return undefined;
      }
      return values;
    }
  }

  getAsString(): string {
    if (this.type === 'literal') {
      return this._value ? String(this._value) : '';
    }
    return '';
  }

  /**
   * set value, val should be JSON Object
   */
  @action
  setValue(val: IPublicTypeCompositeValue) {
    if (val === this._value) return;
    const editor = this.owner.document?.designer.editor;
    const oldValue = this._value;
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
      if (isJSSlot(val)) {
        this.setAsSlot(val);
      } else if (isJSExpression(val)) {
        this._type = 'expression';
      } else {
        this._type = 'map';
      }
    } else /* istanbul ignore next */ {
      this._type = 'expression';
      this._value = {
        type: 'JSExpression',
        value: valueToSource(val),
      };
    }

    this.dispose();
    // setValue 的时候，如果不重新建立 items，items 的 setValue 没有触发，会导致子项的响应式逻辑不能被触发
    this.setupItems();

    if (oldValue !== this._value) {
      const propsInfo = {
        key: this.key,
        prop: this,
        oldValue,
        newValue: this._value,
      };

      editor?.eventBus.emit(GlobalEvent.Node.Prop.InnerChange, {
        node: this.owner as any,
        ...propsInfo,
      });

      this.owner?.emitPropChange?.(propsInfo);
    }
  }

  getValue(): IPublicTypeCompositeValue {
    return this.export(IPublicEnumTransformStage.Serilize);
  }

  @action
  private dispose() {
    const items = untracked(() => this._items);
    if (items) {
      items.forEach((prop) => prop.purge());
    }
    this._items = null;
    this._prevMaps = this._maps;
    this._maps = null;
    if (this._type !== 'slot' && this._slotNode) {
      this._slotNode.remove();
      this._slotNode = undefined;
    }
  }

  @action
  setAsSlot(data: IPublicTypeJSSlot) {
    this._type = 'slot';
    let slotSchema: IPublicTypeSlotSchema;
    // 当 data.value 的结构为 { componentName: 'Slot' } 时，复用部分 slotSchema 数据
    if ((isPlainObject(data.value) && isNodeSchema(data.value) && data.value?.componentName === 'Slot')) {
      const value = data.value as IPublicTypeSlotSchema;
      slotSchema = {
        componentName: 'Slot',
        title: value.title || value.props?.slotTitle,
        id: value.id,
        name: value.name || value.props?.slotName,
        params: value.params || value.props?.slotParams,
        children: value.children,
      } as IPublicTypeSlotSchema;
    } else {
      slotSchema = {
        componentName: 'Slot',
        title: data.title,
        id: data.id,
        name: data.name,
        params: data.params,
        children: data.value,
      };
    }

    if (this._slotNode) {
      this._slotNode.import(slotSchema);
    } else {
      const { owner } = this.props;
      this._slotNode = owner.document?.createNode<ISlotNode>(slotSchema);
      if (this._slotNode) {
        owner.addSlot(this._slotNode);
        this._slotNode.internalSetSlotFor(this);
      }
    }
  }

  /**
   * 取消设置值
   */
  @action
  unset() {
    this._type = 'unset';
  }

  /**
   * 是否未设置值
   */
  @action
  isUnset() {
    return this._type === 'unset';
  }

  isVirtual() {
    return typeof this.key === 'string' && this.key.charAt(0) === '!';
  }

  /**
   * @returns  0: the same 1: maybe & like 2: not the same
   */
  compare(other: IProp | null): number {
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

  /**
   * 获取某个属性
   * @param createIfNone 当没有的时候，是否创建一个
   */
  @action
  get(path: string | number, createIfNone = true): IProp | null {
    const type = this._type;
    if (type !== 'map' && type !== 'list' && type !== 'unset' && !createIfNone) {
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
      return nest ? prop.get(nest, createIfNone) : prop;
    }

    if (createIfNone) {
      prop = new Prop(this, UNSET, entry);
      this.set(entry, prop, true);
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
  @action
  remove() {
    this.parent.delete(this);
  }

  /**
   * 删除项
   */
  @action
  delete(prop: IProp): void {
    /* istanbul ignore else */
    if (this._items) {
      const i = this._items.indexOf(prop);
      if (i > -1) {
        this._items.splice(i, 1);
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
  @action
  deleteKey(key: string): void {
    /* istanbul ignore else */
    if (this.maps) {
      const prop = this.maps.get(key);
      if (prop) {
        this.delete(prop);
      }
    }
  }

  /**
   * 添加值到列表
   *
   * @param force 强制
   */
  @action
  add(value: IPublicTypeCompositeValue, force = false): IProp | null {
    const type = this._type;
    if (type !== 'list' && type !== 'unset' && !force) {
      return null;
    }
    if (type === 'unset' || (force && type !== 'list')) {
      this.setValue([]);
    }
    const prop = new Prop(this, value);
    this._items = this._items || [];
    this._items.push(prop);
    return prop;
  }

  /**
   * 设置值到字典
   *
   * @param force 强制
   */
  @action
  set(key: string | number, value: IPublicTypeCompositeValue | Prop, force = false) {
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
    let items = this._items! || [];
    if (this.type === 'list') {
      if (!isValidArrayIndex(key)) {
        return null;
      }
      if (isObservableArray(items)) {
        mobxSet(items, key, prop);
      } else {
        items[key] = prop;
      }
      this._items = items;
    } else if (this.type === 'map') {
      const maps = this._maps || new Map<string, Prop>();
      const orig = maps?.get(key);
      if (orig) {
        // replace
        const i = items.indexOf(orig);
        if (i > -1) {
          items.splice(i, 1, prop)[0].purge();
        }
        maps?.set(key, prop);
      } else {
        // push
        items.push(prop);
        this._items = items;
        maps?.set(key, prop);
      }
      this._maps = maps;
    } /* istanbul ignore next */ else {
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

  /**
   * 回收销毁
   */
  @action
  purge() {
    if (this.purged) {
      return;
    }
    this.purged = true;
    if (this._items) {
      this._items.forEach((item) => item.purge());
    }
    this._items = null;
    this._maps = null;
    if (this._slotNode && this._slotNode.slotFor === this) {
      this._slotNode.remove();
      this._slotNode = undefined;
    }
  }

  /**
   * 迭代器
   */
  [Symbol.iterator](): { next(): { value: IProp } } {
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
  @action
  forEach(fn: (item: IProp, key: number | string | undefined) => void): void {
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
  @action
  map<T>(fn: (item: IProp, key: number | string | undefined) => T): T[] | null {
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
    return this.props;
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
