import {
  TitleContent,
  isDynamicSetter,
  SetterType,
  DynamicSetter,
  FieldExtraProps,
  FieldConfig,
  CustomView,
  isCustomView,
  isFieldConfig,
  isGroupConfig,
  SettingFieldConfig,
} from '@alilc/lowcode-types';
import { Transducer } from './utils';
import { isSettingPropFieldEntry, SettingPropEntry } from './setting-prop-entry';
import { SettingEntry } from './setting-entry';
import { computed, obx, makeObservable, action } from '@alilc/lowcode-editor-core';
import { cloneDeep } from '@alilc/lowcode-utils';
import type { ISetValueOptions } from '../../types';

function getSettingFieldCollectorKey(parent: SettingEntry, config: FieldConfig) {
  let cur = parent;
  const path = [config.name];
  while (cur !== parent.top) {
    if (isSettingPropFieldEntry(cur)) {
      path.unshift(cur.name);
    }
    cur = cur.parent;
  }
  return path.join('.');
}


export class SettingField extends SettingPropEntry implements SettingEntry {
  readonly isSettingField = true;

  readonly isRequired: boolean;

  readonly transducer: Transducer;

  private _config: SettingFieldConfig;

  extraProps: FieldExtraProps;

  // ==== dynamic properties ====
  private _title?: TitleContent;

  get title() {
    // FIXME! intl
    return this._title || (typeof this.name === 'number' ? `项目 ${this.name}` : this.name);
  }

  private _setter?: SetterType | DynamicSetter | undefined;

  @computed get setter(): SetterType | null {
    if (!this._setter) {
      return null;
    }
    if (isDynamicSetter(this._setter)) {
      const shellThis = this.internalToShellPropEntry();
      return this._setter.call(shellThis, shellThis);
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

  parent: SettingEntry;

  constructor(
    parent: SettingEntry,
    config: SettingFieldConfig,
    settingFieldCollector?: (name: string | number, field: SettingField) => void,
  ) {
    super(parent, config.name, config.type);
    makeObservable(this);

    let { title, extraProps, ...rest } = config;
    this._title = title;
    this.parent = parent;
    this._config = config;
    this.extraProps = {
      ...rest,
      ...extraProps,
    };

    if (isFieldConfig(config)) {
      this._setter = config.setter;
    }


    this.isRequired = config.isRequired || (this._setter as any)?.isRequired;
    this._expanded = !extraProps?.defaultCollapsed;

    // initial items
    if (isGroupConfig(config) && config.items.length > 0) {
      this.initItems(config.items, settingFieldCollector);
    }
    if (isFieldConfig(config) && settingFieldCollector && config.name) {
      settingFieldCollector(getSettingFieldCollectorKey(parent, config), this);
    }

    // compatiable old config
    if (this._setter) { this.transducer = new Transducer(this, { setter: this._setter }); }
  }

  private _items: Array<SettingField | CustomView> = [];

  get items(): Array<SettingField | CustomView> {
    return this._items;
  }

  get config(): SettingFieldConfig {
    return this._config;
  }

  private initItems(
    items: Array<FieldConfig | CustomView>,
    settingFieldCollector?: {
      (name: string | number, field: SettingField): void;
      (name: string, field: SettingField): void;
    },
  ) {
    this._items = items.map((item) => {
      if (isCustomView(item)) {
        return item;
      }
      return new SettingField(this, item, settingFieldCollector);
    });
  }

  private disposeItems() {
    this._items.forEach((item) => isSettingField(item) && item.purge());
    this._items = [];
  }

  // 创建子配置项，通常用于 object/array 类型数据
  createField(config: FieldConfig): SettingField {
    return new SettingField(this, config);
  }

  purge() {
    this.disposeItems();
  }


  // ======= compatibles for vision ======

  getConfig<K extends keyof SettingFieldConfig >(configName?: K): SettingFieldConfig[K] | SettingFieldConfig {
    if (configName) {
      return (this.config as SettingFieldConfig)[configName];
    }
    return this._config;
  }

  getItems(
    filter?: (item: SettingField | CustomView) => boolean,
  ): Array<SettingField | CustomView> {
    return this._items.filter((item) => {
      if (filter) {
        return filter(item);
      }
      return true;
    });
  }

  private hotValue: any;

  @action
  setValue(val: any, isHotValue?: boolean, force?: boolean, extraOptions?: ISetValueOptions) {
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

  /* istanbul ignore next */
  @action
  setMiniAppDataSourceValue(data: any, options?: any) {
    this.hotValue = data;
    const v = this.transducer.toNative(data);
    this.setValue(v, false, false, options);
    // dirty fix list setter
    if (Array.isArray(data) && data[0] && data[0].__sid__) {
      return;
    }

    this.valueChange();
  }

  @action
  setHotValue(data: any, options?: ISetValueOptions) {
    this.hotValue = data;
    const value = this.transducer.toNative(data);
    if (options) {
      options.fromSetHotValue = true;
    } else {
      options = { fromSetHotValue: true };
    }
    if (this.isUseVariable()) {
      const oldValue = this.getValue();
      this.setValue(
        {
          type: 'JSExpression',
          value: oldValue.value,
          mock: value,
        },
        false,
        false,
        options,
      );
    } else {
      this.setValue(value, false, false, options);
    }

    // dirty fix list setter
    if (Array.isArray(data) && data[0] && data[0].__sid__) {
      return;
    }

    this.valueChange(options);
  }

  onEffect(action: () => void): () => void {
    return this.designer.autorun(action, true);
  }
}

export function isSettingField(obj: any): obj is SettingField {
  return obj && obj.isSettingField;
}
