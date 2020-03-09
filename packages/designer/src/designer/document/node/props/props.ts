import { computed, obx } from '@recore/obx';
import { uniqueId } from '../../../../../../utils/unique-id';
import { CompositeValue, PropsList, PropsMap } from '../../../schema';
import PropStash from './prop-stash';
import Prop, { IPropParent, UNSET } from './prop';
import { NodeParent } from '../node';

export default class Props implements IPropParent {
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

  get props(): Props {
    return this;
  }

  private stash = new PropStash(this, prop => {
    this.items.push(prop);
    prop.parent = this;
  });

  /**
   * 元素个数
   */
  @computed get size() {
    return this.items.length;
  }

  @computed get value(): PropsMap | PropsList | null {
    return this.export(true);
  }

  @obx type: 'map' | 'list' = 'map';

  constructor(readonly owner: NodeParent, value?: PropsMap | PropsList | null) {
    if (Array.isArray(value)) {
      this.type = 'list';
      this.items = value.map(item => new Prop(this, item.value, item.name, item.spread));
    } else if (value != null) {
      this.items = Object.keys(value).map(key => new Prop(this, value[key], key));
    }
  }

  import(value?: PropsMap | PropsList | null) {
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
    originItems.forEach(item => item.purge());
  }

  merge(value: PropsMap) {
    Object.keys(value).forEach(key => {
      this.query(key, true)!.setValue(value[key]);
    });
  }

  export(serialize = false): PropsMap | PropsList | null {
    if (this.items.length < 1) {
      return null;
    }
    if (this.type === 'list') {
      return this.items.map(item => {
        const v = item.export(serialize);
        return {
          spread: item.spread,
          name: item.key as string,
          value: v === UNSET ? null : v,
        };
      });
    }
    const maps: any = {};
    this.items.forEach(prop => {
      if (prop.key) {
        maps[prop.key] = prop.export(serialize);
      }
    });
    return maps;
  }

  /**
   * 根据 path 路径查询属性
   *
   * @useStash 如果没有则临时生成一个
   */
  query(path: string, useStash: boolean = true): Prop | null {
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
  get(name: string, useStash = false): Prop | null {
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
