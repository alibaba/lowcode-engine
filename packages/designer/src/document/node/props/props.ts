import { computed, obx } from '@ali/lowcode-editor-core';
import { PropsMap, PropsList, CompositeValue } from '@ali/lowcode-types';
import { uniqueId, compatStage } from '@ali/lowcode-utils';
import { PropStash } from './prop-stash';
import { Prop, IPropParent, UNSET } from './prop';
import { Node } from '../node';
import { TransformStage } from '../transform-stage';

export const EXTRA_KEY_PREFIX = '___';
export function getConvertedExtraKey(key: string): string {
  if (!key) {
    return '';
  }
  let _key = key;
  if (key.indexOf('.') > 0) {
    _key = key.split('.')[0];
  }
  return EXTRA_KEY_PREFIX + _key + EXTRA_KEY_PREFIX + key.substr(_key.length);
}
export function getOriginalExtraKey(key: string): string {
  return key.replace(new RegExp(`${EXTRA_KEY_PREFIX}`, 'g'), '');
}
export class Props implements IPropParent {
  readonly id = uniqueId('props');

  @obx.val private items: Prop[] = [];

  @computed private get maps(): Map<string, Prop> {
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

  readonly path = [];

  get props(): Props {
    return this;
  }

  readonly owner: Node;

  private stash: PropStash;

  /**
   * 元素个数
   */
  @computed get size() {
    return this.items.length;
  }

  @obx type: 'map' | 'list' = 'map';

  constructor(owner: Node, value?: PropsMap | PropsList | null, extras?: object) {
    this.owner = owner;
    this.stash = new PropStash(this, prop => {
      this.items.push(prop);
      prop.parent = this;
    });
    if (Array.isArray(value)) {
      this.type = 'list';
      this.items = value.map(item => new Prop(this, item.value, item.name, item.spread, { skipSetSlot: true }));
    } else if (value != null) {
      this.items = Object.keys(value).map(key => new Prop(this, value[key], key, false, { skipSetSlot: true }));
    }
    if (extras) {
      Object.keys(extras).forEach(key => {
        this.items.push(new Prop(this, (extras as any)[key], getConvertedExtraKey(key)));
      });
    }
  }

  import(value?: PropsMap | PropsList | null, extras?: object) {
    this.stash.clear();
    const originItems = this.items;
    if (Array.isArray(value)) {
      this.type = 'list';
      this.items = value.map(item => new Prop(this, item.value, item.name, item.spread));
    } else if (value != null) {
      this.type = 'map';
      this.items = Object.keys(value).map(key => new Prop(this, value[key], key));
    } else {
      this.type = 'map';
      this.items = [];
    }
    if (extras) {
      Object.keys(extras).forEach(key => {
        this.items.push(new Prop(this, (extras as any)[key], getConvertedExtraKey(key)));
      });
    }
    originItems.forEach(item => item.purge());
  }

  merge(value: PropsMap) {
    Object.keys(value).forEach(key => {
      this.query(key, true)!.setValue(value[key]);
    });
  }

  export(stage: TransformStage = TransformStage.Save): { props?: PropsMap | PropsList; extras?: object } {
    stage = compatStage(stage);
    if (this.items.length < 1) {
      return {};
    }
    let props: any = {};
    const extras: any = {};
    if (this.type === 'list') {
      props = [];
      this.items.forEach(item => {
        let value = item.export(stage);
        if (value === UNSET) {
          value = undefined;
        }
        let name = item.key as string;
        if (name && typeof name === 'string' && name.startsWith(EXTRA_KEY_PREFIX)) {
          name = getOriginalExtraKey(name);
          extras[name] = value;
        } else {
          props.push({
            spread: item.spread,
            name,
            value,
          });
        }
      });
    } else {
      this.items.forEach(item => {
        let name = item.key as string;
        if (name == null) {
          // todo ...spread
          return;
        }
        let value = item.export(stage);
        if (value === UNSET) {
          value = undefined;
        }
        if (typeof name === 'string' && name.startsWith(EXTRA_KEY_PREFIX)) {
          name = getOriginalExtraKey(name);
          extras[name] = value;
        } else {
          props[name] = value;
        }
      });
    }

    return { props, extras };
  }

  /**
   * 根据 path 路径查询属性
   *
   * @param stash 如果没有则临时生成一个
   */
  query(path: string, stash = true): Prop | null {
    return this.get(path, stash);
    // todo: future support list search
    // let matchedLength = 0;
    // let firstMatched = null;
    // if (this.items) {
    //   // target: a.b.c
    //   // trys: a.b.c, a.b, a
    //   let i = this.items.length;
    //   while (i-- > 0) {
    //     const expr = this.items[i];
    //     if (!expr.key) {
    //       continue;
    //     }
    //     const name = String(expr.key);
    //     if (name === path) {
    //       // completely match
    //       return expr;
    //     }

    //     // fisrt match
    //     const l = name.length;
    //     if (path.slice(0, l + 1) === `${name}.`) {
    //       matchedLength = l;
    //       firstMatched = expr;
    //     }
    //   }
    // }

    // let ret = null;
    // if (firstMatched) {
    //   ret = firstMatched.get(path.slice(matchedLength + 1), true);
    // }
    // if (!ret && stash) {
    //   return this.stash.get(path);
    // }

    // return ret;
  }

  /**
   * 获取某个属性, 如果不存在，临时获取一个待写入
   * @param stash 强制
   */
  get(path: string, stash = false): Prop | null {
    let entry = path;
    let nest = '';
    const i = path.indexOf('.');
    if (i > 0) {
      nest = path.slice(i + 1);
      if (nest) {
        entry = path.slice(0, i);
      }
    }

    const prop = this.maps.get(entry) || (stash && this.stash.get(entry)) || null;

    if (prop) {
      return nest ? prop.get(nest, stash) : prop;
    }

    return null;
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
  add(value: CompositeValue | null, key?: string | number, spread = false, options: any = {}): Prop {
    const prop = new Prop(this, value, key, spread, options);
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
    const { items } = this;
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

  filter(fn: (item: Prop, key: number | string | undefined) => boolean) {
    return this.items.filter(item => {
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

  getProp(path: string, stash = true): Prop | null {
    return this.query(path, stash as any) || null;
  }

  /**
   * 获取单个属性值
   */
  getPropValue(path: string): any {
    return this.getProp(path, false)?.value;
  }

  /**
   * 设置单个属性值
   */
  setPropValue(path: string, value: any) {
    this.getProp(path, true)!.setValue(value);
  }

  /**
   * 获取 props 对应的 node
   */
  getNode() {
    return this.owner;
  }

  /**
   * @deprecated
   * 获取 props 对应的 node
   */
  toData() {
    return this.export()?.props;
  }
}
