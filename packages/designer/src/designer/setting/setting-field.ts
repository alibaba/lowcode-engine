import { TitleContent, isDynamicSetter, SetterType, DynamicSetter, FieldExtraProps, FieldConfig, CustomView, isCustomView } from '@ali/lowcode-types';
import { Transducer } from './utils';
import { SettingPropEntry } from './setting-prop-entry';
import { SettingEntry } from './setting-entry';
import { computed, obx } from '@ali/lowcode-editor-core';
import { cloneDeep } from '@ali/lowcode-utils';

function getSettingFieldCollectorKey(parent: SettingEntry, config: FieldConfig) {
  let top = parent;
  const path = [config.name];
  while (top !== parent.top) {
    if (top instanceof SettingField && top.type !== 'group') {
      path.unshift(top.name);
    }
    top = top.parent;
  }
  return path.join('.');
}

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

  constructor(readonly parent: SettingEntry, config: FieldConfig, settingFieldCollector?: (name: string | number, field: SettingField) => void) {
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
    if (items && items.length > 0) {
      this.initItems(items, settingFieldCollector);
    }
    if (this.type !== 'group' && settingFieldCollector && config.name) {
      settingFieldCollector(getSettingFieldCollectorKey(parent, config), this);
    }

    // compatiable old config
    this.transducer = new Transducer(this, { setter });
  }

  private _items: Array<SettingField | CustomView> = [];

  get items(): Array<SettingField | CustomView> {
    return this._items;
  }

  private initItems(items: Array<FieldConfig | CustomView>, settingFieldCollector?: { (name: string | number, field: SettingField): void; (name: string, field: SettingField): void; }) {
    this._items = items.map((item) => {
      if (isCustomView(item)) {
        return item;
      }
      return new SettingField(this, item, settingFieldCollector);
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
  setValue(val: any, isHotValue?: boolean, force?: boolean, extraOptions?: any) {
    if (isHotValue) {
      this.setHotValue(val, extraOptions);
      return;
    }
    super.setValue(val, false, false, extraOptions);
  }

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

  setHotValue(data: any, options?: any) {
    this.hotValue = data;
    const v = this.transducer.toNative(data);
    if (this.isUseVariable()) {
      const ov = this.getValue();
      this.setValue({
        type: 'JSExpression',
        value: ov.value,
        mock: v,
      }, false, false, options);
    } else {
      this.setValue(v, false, false, options);
    }

    // dirty fix list setter
    if (Array.isArray(data) && data[0] && data[0].__sid__) {
      return;
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
