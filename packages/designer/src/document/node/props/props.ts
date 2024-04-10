import { computed, makeObservable, obx, action } from '@alilc/lowcode-editor-core';
import { IPublicTypePropsList, IPublicTypeCompositeValue, IPublicEnumTransformStage, IBaseModelProps } from '@alilc/lowcode-types';
import type { IPublicTypePropsMap } from '@alilc/lowcode-types';
import { uniqueId, compatStage } from '@alilc/lowcode-utils';
import { Prop, UNSET } from './prop';
import type { IProp } from './prop';
import { INode } from '../node';
// import { TransformStage } from '../transform-stage';

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

export interface IPropParent {

  readonly props: IProps;

  readonly owner: INode;

  get path(): string[];

  delete(prop: IProp): void;
}

export interface IProps extends Props {}

export class Props implements Omit<IBaseModelProps<IProp>, | 'getExtraProp' | 'getExtraPropValue' | 'setExtraPropValue' | 'node'>, IPropParent {
  readonly id = uniqueId('props');

  @obx.shallow private items: IProp[] = [];

  @computed private get maps(): Map<string, Prop> {
    const maps = new Map();
    if (this.items.length > 0) {
      this.items.forEach((prop) => {
        if (prop.key) {
          maps.set(prop.key, prop);
        }
      });
    }
    return maps;
  }

  readonly path = [];

  get props(): IProps {
    return this;
  }

  readonly owner: INode;

  /**
   * 元素个数
   */
  @computed get size() {
    return this.items.length;
  }

  @obx type: 'map' | 'list' = 'map';

  private purged = false;

  constructor(owner: INode, value?: IPublicTypePropsMap | IPublicTypePropsList | null, extras?: ExtrasObject) {
    makeObservable(this);
    this.owner = owner;
    if (Array.isArray(value)) {
      this.type = 'list';
      this.items = value.map(
        (item, idx) => new Prop(this, item.value, item.name || idx, item.spread),
      );
    } else if (value != null) {
      this.items = Object.keys(value).map((key) => new Prop(this, value[key], key, false));
    }
    if (extras) {
      Object.keys(extras).forEach((key) => {
        this.items.push(new Prop(this, (extras as any)[key], getConvertedExtraKey(key)));
      });
    }
  }

  @action
  import(value?: IPublicTypePropsMap | IPublicTypePropsList | null, extras?: ExtrasObject) {
    const originItems = this.items;
    if (Array.isArray(value)) {
      this.type = 'list';
      this.items = value.map(
        (item, idx) => new Prop(this, item.value, item.name || idx, item.spread),
      );
    } else if (value != null) {
      this.type = 'map';
      this.items = Object.keys(value).map((key) => new Prop(this, value[key], key));
    } else {
      this.type = 'map';
      this.items = [];
    }
    if (extras) {
      Object.keys(extras).forEach((key) => {
        this.items.push(new Prop(this, (extras as any)[key], getConvertedExtraKey(key)));
      });
    }
    originItems.forEach((item) => item.purge());
  }

  @action
  merge(value: IPublicTypePropsMap, extras?: IPublicTypePropsMap) {
    Object.keys(value).forEach((key) => {
      this.query(key, true)!.setValue(value[key]);
      this.query(key, true)!.setupItems();
    });
    if (extras) {
      Object.keys(extras).forEach((key) => {
        this.query(getConvertedExtraKey(key), true)!.setValue(extras[key]);
        this.query(getConvertedExtraKey(key), true)!.setupItems();
      });
    }
  }

  export(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Save): {
    props?: IPublicTypePropsMap | IPublicTypePropsList;
    extras?: ExtrasObject;
  } {
    stage = compatStage(stage);
    if (this.items.length < 1) {
      return {};
    }
    const allProps = {} as any;
    let props: any = {};
    const extras: any = {};
    if (this.type === 'list') {
      props = [];
      this.items.forEach((item) => {
        const value = item.export(stage);
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
      this.items.forEach((item) => {
        const name = item.key as string;
        if (name == null || item.isUnset() || item.isVirtual()) return;
        const value = item.export(stage);
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
  query(path: string, createIfNone = true): IProp | null {
    return this.get(path, createIfNone);
  }

  /**
   * 获取某个属性，如果不存在，临时获取一个待写入
   * @param createIfNone 当没有的时候，是否创建一个
   */
  @action
  get(path: string, createIfNone = false): IProp | null {
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
  delete(prop: IProp): void {
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
  add(
    value: IPublicTypeCompositeValue | null,
    key?: string | number,
    spread = false,
    options: any = {},
  ): IProp {
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
  [Symbol.iterator](): { next(): { value: IProp } } {
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
  forEach(fn: (item: IProp, key: number | string | undefined) => void): void {
    this.items.forEach((item) => {
      return fn(item, item.key);
    });
  }

  /**
   * 遍历
   */
  @action
  map<T>(fn: (item: IProp, key: number | string | undefined) => T): T[] | null {
    return this.items.map((item) => {
      return fn(item, item.key);
    });
  }

  @action
  filter(fn: (item: IProp, key: number | string | undefined) => boolean) {
    return this.items.filter((item) => {
      return fn(item, item.key);
    });
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
    this.items.forEach((item) => item.purge());
  }

  /**
   * 获取某个属性, 如果不存在，临时获取一个待写入
   * @param createIfNone 当没有的时候，是否创建一个
   */
  @action
  getProp(path: string, createIfNone = true): IProp | null {
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
