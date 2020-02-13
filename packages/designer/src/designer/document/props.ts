import { untracked, computed, obx } from '@recore/obx';
import { uniqueId, isPlainObject, hasOwnProperty } from '../../utils';
import { valueToSource } from '../../utils/value-to-source';
import { CompositeValue, isJSExpression, PropsList, PropsMap } from '../schema';
import StashSpace from './stash-space';

export const UNSET = Symbol.for('unset');
export type UNSET = typeof UNSET;

export interface IPropParent {
  delete(prop: Prop): void;
}

export class Prop implements IPropParent {
  readonly isProp = true;

  readonly id = uniqueId('prop$');

  private _type: 'unset' | 'literal' | 'map' | 'list' | 'expression' = 'unset';
  /**
   * 属性类型
   */
  get type(): 'unset' | 'literal' | 'map' | 'list' | 'expression' {
    return this._type;
  }

  @obx.ref private _value: any = UNSET;

  /**
   * 属性值
   */
  @computed get value(): CompositeValue {
    if (this._type === 'unset') {
      return null;
    }

    const type = this._type;
    if (type === 'literal' || type === 'expression') {
      return this._value;
    }

    if (type === 'map') {
      if (!this._items) {
        return this._value;
      }
      const maps: any = {};
      this.items!.forEach((prop, key) => {
        maps[key] = prop.value;
      });
      return maps;
    }

    if (type === 'list') {
      if (!this._items) {
        return this._items;
      }
      return this.items!.map(prop => prop.value);
    }

    return null;
  }

  /**
   * set value, val should be JSON Object
   */
  set value(val: CompositeValue) {
    this._value = val;
    const t = typeof val;
    if (val == null) {
      this._value = null;
      this._type = 'literal';
    } else if (t === 'string' || t === 'number' || t === 'boolean') {
      this._value = val;
      this._type = 'literal';
    } else if (Array.isArray(val)) {
      this._type = 'list';
    } else if (isPlainObject(val)) {
      if (isJSExpression(val)) {
        this._type = 'expression';
      } else {
        this._type = 'map';
      }
      this._type = 'map';
    } else {
      this._type = 'expression';
      this._value = {
        type: 'JSExpression',
        value: valueToSource(val),
      };
    }
    if (untracked(() => this._items)) {
      this._items!.forEach(prop => prop.purge());
      this._items = null;
    }
    this._maps = null;
    if (this.stash) {
      this.stash.clear();
    }
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

  /**
   * 值是否包含表达式
   * 包含 JSExpresion | JSSlot 等值
   */
  isContainJSExpression(): boolean {
    const type = this._type;
    if (type === 'expression') {
      return true;
    }
    if (type === 'literal' || type === 'unset') {
      return false;
    }
    if ((type === 'list' || type === 'map') && this.items) {
      return this.items.some(item => item.isContainJSExpression());
    }
    return false;
  }

  /**
   * 是否简单 JSON 数据
   */
  isJSON() {
    return !this.isContainJSExpression();
  }

  private _items: Prop[] | null = null;
  private _maps: Map<string, Prop> | null = null;
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
  @computed private get maps(): Map<string, Prop> | null {
    if (!this.items || this.items.length < 1) {
      return null;
    }
    return this._maps;
  }

  private stash: StashSpace | undefined;

  /**
   * 键值
   */
  @obx key: string | number | undefined;
  /**
   * 扩展值
   */
  @obx spread: boolean;

  constructor(
    public parent: IPropParent,
    value: CompositeValue | UNSET = UNSET,
    key?: string | number,
    spread = false,
  ) {
    if (value !== UNSET) {
      this.value = value;
    }
    this.key = key;
    this.spread = spread;
  }

  /**
   * 获取某个属性
   * @param stash 强制
   */
  get(path: string, stash: false): Prop | null;
  /**
   * 获取某个属性, 如果不存在，临时获取一个待写入
   * @param stash 强制
   */
  get(path: string, stash: true): Prop;
  /**
   * 获取某个属性, 如果不存在，临时获取一个待写入
   */
  get(path: string): Prop;
  get(path: string, stash = true) {
    const type = this._type;
    if (type !== 'map' && type !== 'unset' && !stash) {
      return null;
    }

    const maps = type === 'map' ? this.maps : null;

    let prop: any = maps ? maps.get(path) : null;

    if (prop) {
      return prop;
    }

    const i = path.indexOf('.');
    let entry = path;
    let nest = '';
    if (i > 0) {
      nest = path.slice(i + 1);
      if (nest) {
        entry = path.slice(0, i);
        prop = maps ? maps.get(entry) : null;
        if (prop) {
          return prop.get(nest, stash);
        }
      }
    }

    if (stash) {
      if (!this.stash) {
        this.stash = new StashSpace(
          item => {
            // item take effect
            this.set(String(item.key), item);
            item.parent = this;
          },
          () => {
            return true;
          },
        );
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
  size(): number {
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
      this.value = [];
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
  set(key: string, value: CompositeValue | Prop, force = false) {
    const type = this._type;
    if (type !== 'map' && type !== 'unset' && !force) {
      return null;
    }
    if (type === 'unset' || (force && type !== 'map')) {
      this.value = {};
    }
    const prop = isProp(value) ? value : new Prop(this, value, key);
    const items = this.items!;
    const maps = this.maps!;
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
      this._items.forEach(item => item.purge());
    }
    this._maps = null;
  }

  /**
   * 迭代器
   */
  [Symbol.iterator](): { next(): { value: Prop } } {
    let index = 0;
    const items = this.items;
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
    const items = this.items;
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
    const items = this.items;
    if (!items) {
      return null;
    }
    const isMap = this._type === 'map';
    return items.map((item, index) => {
      return isMap ? fn(item, item.key) : fn(item, index);
    });
  }
}

export function isProp(obj: any): obj is Prop {
  return obj && obj.isProp;
}

export default class Props<O = any> implements IPropParent {
  @obx.val private items: Prop[] = [];
  @obx.ref private get maps(): Map<string, Prop> {
    const maps = new Map();
    if (this.items.length > 0) {
      this.items.forEach(prop => {
        if (prop.key) {
          maps.set(prop.key, prop);
        }
      });
    }
    return maps;
  }

  private stash = new StashSpace(
    prop => {
      this.items.push(prop);
      prop.parent = this;
    },
    () => {
      return true;
    },
  );

  /**
   * 元素个数
   */
  get size() {
    return this.items.length;
  }

  @computed get value(): PropsMap | PropsList | null {
    if (this.items.length < 1) {
      return null;
    }
    if (this.type === 'list') {
      return this.items.map(item => ({
        spread: item.spread,
        name: item.key as string,
        value: item.value,
      }));
    }
    const maps: any = {};
    this.items.forEach(prop => {
      if (prop.key) {
        maps[prop.key] = prop.value;
      }
    });
    return maps;
  }

  @obx type: 'map' | 'list' = 'map';

  constructor(readonly owner: O, value?: PropsMap | PropsList | null) {
    if (Array.isArray(value)) {
      this.type = 'list';
      value.forEach(item => {});
    } else if (value != null) {
      this.type = 'map';
    }
  }

  /**
   * 根据 path 路径查询属性，如果没有则临时生成一个
   */
  query(path: string): Prop;
  /**
   * 根据 path 路径查询属性
   *
   * @useStash 如果没有则临时生成一个
   */
  query(path: string, useStash: true): Prop;
  /**
   * 根据 path 路径查询属性
   */
  query(path: string, useStash: false): Prop | null;
  /**
   * 根据 path 路径查询属性
   *
   * @useStash 如果没有则临时生成一个
   */
  query(path: string, useStash: boolean = true) {
    let matchedLength = 0;
    let firstMatched = null;
    if (this.items) {
      // target: a.b.c
      // trys: a.b.c, a.b, a
      let i = this.items.length;
      while (i-- > 0) {
        const expr = this.items[i];
        if (!expr.key) {
          continue;
        }
        const name = String(expr.key);
        if (name === path) {
          // completely match
          return expr;
        }

        // fisrt match
        const l = name.length;
        if (path.slice(0, l + 1) === `${name}.`) {
          matchedLength = l;
          firstMatched = expr;
        }
      }
    }

    let ret = null;
    if (firstMatched) {
      ret = firstMatched.get(path.slice(matchedLength + 1), true);
    }
    if (!ret && useStash) {
      return this.stash.get(path);
    }

    return ret;
  }

  /**
   * 获取某个属性, 如果不存在，临时获取一个待写入
   * @param useStash 强制
   */
  get(path: string, useStash: true): Prop;
  /**
   * 获取某个属性
   * @param useStash 强制
   */
  get(path: string, useStash: false): Prop | null;
  /**
   * 获取某个属性
   */
  get(path: string): Prop | null;
  get(name: string, useStash = false) {
    return this.maps.get(name) || (useStash && this.stash.get(name)) || null;
  }

  /**
   * 删除项
   */
  delete(prop: Prop): void {
    const i = this.items.indexOf(prop);
    if (i > -1) {
      this.items.splice(i, 1);
      prop.purge();
    }
  }

  /**
   * 删除 key
   */
  deleteKey(key: string): void {
    this.items = this.items.filter(item => {
      if (item.key === key) {
        item.purge();
        return false;
      }
      return true;
    });
  }

  /**
   * 添加值
   */
  add(value: CompositeValue | null, key?: string | number, spread = false): Prop {
    const prop = new Prop(this, value, key, spread);
    this.items.push(prop);
    return prop;
  }

  /**
   * 是否存在 key
   */
  has(key: string): boolean {
    return this.maps.has(key);
  }

  /**
   * 迭代器
   */
  [Symbol.iterator](): { next(): { value: Prop } } {
    let index = 0;
    const items = this.items;
    const length = items.length || 0;
    return {
      next() {
        if (index < length) {
          return {
            value: items[index++],
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
    this.items.forEach(item => {
      return fn(item, item.key);
    });
  }

  /**
   * 遍历
   */
  map<T>(fn: (item: Prop, key: number | string | undefined) => T): T[] | null {
    return this.items.map(item => {
      return fn(item, item.key);
    });
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
    this.stash.purge();
    this.items.forEach(item => item.purge());
  }
}
