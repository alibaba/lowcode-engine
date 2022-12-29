import { IPublicTypeTitleContent, IPublicTypeSetterType, IPublicTypeDynamicSetter, IPublicTypeFieldExtraProps, IPublicTypeFieldConfig, IPublicTypeCustomView, IPublicTypeSetValueOptions } from '@alilc/lowcode-types';
import { Transducer } from './utils';
import { SettingPropEntry } from './setting-prop-entry';
import { SettingEntry } from './setting-entry';
import { computed, obx, makeObservable, action, untracked } from '@alilc/lowcode-editor-core';
import { cloneDeep, isCustomView, isDynamicSetter } from '@alilc/lowcode-utils';

function getSettingFieldCollectorKey(parent: SettingEntry, config: IPublicTypeFieldConfig) {
  let cur = parent;
  const path = [config.name];
  while (cur !== parent.top) {
    if (cur instanceof SettingField && cur.type !== 'group') {
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

  private _config: IPublicTypeFieldConfig;

  extraProps: IPublicTypeFieldExtraProps;

  // ==== dynamic properties ====
  private _title?: IPublicTypeTitleContent;

  get title() {
    // FIXME! intl
    return this._title || (typeof this.name === 'number' ? `项目 ${this.name}` : this.name);
  }

  private _setter?: IPublicTypeSetterType | IPublicTypeDynamicSetter;

  @computed get setter(): IPublicTypeSetterType | null {
    if (!this._setter) {
      return null;
    }
    if (isDynamicSetter(this._setter)) {
      return untracked(() => {
        const shellThis = this.internalToShellPropEntry();
        return this._setter.call(shellThis, shellThis);
      });
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

  constructor(parent: SettingEntry, config: IPublicTypeFieldConfig, settingFieldCollector?: (name: string | number, field: SettingField) => void) {
    super(parent, config.name, config.type);
    makeObservable(this);
    const { title, items, setter, extraProps, ...rest } = config;
    this.parent = parent;
    this._config = config;
    this._title = title;
    this._setter = setter;
    this.extraProps = {
      ...rest,
      ...extraProps,
    };
    this.isRequired = config.isRequired || (setter as any)?.isRequired;
    this._expanded = !extraProps?.defaultCollapsed;

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

  private _items: Array<SettingField | IPublicTypeCustomView> = [];

  get items(): Array<SettingField | IPublicTypeCustomView> {
    return this._items;
  }

  get config(): IPublicTypeFieldConfig {
    return this._config;
  }

  private initItems(items: Array<IPublicTypeFieldConfig | IPublicTypeCustomView>, settingFieldCollector?: { (name: string | number, field: SettingField): void; (name: string, field: SettingField): void }) {
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
  createField(config: IPublicTypeFieldConfig): SettingField {
    return new SettingField(this, config);
  }

  purge() {
    this.disposeItems();
  }

  // ======= compatibles for vision ======

  getConfig<K extends keyof IPublicTypeFieldConfig>(configName?: K): IPublicTypeFieldConfig[K] | IPublicTypeFieldConfig {
    if (configName) {
      return this.config[configName];
    }
    return this._config;
  }

  getItems(filter?: (item: SettingField | IPublicTypeCustomView) => boolean): Array<SettingField | IPublicTypeCustomView> {
    return this._items.filter(item => {
      if (filter) {
        return filter(item);
      }
      return true;
    });
  }

  private hotValue: any;

  @action
  setValue(val: any, isHotValue?: boolean, force?: boolean, extraOptions?: IPublicTypeSetValueOptions) {
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
  setHotValue(data: any, options?: IPublicTypeSetValueOptions) {
    this.hotValue = data;
    const value = this.transducer.toNative(data);
    if (options) {
      options.fromSetHotValue = true;
    } else {
      options = { fromSetHotValue: true };
    }
    if (this.isUseVariable()) {
      const oldValue = this.getValue();
      this.setValue({
        type: 'JSExpression',
        value: oldValue.value,
        mock: value,
      }, false, false, options);
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
/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isSettingField(obj: any): obj is SettingField {
  return obj && obj.isSettingField;
}
