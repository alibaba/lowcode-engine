import { type StringDictionary, Disposable, Events } from '@alilc/lowcode-shared';
import {
  ConfigurationModel,
  type IConfigurationModel,
  type InspectValue,
  type IOverrides,
} from './configurationModel';
import {
  ConfigurationRegistry,
  type IConfigurationPropertySchema,
  type IRegisteredConfigurationPropertySchema,
} from './configurationRegistry';
import { isEqual, isNil, isPlainObject, get as lodasgGet } from 'lodash-es';
import {
  IInspectValue,
  toValuesTree,
  OVERRIDE_PROPERTY_REGEX,
  overrideIdentifiersFromKey,
} from './configuration';

export interface IConfigurationOverrides {
  overrideIdentifier?: string | null;
}

export class DefaultConfiguration extends Disposable {
  private _onDidChangeConfiguration = this._addDispose(
    new Events.Emitter<{
      defaults: ConfigurationModel;
      properties: string[];
    }>(),
  );
  onDidChangeConfiguration = this._onDidChangeConfiguration.event;

  private _configurationModel = ConfigurationModel.createEmptyModel();

  get configurationModel(): ConfigurationModel {
    return this._configurationModel;
  }

  initialize(): ConfigurationModel {
    this.resetConfigurationModel();
    ConfigurationRegistry.onDidUpdateConfiguration(({ properties }) =>
      this.onDidUpdateConfiguration([...properties]),
    );

    return this.configurationModel;
  }

  reload(): ConfigurationModel {
    this.resetConfigurationModel();
    return this.configurationModel;
  }

  private onDidUpdateConfiguration(properties: string[]): void {
    this.updateConfigurationModel(properties, ConfigurationRegistry.getConfigurationProperties());
    this._onDidChangeConfiguration.notify({ defaults: this.configurationModel, properties });
  }

  private resetConfigurationModel(): void {
    this._configurationModel = ConfigurationModel.createEmptyModel();

    const properties = ConfigurationRegistry.getConfigurationProperties();

    this.updateConfigurationModel(Object.keys(properties), properties);
  }

  private updateConfigurationModel(
    properties: string[],
    configurationProperties: StringDictionary<IRegisteredConfigurationPropertySchema>,
  ): void {
    for (const key of properties) {
      const propertySchema = configurationProperties[key];
      if (propertySchema) {
        this.configurationModel.setValue(key, propertySchema.default);
      } else {
        this.configurationModel.removeValue(key);
      }
    }
  }
}

export interface ConfigurationParseOptions {
  include?: string[];
  exclude?: string[];
}

class ConfigurationModelParser {
  private _raw: any = null;
  private _configurationModel: ConfigurationModel | null = null;
  private _parseErrors: any[] = [];

  constructor() {}

  get configurationModel(): ConfigurationModel {
    return this._configurationModel || ConfigurationModel.createEmptyModel();
  }

  get errors(): any[] {
    return this._parseErrors;
  }

  parse(content: StringDictionary | null | undefined, options?: ConfigurationParseOptions): void {
    if (!isNil(content)) {
      const raw = this.doParseContent(content);
      this.parseRaw(raw, options);
    }
  }

  reparse(options: ConfigurationParseOptions): void {
    if (this._raw) {
      this.parseRaw(this._raw, options);
    }
  }

  private doParseContent(content: StringDictionary): any {
    function flatten(obj: any, parentKey: string = '', result: any = {}): any {
      for (const key of Object.keys(obj)) {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (isPlainObject(obj)) {
          flatten(obj[key], fullKey, result);
        } else {
          result[fullKey] = obj[key];
        }
      }

      return result;
    }

    return flatten(content);
  }

  parseRaw(raw: any, options?: ConfigurationParseOptions): void {
    this._raw = raw;

    const { contents, keys, overrides, hasExcludedProperties } = this.doParseRaw(raw, options);

    this._configurationModel = new ConfigurationModel(
      contents,
      keys,
      overrides,
      hasExcludedProperties ? [raw] : undefined /* raw has not changed */,
    );
  }

  protected doParseRaw(
    raw: any,
    options?: ConfigurationParseOptions,
  ): IConfigurationModel & { hasExcludedProperties?: boolean } {
    const configurationProperties = ConfigurationRegistry.getConfigurationProperties();
    const filtered = this.filter(raw, configurationProperties, true, options);

    raw = filtered.raw;

    const contents = toValuesTree(raw);
    const keys = Object.keys(raw);
    const overrides = this.toOverrides(raw);

    return {
      contents,
      keys,
      overrides,
      hasExcludedProperties: filtered.hasExcludedProperties,
    };
  }

  private filter(
    properties: any,
    configurationProperties: { [qualifiedKey: string]: IConfigurationPropertySchema | undefined },
    filterOverriddenProperties: boolean,
    options?: ConfigurationParseOptions,
  ): { raw: any; hasExcludedProperties: boolean } {
    let hasExcludedProperties = false;

    if (!options?.exclude?.length) {
      return { raw: properties, hasExcludedProperties };
    }

    const raw: any = {};

    for (const key in properties) {
      if (OVERRIDE_PROPERTY_REGEX.test(key) && filterOverriddenProperties) {
        const result = this.filter(properties[key], configurationProperties, false, options);

        raw[key] = result.raw;
        hasExcludedProperties = hasExcludedProperties || result.hasExcludedProperties;
      } else {
        if (
          !options.exclude?.includes(key) /* Check exclude */ &&
          options.include?.includes(key) /* Check include */
        ) {
          /* Check restricted */ raw[key] = properties[key];
        } else {
          hasExcludedProperties = true;
        }
      }
    }

    return { raw, hasExcludedProperties };
  }

  private toOverrides(raw: any): IOverrides[] {
    const overrides: IOverrides[] = [];

    for (const key of Object.keys(raw)) {
      if (OVERRIDE_PROPERTY_REGEX.test(key)) {
        const overrideRaw: any = {};

        for (const keyInOverrideRaw of Object.keys(raw[key])) {
          overrideRaw[keyInOverrideRaw] = raw[key][keyInOverrideRaw];
        }

        overrides.push({
          identifiers: overrideIdentifiersFromKey(key),
          keys: Object.keys(overrideRaw),
          contents: toValuesTree(overrideRaw),
        });
      }
    }

    return overrides;
  }
}

/**
 * 本地优先的用户缓存配置策略
 */
export class UserConfiguration {
  private readonly parser: ConfigurationModelParser;

  constructor(private parseOptions: ConfigurationParseOptions) {
    this.parser = new ConfigurationModelParser();
  }

  async loadConfiguration(): Promise<ConfigurationModel> {
    try {
      // 可能远程请求或者读取对应配置
      this.parser.parse({}, this.parseOptions);
      return this.parser.configurationModel;
    } catch (e) {
      return ConfigurationModel.createEmptyModel();
    }
  }

  reparse(parseOptions?: ConfigurationParseOptions): ConfigurationModel {
    if (parseOptions) {
      this.parseOptions = parseOptions;
    }
    this.parser.reparse(this.parseOptions);
    return this.parser.configurationModel;
  }

  async syncRemoteConfiguration(path: string[], value: any): Promise<void> {
    // todo: scheduler
    // 本地同步远程服务器
    this.parser.configurationModel.setValue(path.join('.'), value);
  }
}

export interface IConfigurationValue<T> {
  readonly defaultValue?: T;
  readonly userValue?: T;
  readonly memoryValue?: T;
  readonly value?: T;

  readonly default?: IInspectValue<T>;
  readonly user?: IInspectValue<T>;
  readonly memory?: IInspectValue<T>;

  readonly overrideIdentifiers?: string[];
}

class ConfigurationInspectValue<V> implements IConfigurationValue<V> {
  constructor(
    private readonly key: string,
    private readonly overrides: IConfigurationOverrides,
    private readonly _value: V | undefined,
    readonly overrideIdentifiers: string[] | undefined,
    private readonly defaultConfiguration: ConfigurationModel,
    private readonly userConfiguration: ConfigurationModel,
    private readonly memoryConfigurationModel: ConfigurationModel,
  ) {}

  get value(): V | undefined {
    return this._value;
  }

  private toInspectValue(
    inspectValue: IInspectValue<V> | undefined | null,
  ): IInspectValue<V> | undefined {
    return inspectValue?.value !== undefined ||
      inspectValue?.override !== undefined ||
      inspectValue?.overrides !== undefined
      ? inspectValue
      : undefined;
  }

  private _defaultInspectValue: InspectValue<V> | undefined;
  private get defaultInspectValue(): InspectValue<V> {
    if (!this._defaultInspectValue) {
      this._defaultInspectValue = this.defaultConfiguration.inspect<V>(
        this.key,
        this.overrides.overrideIdentifier,
      );
    }
    return this._defaultInspectValue;
  }

  get defaultValue(): V | undefined {
    return this.defaultInspectValue.merged;
  }

  get default(): IInspectValue<V> | undefined {
    return this.toInspectValue(this.defaultInspectValue);
  }

  private _userInspectValue: InspectValue<V> | undefined;
  private get userInspectValue(): InspectValue<V> {
    if (!this._userInspectValue) {
      this._userInspectValue = this.userConfiguration.inspect<V>(
        this.key,
        this.overrides.overrideIdentifier,
      );
    }
    return this._userInspectValue;
  }

  get userValue(): V | undefined {
    return this.userInspectValue.merged;
  }

  get user(): IInspectValue<V> | undefined {
    return this.toInspectValue(this.userInspectValue);
  }

  private _memoryInspectValue: InspectValue<V> | undefined;
  private get memoryInspectValue(): InspectValue<V> {
    if (this._memoryInspectValue === undefined) {
      this._memoryInspectValue = this.memoryConfigurationModel.inspect<V>(
        this.key,
        this.overrides.overrideIdentifier,
      );
    }
    return this._memoryInspectValue;
  }

  get memoryValue(): V | undefined {
    return this.memoryInspectValue.merged;
  }

  get memory(): IInspectValue<V> | undefined {
    return this.toInspectValue(this.memoryInspectValue);
  }
}

export interface IConfigurationData {
  defaults: IConfigurationModel;
  user: IConfigurationModel;
}

export interface IConfigurationChange {
  keys: string[];
  overrides: [string, string[]][];
}

export class Configuration {
  static parse(data: IConfigurationData): Configuration {
    const parseConfigurationModel = (model: IConfigurationModel): ConfigurationModel => {
      return new ConfigurationModel(model.contents, model.keys, model.overrides, undefined);
    };

    const defaultConfiguration = parseConfigurationModel(data.defaults);
    const userConfiguration = parseConfigurationModel(data.user);

    return new Configuration(
      defaultConfiguration,
      userConfiguration,
      ConfigurationModel.createEmptyModel(),
    );
  }

  private _consolidatedConfiguration: ConfigurationModel | null = null;

  constructor(
    private _defaultConfiguration: ConfigurationModel,
    private _userConfiguration: ConfigurationModel,
    private _memoryConfiguration: ConfigurationModel,
  ) {}

  get defaults(): ConfigurationModel {
    return this._defaultConfiguration;
  }

  get userConfiguration(): ConfigurationModel {
    return this._userConfiguration;
  }

  getValue(section: string | undefined, overrides: IConfigurationOverrides): any {
    const consolidateConfigurationModel = this.getConsolidatedConfigurationModel(overrides);
    return consolidateConfigurationModel.getValue(section);
  }

  updateValue(key: string, value: any): void {
    const memoryConfiguration = this._memoryConfiguration;

    if (value === undefined) {
      memoryConfiguration.removeValue(key);
    } else {
      memoryConfiguration.setValue(key, value);
    }
  }

  inspect<C>(key: string, overrides: IConfigurationOverrides): IConfigurationValue<C> {
    const consolidateConfigurationModel = this.getConsolidatedConfigurationModel(overrides);

    const overrideIdentifiers = new Set<string>();
    for (const override of consolidateConfigurationModel.overrides) {
      for (const overrideIdentifier of override.identifiers) {
        if (consolidateConfigurationModel.getOverrideValue(key, overrideIdentifier) !== undefined) {
          overrideIdentifiers.add(overrideIdentifier);
        }
      }
    }

    return new ConfigurationInspectValue<C>(
      key,
      overrides,
      consolidateConfigurationModel.getValue<C>(key),
      overrideIdentifiers.size ? [...overrideIdentifiers] : undefined,
      this._defaultConfiguration,
      this._userConfiguration,
      this._memoryConfiguration,
    );
  }

  keys(): {
    default: string[];
    user: string[];
  } {
    return {
      default: this._defaultConfiguration.keys.slice(0),
      user: this._userConfiguration.keys.slice(0),
    };
  }

  toData(): IConfigurationData {
    return {
      defaults: {
        contents: this._defaultConfiguration.contents,
        overrides: this._defaultConfiguration.overrides,
        keys: this._defaultConfiguration.keys,
      },
      user: {
        contents: this._userConfiguration.contents,
        overrides: this._userConfiguration.overrides,
        keys: this._userConfiguration.keys,
      },
    };
  }

  private getConsolidatedConfigurationModel(
    overrides: IConfigurationOverrides,
  ): ConfigurationModel {
    let configurationModel = this.getWorkspaceConsolidatedConfiguration();
    if (overrides.overrideIdentifier) {
      configurationModel = configurationModel.override(overrides.overrideIdentifier);
    }

    return configurationModel;
  }

  private getWorkspaceConsolidatedConfiguration(): ConfigurationModel {
    if (!this._consolidatedConfiguration) {
      this._consolidatedConfiguration = this._defaultConfiguration.merge(
        this._userConfiguration,
        this._memoryConfiguration,
      );
    }
    return this._consolidatedConfiguration;
  }

  compareAndUpdateUserConfiguration(user: ConfigurationModel): IConfigurationChange {
    const { added, updated, removed, overrides } = compare(this.userConfiguration, user);
    const keys = [...added, ...updated, ...removed];
    if (keys.length) {
      this._userConfiguration = user;
      this._consolidatedConfiguration = null;
    }
    return { keys, overrides };
  }
}

export interface IConfigurationCompareResult {
  added: string[];
  removed: string[];
  updated: string[];
  overrides: [string, string[]][];
}

export function compare(
  from: ConfigurationModel | undefined,
  to: ConfigurationModel | undefined,
): IConfigurationCompareResult {
  const { added, removed, updated } = compareConfigurationContents(
    to?.rawConfiguration,
    from?.rawConfiguration,
  );
  const overrides: [string, string[]][] = [];

  const fromOverrideIdentifiers = from?.getAllOverrideIdentifiers() || [];
  const toOverrideIdentifiers = to?.getAllOverrideIdentifiers() || [];

  if (to) {
    const addedOverrideIdentifiers = toOverrideIdentifiers.filter(
      (key) => !fromOverrideIdentifiers.includes(key),
    );
    for (const identifier of addedOverrideIdentifiers) {
      overrides.push([identifier, to.getKeysForOverrideIdentifier(identifier)]);
    }
  }

  if (from) {
    const removedOverrideIdentifiers = fromOverrideIdentifiers.filter(
      (key) => !toOverrideIdentifiers.includes(key),
    );
    for (const identifier of removedOverrideIdentifiers) {
      overrides.push([identifier, from.getKeysForOverrideIdentifier(identifier)]);
    }
  }

  if (to && from) {
    for (const identifier of fromOverrideIdentifiers) {
      if (toOverrideIdentifiers.includes(identifier)) {
        const result = compareConfigurationContents(
          {
            contents: from.getOverrideValue(undefined, identifier) || {},
            keys: from.getKeysForOverrideIdentifier(identifier),
          },
          {
            contents: to.getOverrideValue(undefined, identifier) || {},
            keys: to.getKeysForOverrideIdentifier(identifier),
          },
        );
        overrides.push([identifier, [...result.added, ...result.removed, ...result.updated]]);
      }
    }
  }

  return { added, removed, updated, overrides };
}

function compareConfigurationContents(
  to: { keys: string[]; contents: any } | undefined,
  from: { keys: string[]; contents: any } | undefined,
) {
  const added = to
    ? from
      ? to.keys.filter((key) => from.keys.indexOf(key) === -1)
      : [...to.keys]
    : [];
  const removed = from
    ? to
      ? from.keys.filter((key) => to.keys.indexOf(key) === -1)
      : [...from.keys]
    : [];
  const updated: string[] = [];

  if (to && from) {
    for (const key of from.keys) {
      if (to.keys.indexOf(key) !== -1) {
        const value1 = lodasgGet(from.contents, key);
        const value2 = lodasgGet(to.contents, key);
        if (!isEqual(value1, value2)) {
          updated.push(key);
        }
      }
    }
  }

  return { added, removed, updated };
}
