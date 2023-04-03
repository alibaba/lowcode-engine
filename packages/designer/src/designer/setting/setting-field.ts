import { ReactNode } from 'react';
import {
  IPublicTypeTitleContent,
  IPublicTypeSetterType,
  IPublicTypeDynamicSetter,
  IPublicTypeFieldExtraProps,
  IPublicTypeFieldConfig,
  IPublicTypeCustomView,
  IPublicTypeDisposable,
  IPublicModelSettingField,
  IBaseModelSettingField,
} from '@alilc/lowcode-types';
import type {
  IPublicTypeSetValueOptions,
} from '@alilc/lowcode-types';
import { Transducer } from './utils';
import { ISettingPropEntry, SettingPropEntry } from './setting-prop-entry';
import { computed, obx, makeObservable, action, untracked, intl } from '@alilc/lowcode-editor-core';
import { cloneDeep, isCustomView, isDynamicSetter, isJSExpression } from '@alilc/lowcode-utils';
import { ISettingTopEntry } from './setting-top-entry';
import { IComponentMeta, INode } from '@alilc/lowcode-designer';

function getSettingFieldCollectorKey(parent: ISettingTopEntry | ISettingField, config: IPublicTypeFieldConfig) {
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

export interface ISettingField extends ISettingPropEntry, Omit<IBaseModelSettingField<
  ISettingTopEntry,
  ISettingField,
  IComponentMeta,
  INode
>, 'setValue' | 'key' | 'node'> {
  readonly isSettingField: true;

  readonly isRequired: boolean;

  readonly isGroup: boolean;

  extraProps: IPublicTypeFieldExtraProps;

  get items(): Array<ISettingField | IPublicTypeCustomView>;

  get title(): string | ReactNode | undefined;

  get setter(): IPublicTypeSetterType | null;

  get expanded(): boolean;

  get valueState(): number;

  setExpanded(value: boolean): void;

  purge(): void;

  setValue(
    val: any,
    isHotValue?: boolean,
    force?: boolean,
    extraOptions?: IPublicTypeSetValueOptions,
  ): void;

  clearValue(): void;

  valueChange(options: IPublicTypeSetValueOptions): void;

  createField(config: IPublicTypeFieldConfig): ISettingField;

  onEffect(action: () => void): IPublicTypeDisposable;

  internalToShellField(): IPublicModelSettingField;
}

export class SettingField extends SettingPropEntry implements ISettingField {
  readonly isSettingField = true;

  readonly isRequired: boolean;

  readonly transducer: Transducer;

  private _config: IPublicTypeFieldConfig;

  private hotValue: any;

  parent: ISettingTopEntry | ISettingField;

  extraProps: IPublicTypeFieldExtraProps;

  // ==== dynamic properties ====
  private _title?: IPublicTypeTitleContent;

  get title() {
    return (
      this._title || (typeof this.name === 'number' ? `${intl('Item')} ${this.name}` : this.name)
    );
  }

  private _setter?: IPublicTypeSetterType | IPublicTypeDynamicSetter;

  @obx.ref private _expanded = true;

  private _items: Array<ISettingField | IPublicTypeCustomView> = [];

  constructor(
    parent: ISettingTopEntry | ISettingField,
    config: IPublicTypeFieldConfig,
    private settingFieldCollector?: (name: string | number, field: ISettingField) => void,
  ) {
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

  @computed get setter(): IPublicTypeSetterType | null {
    if (!this._setter) {
      return null;
    }
    if (isDynamicSetter(this._setter)) {
      return untracked(() => {
        const shellThis = this.internalToShellField();
        return (this._setter as IPublicTypeDynamicSetter)?.call(shellThis, shellThis!);
      });
    }
    return this._setter;
  }

  get expanded(): boolean {
    return this._expanded;
  }

  setExpanded(value: boolean) {
    this._expanded = value;
  }

  get items(): Array<ISettingField | IPublicTypeCustomView> {
    return this._items;
  }

  get config(): IPublicTypeFieldConfig {
    return this._config;
  }

  private initItems(
    items: Array<IPublicTypeFieldConfig | IPublicTypeCustomView>,
    settingFieldCollector?: {
      (name: string | number, field: ISettingField): void;
      (name: string, field: ISettingField): void;
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
  createField(config: IPublicTypeFieldConfig): ISettingField {
    this.settingFieldCollector?.(getSettingFieldCollectorKey(this.parent, config), this);
    return new SettingField(this, config, this.settingFieldCollector);
  }

  purge() {
    this.disposeItems();
  }

  // ======= compatibles for vision ======

  getConfig<K extends keyof IPublicTypeFieldConfig>(
    configName?: K,
  ): IPublicTypeFieldConfig[K] | IPublicTypeFieldConfig {
    if (configName) {
      return this.config[configName];
    }
    return this._config;
  }

  getItems(
    filter?: (item: ISettingField | IPublicTypeCustomView) => boolean,
  ): Array<ISettingField | IPublicTypeCustomView> {
    return this._items.filter((item) => {
      if (filter) {
        return filter(item);
      }
      return true;
    });
  }

  @action
  setValue(
    val: any,
    isHotValue?: boolean,
    force?: boolean,
    extraOptions?: IPublicTypeSetValueOptions,
  ) {
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
      if (isJSExpression(value)) {
        this.setValue(
          {
            type: 'JSExpression',
            value: value.value,
            mock: oldValue.mock,
          },
          false,
          false,
          options,
        );
      } else {
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
      }
    } else {
      this.setValue(value, false, false, options);
    }

    // dirty fix list setter
    if (Array.isArray(data) && data[0] && data[0].__sid__) {
      return;
    }

    this.valueChange(options);
  }

  onEffect(action: () => void): IPublicTypeDisposable {
    return this.designer!.autorun(action, true);
  }

  internalToShellField() {
    return this.designer!.shellModelFactory.createSettingField(this);
  }
}

/**
 * @deprecated use same function from '@alilc/lowcode-utils' instead
 */
export function isSettingField(obj: any): obj is ISettingField {
  return obj && obj.isSettingField;
}
