import { TitleContent, isDynamicSetter, SetterType, DynamicSetter, FieldExtraProps, FieldConfig, CustomView, isCustomView } from '@ali/lowcode-types';
import { Transducer } from './utils';
import { SettingPropEntry } from './setting-prop-entry';
import { SettingEntry } from './setting-entry';
import { computed, obx } from '@ali/lowcode-editor-core';
import { cloneDeep } from '@ali/lowcode-utils';

export class SettingField extends SettingPropEntry implements SettingEntry {
  readonly isSettingField = true;
  readonly isRequired: boolean;
  readonly transducer: Transducer;
  extraProps: FieldExtraProps;

  // ==== dynamic properties ====
  private _title?: TitleContent;
  get title() {
    // FIXME! intl
    return this._title || (typeof this.name === 'number' ? `项目 ${this.name}` : this.name);
  }
  private _setter?: SetterType | DynamicSetter;
  @computed get setter(): SetterType | null {
    if (!this._setter) {
      return null;
    }
    if (isDynamicSetter(this._setter)) {
      return this._setter.call(this,this);
    }
    return this._setter;
  }

  @obx.ref private _expanded = true;
  get expanded(): boolean {
    return this._expanded;
  }

  setExpanded(value: boolean) {
    this._expanded = value;
  }

  constructor(readonly parent: SettingEntry, config: FieldConfig) {
    super(parent, config.name, config.type);

    const { title, items, setter, extraProps, ...rest } = config;
    this._title = title;
    this._setter = setter;
    this.extraProps = {
      ...rest,
      ...extraProps,
    };
    this.isRequired = config.isRequired || (setter as any)?.isRequired;
    this._expanded = extraProps?.defaultCollapsed ? false : true;

    // initial items
    if (this.type === 'group' && items) {
      this.initItems(items);
    }

    // compatiable old config
    this.transducer = new Transducer(this, { setter });
  }

  private _items: Array<SettingField | CustomView> = [];

  get items(): Array<SettingField | CustomView> {
    return this._items;
  }

  private initItems(items: Array<FieldConfig | CustomView>) {
    this._items = items.map((item) => {
      if (isCustomView(item)) {
        return item;
      }
      return new SettingField(this, item);
    });
  }

  private disposeItems() {
    this._items.forEach(item => isSettingField(item) && item.purge());
    this._items = [];
  }

  // 创建子配置项，通常用于 object/array 类型数据
  createField(config: FieldConfig): SettingField {
    return new SettingField(this, config);
  }

  // ====== 当前属性读写 =====

  /**
   * 判断当前属性值是否一致
   * 0 无值/多种值
   * 1 类似值，比如数组长度一样
   * 2 单一植
   */
  get valueState(): number {
    if (this.type !== 'field') {
      return 0;
    }
    const propName = this.path.join('.');
    const first = this.nodes[0].getProp(propName)!;
    let l = this.nodes.length;
    let state = 2;
    while (l-- > 1) {
      const next = this.nodes[l].getProp(propName, false);
      const s = first.compare(next);
      if (s > 1) {
        return 0;
      }
      if (s === 1) {
        state = 1;
      }
    }
    return state;
  }

  purge() {
    this.disposeItems();
  }

  // ======= compatibles for vision ======
  getHotValue(): any {
    // avoid View modify
    let v = cloneDeep(this.getValue());
    if (v == null) {
      v = this.extraProps.defaultValue;
    }
    return this.transducer.toHot(v);
  }

  setHotValue(data: any) {
    this.setValue(this.transducer.toNative(data));
    this.valueChange();
  }

  onEffect(action: () => void): () => void {
    return this.designer.autorun(action, true);
  }
}

export function isSettingField(obj: any): obj is SettingField {
  return obj && obj.isSettingField;
}
