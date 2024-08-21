import { Events, type StringDictionary, jsonTypes, types, Disposable } from '@alilc/lowcode-shared';
import { isUndefined, isObject } from 'lodash-es';
import { Extensions, Registry } from '../extension/registry';
import { OVERRIDE_PROPERTY_REGEX, overrideIdentifiersFromKey } from './configuration';
import { type IJSONSchema, type JSONSchemaType } from '../schema';

export interface IConfigurationRegistry {
  /**
   * Register a configuration to the registry.
   */
  registerConfiguration(configuration: IConfigurationNode, validate?: boolean): void;

  /**
   * Register multiple configurations to the registry.
   */
  registerConfigurations(configurations: IConfigurationNode[], validate?: boolean): ReadonlySet<string>;

  /**
   * Deregister multiple configurations from the registry.
   */
  deregisterConfigurations(configurations: IConfigurationNode[]): void;

  /**
   * Register multiple default configurations to the registry.
   */
  registerDefaultConfigurations(defaultConfigurations: IConfigurationDefaults[]): void;

  /**
   * Deregister multiple default configurations from the registry.
   */
  deregisterDefaultConfigurations(defaultConfigurations: IConfigurationDefaults[]): void;

  /**
   * Event that fires whenever a configuration has been
   * registered.
   */
  readonly onDidUpdateConfiguration: Events.Event<{
    properties: ReadonlySet<string>;
    defaultsOverrides?: boolean;
  }>;

  /**
   * Returns all configurations settings of all configuration nodes contributed to this registry.
   */
  getConfigurationProperties(): StringDictionary<IRegisteredConfigurationPropertySchema>;
  /**
   * Returns all excluded configurations settings of all configuration nodes contributed to this registry.
   */
  getExcludedConfigurationProperties(): StringDictionary<IRegisteredConfigurationPropertySchema>;

  /**
   * Return the registered default configurations
   */
  getRegisteredDefaultConfigurations(): IConfigurationDefaults[];

  /**
   * Return the registered configuration defaults overrides
   */
  getConfigurationDefaultsOverrides(): Map<string, IConfigurationDefaultOverrideValue>;
}

export interface IConfigurationNode {
  id?: string;
  order?: number;
  type?: JSONSchemaType | JSONSchemaType[];
  title?: string;
  description?: string;
  properties?: StringDictionary<IConfigurationPropertySchema>;
  allOf?: IConfigurationNode[];
  extensionInfo?: IExtensionInfo;
}

export interface IConfigurationPropertySchema extends IJSONSchema {
  /**
   * 当该属性为“false”时，将从注册表中排除该属性。默认为包含。
   */
  included?: boolean;
  /**
   * 不允许扩展为此设置贡献配置默认值。
   */
  disallowConfigurationDefault?: boolean;
  /**
   * 与属性关联的标签列表。
   * - 标签可用于过滤
   */
  tags?: string[];
}

/**
 * 扩展信息，用来查找对应属性的源扩展
 */
export interface IExtensionInfo {
  id: string;
  version?: string;
}

export type ConfigurationDefaultValueSource = IExtensionInfo | Map<string, IExtensionInfo>;

export interface IRegisteredConfigurationPropertySchema extends IConfigurationPropertySchema {
  defaultDefaultValue?: any;
  source?: IExtensionInfo; // Source of the Property
  defaultValueSource?: ConfigurationDefaultValueSource; // Source of the Default Value
}

export interface IConfigurationDefaults {
  overrides: StringDictionary;
  source?: IExtensionInfo;
}

export interface IConfigurationDefaultOverride {
  readonly value: any;
  readonly source?: IExtensionInfo; // Source of the default override
}

export interface IConfigurationDefaultOverrideValue {
  readonly value: any;
  readonly source?: IExtensionInfo | Map<string, IExtensionInfo>;
}

export const allSettings: {
  properties: StringDictionary<IConfigurationPropertySchema>;
  patternProperties: StringDictionary<IConfigurationPropertySchema>;
} = { properties: {}, patternProperties: {} };

export class ConfigurationRegistryImpl extends Disposable implements IConfigurationRegistry {
  private _onDidUpdateConfiguration = this._addDispose(
    new Events.Emitter<{
      properties: ReadonlySet<string>;
      defaultsOverrides?: boolean;
    }>(),
  );
  onDidUpdateConfiguration = this._onDidUpdateConfiguration.event;

  private registeredConfigurationDefaults: IConfigurationDefaults[] = [];
  private readonly configurationDefaultsOverrides: Map<
    string,
    {
      configurationDefaultOverrides: IConfigurationDefaultOverride[];
      configurationDefaultOverrideValue?: IConfigurationDefaultOverrideValue;
    }
  >;

  private readonly configurationProperties: StringDictionary<IRegisteredConfigurationPropertySchema>;
  private readonly excludedConfigurationProperties: StringDictionary<IRegisteredConfigurationPropertySchema>;
  private overrideIdentifiers = new Set<string>();

  constructor() {
    super();

    this.configurationDefaultsOverrides = new Map();
    this.configurationProperties = {};
    this.excludedConfigurationProperties = {};
  }

  registerConfiguration(configuration: IConfigurationNode, validate: boolean = true): void {
    this.registerConfigurations([configuration], validate);
  }

  registerConfigurations(configurations: IConfigurationNode[], validate: boolean = true): ReadonlySet<string> {
    const properties = new Set<string>();

    this.doRegisterConfigurations(configurations, validate, properties);
    this._onDidUpdateConfiguration.notify({ properties });

    return properties;
  }

  private doRegisterConfigurations(configurations: IConfigurationNode[], validate: boolean, bucket: Set<string>): void {
    configurations.forEach((configuration) => {
      this.validateAndRegisterProperties(configuration, validate, configuration.extensionInfo, bucket);

      this.registerJSONConfiguration(configuration);
    });
  }

  private validateAndRegisterProperties(
    configuration: IConfigurationNode,
    validate: boolean = true,
    extensionInfo: IExtensionInfo | undefined,
    bucket: Set<string>,
  ): void {
    const properties = configuration.properties;
    if (properties) {
      for (const key of Object.keys(properties)) {
        const property: IRegisteredConfigurationPropertySchema = properties[key];

        if (validate && this.validateProperty(key)) {
          continue;
        }

        property.source = extensionInfo;

        // update default value
        property.defaultDefaultValue = properties[key].default;
        this.updatePropertyDefaultValue(key, property);

        // Add to properties maps
        // Property is included by default if 'included' is unspecified
        if (properties[key].included === false) {
          this.excludedConfigurationProperties[key] = properties[key];
          continue;
        }

        this.configurationProperties[key] = properties[key];
        bucket.add(key);
      }

      const subNodes = configuration.allOf;
      if (subNodes) {
        for (const node of subNodes) {
          this.validateAndRegisterProperties(node, validate, extensionInfo, bucket);
        }
      }
    }
  }

  private validateProperty(property: string): string | null {
    if (!property.trim()) {
      return 'Cannot register an empty property';
    }
    if (OVERRIDE_PROPERTY_REGEX.test(property)) {
      return `Cannot register ${property}. This matches property pattern '\\\\[.*\\\\]$' for describing language specific editor settings. Use 'configurationDefaults' contribution.`;
    }
    if (this.configurationProperties[property] !== undefined) {
      return `Cannot register ${property}. This property is already registered.`;
    }
    return null;
  }

  private updatePropertyDefaultValue(key: string, property: IRegisteredConfigurationPropertySchema): void {
    let defaultValue = undefined;
    let defaultSource = undefined;

    const configurationdefaultOverride =
      this.configurationDefaultsOverrides.get(key)?.configurationDefaultOverrideValue;

    // Prevent overriding the default value if the property is disallowed to be overridden by configuration defaults from extensions
    if (
      configurationdefaultOverride &&
      (!property.disallowConfigurationDefault || !configurationdefaultOverride.source)
    ) {
      defaultValue = configurationdefaultOverride.value;
      defaultSource = configurationdefaultOverride.source;
    }
    if (isUndefined(defaultValue)) {
      defaultValue = property.defaultDefaultValue;
      defaultSource = undefined;
    }
    if (isUndefined(defaultValue)) {
      defaultValue = jsonTypes.getDefaultValue(property.type);
    }

    property.default = defaultValue;
    property.defaultValueSource = defaultSource;
  }

  deregisterConfigurations(configurations: IConfigurationNode[]): void {
    const properties = new Set<string>();
    this.doDeregisterConfigurations(configurations, properties);
    this._onDidUpdateConfiguration.notify({ properties });
  }

  private doDeregisterConfigurations(configurations: IConfigurationNode[], bucket: Set<string>): void {
    const deregisterConfiguration = (configuration: IConfigurationNode) => {
      if (configuration.properties) {
        for (const key of Object.keys(configuration.properties)) {
          bucket.add(key);
          delete this.configurationProperties[key];
          this.removeFromSchema(key);
        }
      }
      configuration.allOf?.forEach((node) => deregisterConfiguration(node));
    };

    for (const configuration of configurations) {
      deregisterConfiguration(configuration);
    }
  }

  registerDefaultConfigurations(configurationDefaults: IConfigurationDefaults[]): void {
    const properties = new Set<string>();

    this.doRegisterDefaultConfigurations(configurationDefaults, properties);
    this._onDidUpdateConfiguration.notify({ properties, defaultsOverrides: true });
  }

  private doRegisterDefaultConfigurations(configurationDefaults: IConfigurationDefaults[], bucket: Set<string>) {
    this.registeredConfigurationDefaults.push(...configurationDefaults);

    const overrideIdentifiers: string[] = [];

    for (const { overrides, source } of configurationDefaults) {
      for (const key in overrides) {
        bucket.add(key);

        const configurationDefaultOverridesForKey =
          this.configurationDefaultsOverrides.get(key) ??
          this.configurationDefaultsOverrides.set(key, { configurationDefaultOverrides: [] }).get(key)!;

        const value = overrides[key];
        configurationDefaultOverridesForKey.configurationDefaultOverrides.push({ value, source });

        // Configuration defaults for Override Identifiers
        if (OVERRIDE_PROPERTY_REGEX.test(key)) {
          const newDefaultOverride = this.mergeDefaultConfigurationsForOverrideIdentifier(
            key,
            value,
            source,
            configurationDefaultOverridesForKey.configurationDefaultOverrideValue,
          );
          if (!newDefaultOverride) {
            continue;
          }

          configurationDefaultOverridesForKey.configurationDefaultOverrideValue = newDefaultOverride;
          this.updateDefaultOverrideProperty(key, newDefaultOverride, source);
          overrideIdentifiers.push(...overrideIdentifiersFromKey(key));
        }

        // Configuration defaults for Configuration Properties
        else {
          const newDefaultOverride = this.mergeDefaultConfigurationsForConfigurationProperty(
            key,
            value,
            source,
            configurationDefaultOverridesForKey.configurationDefaultOverrideValue,
          );
          if (!newDefaultOverride) {
            continue;
          }

          configurationDefaultOverridesForKey.configurationDefaultOverrideValue = newDefaultOverride;
          const property = this.configurationProperties[key];
          if (property) {
            this.updatePropertyDefaultValue(key, property);
            this.updateSchema(key, property);
          }
        }
      }
    }

    this.doRegisterOverrideIdentifiers(overrideIdentifiers);
  }

  private updateDefaultOverrideProperty(
    key: string,
    newDefaultOverride: IConfigurationDefaultOverrideValue,
    source: IExtensionInfo | undefined,
  ): void {
    const property: IRegisteredConfigurationPropertySchema = {
      type: 'object',
      default: newDefaultOverride.value,
      description: `Configure settings to be overridden for the {0} language.`,
      defaultDefaultValue: newDefaultOverride.value,
      source,
      defaultValueSource: source,
    };
    this.configurationProperties[key] = property;
  }

  private mergeDefaultConfigurationsForOverrideIdentifier(
    overrideIdentifier: string,
    configurationValueObject: StringDictionary,
    valueSource: IExtensionInfo | undefined,
    existingDefaultOverride: IConfigurationDefaultOverrideValue | undefined,
  ): IConfigurationDefaultOverrideValue | undefined {
    const defaultValue = existingDefaultOverride?.value || {};
    const source = existingDefaultOverride?.source ?? new Map<string, IExtensionInfo>();

    if (!(source instanceof Map)) return;

    for (const propertyKey of Object.keys(configurationValueObject)) {
      const propertyDefaultValue = configurationValueObject[propertyKey];

      const isObjectSetting =
        isObject(propertyDefaultValue) &&
        (isUndefined(defaultValue[propertyKey]) || isObject(defaultValue[propertyKey]));

      // If the default value is an object, merge the objects and store the source of each keys
      if (isObjectSetting) {
        defaultValue[propertyKey] = {
          ...(defaultValue[propertyKey] ?? {}),
          ...propertyDefaultValue,
        };
        // Track the source of each value in the object
        if (valueSource) {
          for (const objectKey in propertyDefaultValue) {
            source.set(`${propertyKey}.${objectKey}`, valueSource);
          }
        }
      }

      // Primitive values are overridden
      else {
        defaultValue[propertyKey] = propertyDefaultValue;
        if (valueSource) {
          source.set(propertyKey, valueSource);
        } else {
          source.delete(propertyKey);
        }
      }
    }

    return { value: defaultValue, source };
  }

  private mergeDefaultConfigurationsForConfigurationProperty(
    propertyKey: string,
    value: any,
    valuesSource: IExtensionInfo | undefined,
    existingDefaultOverride: IConfigurationDefaultOverrideValue | undefined,
  ): IConfigurationDefaultOverrideValue | undefined {
    const property = this.configurationProperties[propertyKey];
    const existingDefaultValue = existingDefaultOverride?.value ?? property?.defaultDefaultValue;
    let source: ConfigurationDefaultValueSource | undefined = valuesSource;

    const isObjectSetting =
      isObject(value) &&
      ((property !== undefined && property.type === 'object') ||
        (property === undefined && (isUndefined(existingDefaultValue) || isObject(existingDefaultValue))));

    // If the default value is an object, merge the objects and store the source of each keys
    if (isObjectSetting) {
      source = existingDefaultOverride?.source ?? new Map<string, IExtensionInfo>();

      // This should not happen
      if (!(source instanceof Map)) {
        console.error('defaultValueSource is not a Map');
        return undefined;
      }

      for (const objectKey in value) {
        if (valuesSource) {
          source.set(`${propertyKey}.${objectKey}`, valuesSource);
        }
      }
      value = { ...(isObject(existingDefaultValue) ? existingDefaultValue : {}), ...value };
    }

    return { value, source };
  }

  public deregisterDefaultConfigurations(defaultConfigurations: IConfigurationDefaults[]): void {
    const properties = new Set<string>();
    this.doDeregisterDefaultConfigurations(defaultConfigurations, properties);

    this._onDidUpdateConfiguration.notify({ properties, defaultsOverrides: true });
  }

  private doDeregisterDefaultConfigurations(
    defaultConfigurations: IConfigurationDefaults[],
    bucket: Set<string>,
  ): void {
    for (const defaultConfiguration of defaultConfigurations) {
      const index = this.registeredConfigurationDefaults.indexOf(defaultConfiguration);
      if (index !== -1) {
        this.registeredConfigurationDefaults.splice(index, 1);
      }
    }

    for (const { overrides, source } of defaultConfigurations) {
      for (const key in overrides) {
        const configurationDefaultOverridesForKey = this.configurationDefaultsOverrides.get(key);
        if (!configurationDefaultOverridesForKey) {
          continue;
        }

        const index = configurationDefaultOverridesForKey.configurationDefaultOverrides.findIndex(
          (configurationDefaultOverride) =>
            source
              ? isSameExtension(configurationDefaultOverride.source, source)
              : configurationDefaultOverride.value === overrides[key],
        );
        if (index === -1) {
          continue;
        }

        configurationDefaultOverridesForKey.configurationDefaultOverrides.splice(index, 1);
        if (configurationDefaultOverridesForKey.configurationDefaultOverrides.length === 0) {
          this.configurationDefaultsOverrides.delete(key);
        }

        if (OVERRIDE_PROPERTY_REGEX.test(key)) {
          let configurationDefaultOverrideValue: IConfigurationDefaultOverrideValue | undefined;

          // configuration override defaults - merges defaults
          for (const configurationDefaultOverride of configurationDefaultOverridesForKey.configurationDefaultOverrides) {
            configurationDefaultOverrideValue = this.mergeDefaultConfigurationsForOverrideIdentifier(
              key,
              configurationDefaultOverride.value,
              configurationDefaultOverride.source,
              configurationDefaultOverrideValue,
            );
          }

          if (configurationDefaultOverrideValue && !types.isEmptyObject(configurationDefaultOverrideValue.value)) {
            configurationDefaultOverridesForKey.configurationDefaultOverrideValue = configurationDefaultOverrideValue;
            this.updateDefaultOverrideProperty(key, configurationDefaultOverrideValue, source);
          } else {
            this.configurationDefaultsOverrides.delete(key);
            delete this.configurationProperties[key];
          }
        } else {
          let configurationDefaultOverrideValue: IConfigurationDefaultOverrideValue | undefined;

          // configuration override defaults - merges defaults
          for (const configurationDefaultOverride of configurationDefaultOverridesForKey.configurationDefaultOverrides) {
            configurationDefaultOverrideValue = this.mergeDefaultConfigurationsForConfigurationProperty(
              key,
              configurationDefaultOverride.value,
              configurationDefaultOverride.source,
              configurationDefaultOverrideValue,
            );
          }

          configurationDefaultOverridesForKey.configurationDefaultOverrideValue = configurationDefaultOverrideValue;

          const property = this.configurationProperties[key];
          if (property) {
            this.updatePropertyDefaultValue(key, property);
            this.updateSchema(key, property);
          }
        }
        bucket.add(key);
      }
    }
    this.updateOverridePropertyPatternKey();
  }

  private doRegisterOverrideIdentifiers(overrideIdentifiers: string[]) {
    for (const overrideIdentifier of overrideIdentifiers) {
      this.overrideIdentifiers.add(overrideIdentifier);
    }
    this.updateOverridePropertyPatternKey();
  }

  private updateOverridePropertyPatternKey() {
    for (const overrideIdentifier of this.overrideIdentifiers.values()) {
      const overrideIdentifierProperty = `[${overrideIdentifier}]`;
      const propertiesSchema: IJSONSchema = {
        type: 'object',
        description: 'overrideSettings.defaultDescription',
        errorMessage: 'overrideSettings.errorMessage',
      };
      this.updatePropertyDefaultValue(overrideIdentifierProperty, propertiesSchema);
      allSettings.properties[overrideIdentifierProperty] = propertiesSchema;
    }
  }

  getConfigurationProperties(): StringDictionary<IRegisteredConfigurationPropertySchema> {
    return this.configurationProperties;
  }

  getExcludedConfigurationProperties(): StringDictionary<IRegisteredConfigurationPropertySchema> {
    return this.excludedConfigurationProperties;
  }

  getRegisteredDefaultConfigurations(): IConfigurationDefaults[] {
    return [...this.registeredConfigurationDefaults];
  }

  getConfigurationDefaultsOverrides(): Map<string, IConfigurationDefaultOverrideValue> {
    const configurationDefaultsOverrides = new Map<string, IConfigurationDefaultOverrideValue>();
    for (const [key, value] of this.configurationDefaultsOverrides) {
      if (value.configurationDefaultOverrideValue) {
        configurationDefaultsOverrides.set(key, value.configurationDefaultOverrideValue);
      }
    }
    return configurationDefaultsOverrides;
  }

  private registerJSONConfiguration(configuration: IConfigurationNode) {
    const register = (configuration: IConfigurationNode) => {
      const properties = configuration.properties;
      if (properties) {
        Object.keys(properties).forEach((key) => {
          this.updateSchema(key, properties[key]);
        });
      }
      const subNodes = configuration.allOf;
      subNodes?.forEach(register);
    };
    register(configuration);
  }

  private updateSchema(key: string, property: IConfigurationPropertySchema): void {
    allSettings.properties[key] = property;
  }

  private removeFromSchema(key: string): void {
    delete allSettings.properties[key];
  }
}

function isSameExtension(a?: IExtensionInfo, b?: IExtensionInfo): boolean {
  if (!a || !b) return false;
  return a.id === b.id && a.version === b.version;
}

export const ConfigurationRegistry = new ConfigurationRegistryImpl();

Registry.add(Extensions.Configuration, ConfigurationRegistry);
