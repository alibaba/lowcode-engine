import { type StringDictionary } from '@alilc/lowcode-shared';
import { get as lodasgGet, isEqual, uniq, cloneDeep, isObject } from 'lodash-es';
import {
  type IInspectValue,
  addToValueTree,
  removeFromValueTree,
  toValuesTree,
  OVERRIDE_PROPERTY_REGEX,
  overrideIdentifiersFromKey,
} from './configuration';

export type InspectValue<V> = IInspectValue<V> & { merged?: V };

export interface IConfigurationModel {
  contents: any;
  keys: string[];
  overrides: IOverrides[];
}

export interface IOverrides {
  keys: string[];
  contents: any;
  identifiers: string[];
}

/**
 * 支持配置覆盖的 model 类
 *
 * 举例来说：
 * 假设有一个应用程序，它的行为在开发环境和生产环境下有细微差别。在开发环境中，可能需要额外的日志记录和调试工具，而生产环境则需要优化性能和安全性。
 * 使用配置覆盖，就可以为这两个环境创建一组基础配置，并通过以 [development] 或 [production] 为标识符的覆盖键来为两个环境提供不同的设置。
 *
 * case:
 * const model = ConfigurationModel.createEmptyModel();
 * const baseKey = 'baseKey';
 * const baseValue = 'baseValue';
 * const overrideKey = '[environment]';
 * const overrideValue = { baseKey: 'overrideValue' };
 *
 * const envModel = model.override('environment');
 * model.getValue(baseKey) === 'baseValue'
 * envModel.getValue(baseKey) === 'overrideValue'
 */
export class ConfigurationModel implements IConfigurationModel {
  static createEmptyModel(): ConfigurationModel {
    return new ConfigurationModel({}, [], [], undefined);
  }

  private readonly overrideConfigurations = new Map<string, ConfigurationModel>();

  constructor(
    private readonly _contents: StringDictionary,
    private readonly _keys: string[],
    private readonly _overrides: IOverrides[],
    public readonly raw?: ReadonlyArray<ConfigurationModel> | undefined,
  ) {}

  get contents(): any {
    return this._contents;
  }

  get overrides(): IOverrides[] {
    return this._overrides;
  }

  get keys(): string[] {
    return this._keys;
  }

  private _rawConfiguration: ConfigurationModel | undefined;
  get rawConfiguration(): ConfigurationModel {
    if (!this._rawConfiguration) {
      if (this.raw?.length) {
        const rawConfigurationModels = this.raw;
        this._rawConfiguration = rawConfigurationModels.reduce(
          (previous, current) => (current === previous ? current : previous.merge(current)),
          rawConfigurationModels[0],
        );
      } else {
        // raw is same as current
        this._rawConfiguration = this;
      }
    }
    return this._rawConfiguration;
  }

  toJSON(): IConfigurationModel {
    return {
      contents: this.contents,
      overrides: this.overrides,
      keys: this.keys,
    };
  }

  inspect<V>(section?: string | undefined, overrideIdentifier?: string | null): InspectValue<V> {
    const _this = this;
    return {
      get value() {
        return _this.rawConfiguration.getValue<V>(section);
      },
      get override() {
        return overrideIdentifier
          ? _this.rawConfiguration.getOverrideValue<V>(section, overrideIdentifier)
          : undefined;
      },
      get merged() {
        return overrideIdentifier
          ? _this.rawConfiguration.override(overrideIdentifier).getValue<V>(section)
          : _this.rawConfiguration.getValue<V>(section);
      },
      get overrides() {
        const overrides: { readonly identifiers: string[]; readonly value: V }[] = [];
        for (const { contents, identifiers, keys } of _this.rawConfiguration.overrides) {
          const value = new ConfigurationModel(contents, keys, [], undefined).getValue<V>(section);
          if (value !== undefined) {
            overrides.push({ identifiers, value });
          }
        }
        return overrides.length ? overrides : undefined;
      },
    };
  }

  merge(...others: ConfigurationModel[]): ConfigurationModel {
    const contents = cloneDeep(this.contents);
    const overrides = cloneDeep(this.overrides);
    const keys = [...this.keys];
    const raws = this.raw?.length ? [...this.raw] : [this];

    for (const other of others) {
      raws.push(...(other.raw?.length ? other.raw : [other]));
      if (other.isEmpty()) {
        continue;
      }
      this.mergeContents(contents, other.contents);

      for (const otherOverride of other.overrides) {
        const [override] = overrides.filter((o) =>
          isEqual(o.identifiers, otherOverride.identifiers),
        );
        if (override) {
          this.mergeContents(override.contents, otherOverride.contents);
          override.keys.push(...otherOverride.keys);
          override.keys = uniq(override.keys);
        } else {
          overrides.push(cloneDeep(otherOverride));
        }
      }
      for (const key of other.keys) {
        if (keys.indexOf(key) === -1) {
          keys.push(key);
        }
      }
    }

    return new ConfigurationModel(contents, keys, overrides, raws);
  }

  override(identifier: string): ConfigurationModel {
    let overrideConfigurationModel = this.overrideConfigurations.get(identifier);
    if (!overrideConfigurationModel) {
      overrideConfigurationModel = this.createOverrideConfigurationModel(identifier);
      this.overrideConfigurations.set(identifier, overrideConfigurationModel);
    }
    return overrideConfigurationModel;
  }

  private createOverrideConfigurationModel(identifier: string): ConfigurationModel {
    const overrideContents = this.getContentsForOverrideIdentifer(identifier);

    if (
      !overrideContents ||
      typeof overrideContents !== 'object' ||
      !Object.keys(overrideContents).length
    ) {
      // If there are no valid overrides, return self
      return this;
    }

    const contents: any = {};
    for (const key of uniq([...Object.keys(this.contents), ...Object.keys(overrideContents)])) {
      let contentsForKey = this.contents[key];
      const overrideContentsForKey = overrideContents[key];

      // If there are override contents for the key, clone and merge otherwise use base contents
      if (overrideContentsForKey) {
        // Clone and merge only if base contents and override contents are of type object otherwise just override
        if (typeof contentsForKey === 'object' && typeof overrideContentsForKey === 'object') {
          contentsForKey = cloneDeep(contentsForKey);
          this.mergeContents(contentsForKey, overrideContentsForKey);
        } else {
          contentsForKey = overrideContentsForKey;
        }
      }

      contents[key] = contentsForKey;
    }

    return new ConfigurationModel(contents, this.keys, this.overrides);
  }

  private getContentsForOverrideIdentifer(identifier: string): any {
    let contentsForIdentifierOnly: StringDictionary | null = null;
    let contents: StringDictionary | null = null;
    const mergeContents = (contentsToMerge: any) => {
      if (contentsToMerge) {
        if (contents) {
          this.mergeContents(contents, contentsToMerge);
        } else {
          contents = cloneDeep(contentsToMerge);
        }
      }
    };
    for (const override of this.overrides) {
      if (override.identifiers.length === 1 && override.identifiers[0] === identifier) {
        contentsForIdentifierOnly = override.contents;
      } else if (override.identifiers.includes(identifier)) {
        mergeContents(override.contents);
      }
    }
    // Merge contents of the identifier only at the end to take precedence.
    mergeContents(contentsForIdentifierOnly);
    return contents;
  }

  private mergeContents(source: any, target: any): void {
    for (const key of Object.keys(target)) {
      if (key in source) {
        if (isObject(source[key]) && isObject(target[key])) {
          this.mergeContents(source[key], target[key]);
          continue;
        }
      }
      source[key] = cloneDeep(target[key]);
    }
  }

  isEmpty(): boolean {
    return (
      this._keys.length === 0 &&
      Object.keys(this._contents).length === 0 &&
      this._overrides.length === 0
    );
  }

  getValue<V>(section?: string | undefined): V {
    return section ? lodasgGet(this.contents, section) : this.contents;
  }

  // Update methods

  addValue(key: string, value: any): void {
    this.updateValue(key, value, true);
  }

  setValue(key: string, value: any): void {
    this.updateValue(key, value, false);
  }

  removeValue(key: string): void {
    const index = this.keys.indexOf(key);
    if (index !== -1) {
      this.keys.splice(index, 1);
      removeFromValueTree(this.contents, key);
    }

    const isOverrideKey = OVERRIDE_PROPERTY_REGEX.test(key);
    if (isOverrideKey) {
      const identifiers = overrideIdentifiersFromKey(key);
      const overrideIndex = this.overrides.findIndex((o) => isEqual(o.identifiers, identifiers));
      if (overrideIndex !== -1) {
        const override = this.overrides[overrideIndex];
        removeFromValueTree(override.contents, key);
        if (Object.keys(override.contents).length === 0) {
          this.overrides.splice(overrideIndex, 1);
        } else {
          override.keys = Object.keys(override.contents);
        }
      }
    }
  }

  private updateValue(key: string, value: any, add: boolean): void {
    addToValueTree(this.contents, key, value);
    if (add || !this.keys.includes(key)) {
      this.keys.push(key);
    }

    if (OVERRIDE_PROPERTY_REGEX.test(key)) {
      const identifiers = overrideIdentifiersFromKey(key);
      const override = this.overrides.find((o) => isEqual(o.identifiers, identifiers));

      if (override) {
        addToValueTree(override.contents, key, value);
      } else {
        this.overrides.push({
          identifiers,
          keys: Object.keys(this.contents[key]),
          contents: toValuesTree(this.contents[key]),
        });
      }
    }
  }

  getOverrideValue<V>(section: string | undefined, overrideIdentifier: string): V | undefined {
    const overrideContents = this.getContentsForOverrideIdentifer(overrideIdentifier);
    return overrideContents
      ? section
        ? lodasgGet(overrideContents, section)
        : overrideContents
      : undefined;
  }

  getKeysForOverrideIdentifier(identifier: string): string[] {
    const keys: string[] = [];
    for (const override of this.overrides) {
      if (override.identifiers.includes(identifier)) {
        keys.push(...override.keys);
      }
    }
    return uniq(keys);
  }

  getAllOverrideIdentifiers(): string[] {
    const result: string[] = [];
    for (const override of this.overrides) {
      result.push(...override.identifiers);
    }
    return uniq(result);
  }
}
