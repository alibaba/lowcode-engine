import { computed, makeObservable, obx, action } from '@alilc/lowcode-editor-core';
import { PropsMap, PropsList, CompositeValue } from '@alilc/lowcode-types';
import { uniqueId, compatStage } from '@alilc/lowcode-utils';
import { Prop, IPropParent, UNSET } from './prop';
import { Node } from '../node';
import { TransformStage } from '../transform-stage';

interface ExtrasObject {
  [key: string]: any;
}

export const EXTRA_KEY_PREFIX = '___';
export function getConvertedExtraKey(key: string): string {
  if (!key) {
    return '';
  }
  let _key = key;
  if (key.indexOf('.') > 0) {
    _key = key.split('.')[0];
  }
  return EXTRA_KEY_PREFIX + _key + EXTRA_KEY_PREFIX + key.slice(_key.length);
}
export function getOriginalExtraKey(key: string): string {
  return key.replace(new RegExp(`${EXTRA_KEY_PREFIX}`, 'g'), '');
}
export class Props implements IPropParent {
  readonly id = uniqueId('props');

  @obx.shallow private items: Prop[] = [];

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

  /**
   * 元素个数
   */
  @computed get size() {
    return this.items.length;
  }

  @obx type: 'map' | 'list' = 'map';

  constructor(owner: Node, value?: PropsMap | PropsList | null, extras?: ExtrasObject) {
    makeObservable(this);
    this.owner = owner;
    if (Array.isArray(value)) {
      this.type = 'list';
      this.items = value.map(item => new Prop(this, item.value, item.name, item.spread));
    } else if (value != null) {
      this.items = Object.keys(value).map(key => new Prop(this, value[key], key, false));
    }
    if (extras) {
      Object.keys(extras).forEach(key => {
        this.items.push(new Prop(this, (extras as any)[key], getConvertedExtraKey(key)));
      });
    }
  }

  @action
  import(value?: PropsMap | PropsList | null, extras?: ExtrasObject) {
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

  @action
  merge(value: PropsMap, extras?: PropsMap) {
    Object.keys(value).forEach(key => {
      this.query(key, true)!.setValue(value[key]);
      this.query(key, true)!.setupItems();
    });
    if (extras) {
      Object.keys(extras).forEach(key => {
        this.query(getConvertedExtraKey(key), true)!.setValue(extras[key]);
        this.query(getConvertedExtraKey(key), true)!.setupItems();
      });
    }
  }

  export(stage: TransformStage = TransformStage.Save): { props?: PropsMap | PropsList; extras?: ExtrasObject } {
    stage = compatStage(stage);
    if (this.items.length < 1) {
      return {};
    }
    let allProps = {} as any;
    let props: any = {};
    const extras: any = {};
    if (this.type === 'list') {
      props = [];
      this.items.forEach(item => {
        let value = item.export(stage);
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
        if (name == null || item.isUnset() || item.isVirtual()) return;
        let value = item.export(stage);
        if (value != null) {
          allProps[name] = value;
        }
      });
      // compatible vision
      const transformedProps = this.transformToStatic(allProps);
      Object.keys(transformedProps).forEach((name) => {
        const value = transformedProps[name];
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
   * @deprecated
   */
  /* istanbul ignore next */
  private transformToStatic(props: any) {
    let transducers = this.owner.componentMeta?.prototype?.options?.transducers;
    if (!transducers) {
      return props;
    }
    if (!Array.isArray(transducers)) {
      transducers = [transducers];
    }
    props = transducers.reduce((xprops: any, transducer: any) => {
      if (transducer && typeof transducer.toStatic === 'function') {
        return transducer.toStatic(xprops);
      }
      return xprops;
    }, props);
    return props;
  }

  /**
   * 根据 path 路径查询属性
   *
   * @param createIfNone 当没有的时候，是否创建一个
   */
  @action
  query(path: string, createIfNone = true): Prop | null {
    return this.get(path, createIfNone);
  }

  /**
   * 获取某个属性, 如果不存在，临时获取一个待写入
   * @param createIfNone 当没有的时候，是否创建一个
   */
  @action
  get(path: string, createIfNone = false): Prop | null {
    let entry = path;
    let nest = '';
    const i = path.indexOf('.');
    if (i > 0) {
      nest = path.slice(i + 1);
      if (nest) {
        entry = path.slice(0, i);
      }
    }

    let prop = this.maps.get(entry);
    if (!prop && createIfNone) {
      prop = new Prop(this, UNSET, entry);
      this.items.push(prop);
    }

    if (prop) {
      return nest ? prop.get(nest, createIfNone) : prop;
    }

    return null;
  }

  /**
   * 删除项
   */
  @action
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
  @action
  deleteKey(key: string): void {
    this.items = this.items.filter((item, i) => {
      if (item.key === key) {
        item.purge();
        this.items.splice(i, 1);
        return false;
      }
      return true;
    });
  }

  /**
   * 添加值
   */
  @action
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
  @action
  forEach(fn: (item: Prop, key: number | string | undefined) => void): void {
    this.items.forEach(item => {
      return fn(item, item.key);
    });
  }

  /**
   * 遍历
   */
  @action
  map<T>(fn: (item: Prop, key: number | string | undefined) => T): T[] | null {
    return this.items.map(item => {
      return fn(item, item.key);
    });
  }

  @action
  filter(fn: (item: Prop, key: number | string | undefined) => boolean) {
    return this.items.filter(item => {
      return fn(item, item.key);
    });
  }

  private purged = false;

  /**
   * 回收销毁
   */
  @action
  purge() {
    if (this.purged) {
      return;
    }
    this.purged = true;
    this.items.forEach(item => item.purge());
  }

  /**
   * 获取某个属性, 如果不存在，临时获取一个待写入
   * @param createIfNone 当没有的时候，是否创建一个
   */
  @action
  getProp(path: string, createIfNone = true): Prop | null {
    return this.query(path, createIfNone) || null;
  }

  /**
   * 获取单个属性值
   */
  @action
  getPropValue(path: string): any {
    return this.getProp(path, false)?.value;
  }

  /**
   * 设置单个属性值
   */
  @action
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
  @action
  toData() {
    return this.export()?.props;
  }
}
