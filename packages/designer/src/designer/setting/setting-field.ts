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

  purge() {
    this.disposeItems();
  }

  private hotValue: any;
  
  // ======= compatibles for vision ======
  getHotValue(): any {
    if (this.hotValue) {
      return this.hotValue;
    }
    // avoid View modify
    let v = cloneDeep(this.getMockOrValue());
    if (v == null) {
      v = this.extraProps.defaultValue;
    }
    return this.transducer.toHot(v);
  }

  setHotValue(data: any) {
    this.hotValue = data;
    const v = this.transducer.toNative(data);
    if (this.isUseVariable()) {
      const ov = this.getValue();
      this.setValue({
        type: 'JSExpression',
        value: ov.value,
        mock: v,
      });
    } else {
      this.setValue(v);
    }
    this.valueChange();
  }

  onEffect(action: () => void): () => void {
    return this.designer.autorun(action, true);
  }
}

export function isSettingField(obj: any): obj is SettingField {
  return obj && obj.isSettingField;
}
