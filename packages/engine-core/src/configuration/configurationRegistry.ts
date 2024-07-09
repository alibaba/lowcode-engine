import {
  type Event,
  Emitter,
  type StringDictionary,
  type JSONValueType,
  jsonTypes,
} from '@alilc/lowcode-shared';
import { uniq, isUndefined } from 'lodash-es';
import { Registry } from '../extension/registry';

const OVERRIDE_IDENTIFIER_PATTERN = `\\[([^\\]]+)\\]`;
const OVERRIDE_IDENTIFIER_REGEX = new RegExp(OVERRIDE_IDENTIFIER_PATTERN, 'g');
export const OVERRIDE_PROPERTY_PATTERN = `^(${OVERRIDE_IDENTIFIER_PATTERN})+$`;
export const OVERRIDE_PROPERTY_REGEX = new RegExp(OVERRIDE_PROPERTY_PATTERN);

export function overrideIdentifiersFromKey(key: string): string[] {
  const identifiers: string[] = [];
  if (OVERRIDE_PROPERTY_REGEX.test(key)) {
    let matches = OVERRIDE_IDENTIFIER_REGEX.exec(key);
    while (matches?.length) {
      const identifier = matches[1].trim();
      if (identifier) {
        identifiers.push(identifier);
      }
      matches = OVERRIDE_IDENTIFIER_REGEX.exec(key);
    }
  }
  return uniq(identifiers);
}

export interface IConfigurationRegistry {
  /**
   * Register a configuration to the registry.
   */
  registerConfiguration(configuration: IConfigurationNode, validate?: boolean): void;

  /**
   * Register multiple configurations to the registry.
   */
  registerConfigurations(configurations: IConfigurationNode[], validate?: boolean): void;

  /**
   * Deregister multiple configurations from the registry.
   */
  deregisterConfigurations(configurations: IConfigurationNode[]): void;

  /**
   * Signal that the schema of a configuration setting has changes. It is currently only supported to change enumeration values.
   * Property or default value changes are not allowed.
   */
  notifyConfigurationSchemaUpdated(): void;
  /**
   * Event that fires whenever a configuration has been
   * registered.
   */
  readonly onDidSchemaChange: Event<void>;
  /**
   * Event that fires whenever a configuration has been
   * registered.
   */
  readonly onDidUpdateConfiguration: Event<{
    properties: ReadonlySet<string>;
    defaultsOverrides?: boolean;
  }>;

  /**
   * Returns all configuration nodes contributed to this registry.
   */
  getConfigurations(): IConfigurationNode[];
  /**
   * Returns all configurations settings of all configuration nodes contributed to this registry.
   */
  getConfigurationProperties(): StringDictionary<IRegisteredConfigurationPropertySchema>;
  /**
   * Returns all excluded configurations settings of all configuration nodes contributed to this registry.
   */
  getExcludedConfigurationProperties(): StringDictionary<IRegisteredConfigurationPropertySchema>;
}

export interface IConfigurationNode {
  id?: string;
  order?: number;
  type?: JSONValueType | JSONValueType[];
  title?: string;
  description?: string;
  properties?: StringDictionary<IConfigurationPropertySchema>;
  allOf?: IConfigurationNode[];
  extensionInfo?: IExtensionInfo;
}

export interface IConfigurationPropertySchema {
  type?: JSONValueType;
  default?: any;
  tags?: string[];
  included?: boolean;
  deprecated?: boolean;
  deprecationMessage?: string;
}

export interface IExtensionInfo {
  id: string;
  displayName?: string;
}

export type ConfigurationDefaultValueSource = IExtensionInfo | Map<string, IExtensionInfo>;

export interface IConfigurationDefaults {
  overrides: StringDictionary;
  source?: IExtensionInfo;
}

export interface IRegisteredConfigurationPropertySchema extends IConfigurationPropertySchema {
  source?: IExtensionInfo; // Source of the Property
  defaultValueSource?: ConfigurationDefaultValueSource; // Source of the Default Value
}

export class ConfigurationRegistry implements IConfigurationRegistry {
  private configurationContributors: IConfigurationNode[];
  private configurationProperties: StringDictionary<IRegisteredConfigurationPropertySchema>;
  private excludedConfigurationProperties: StringDictionary<IRegisteredConfigurationPropertySchema>;

  private schemaChangeEmitter = new Emitter<void>();
  private updateConfigurationEmitter = new Emitter<{
    properties: ReadonlySet<string>;
    defaultsOverrides?: boolean;
  }>();

  constructor() {
    this.configurationContributors = [];
    this.configurationProperties = {};
    this.excludedConfigurationProperties = {};
  }

  registerConfiguration(configuration: IConfigurationNode, validate: boolean = true): void {
    this.registerConfigurations([configuration], validate);
  }

  registerConfigurations(configurations: IConfigurationNode[], validate: boolean = true): void {
    const properties = new Set<string>();
    this.doRegisterConfigurations(configurations, validate, properties);

    this.schemaChangeEmitter.emit();
    this.updateConfigurationEmitter.emit({ properties });
  }

  private doRegisterConfigurations(
    configurations: IConfigurationNode[],
    validate: boolean,
    bucket: Set<string>,
  ): void {
    configurations.forEach((configuration) => {
      this.validateAndRegisterProperties(
        configuration,
        validate,
        configuration.extensionInfo,
        bucket,
      );

      this.configurationContributors.push(configuration);
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
      for (const key in properties) {
        const property: IRegisteredConfigurationPropertySchema = properties[key];

        if (validate && this.validateProperty(key)) {
          continue;
        }

        property.source = extensionInfo;

        // update default value
        this.updatePropertyDefaultValue(property);

        // Add to properties maps
        // Property is included by default if 'included' is unspecified
        if (
          Object.prototype.hasOwnProperty.call(properties[key], 'included') &&
          !properties[key].included
        ) {
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

  private updatePropertyDefaultValue(property: IRegisteredConfigurationPropertySchema): void {
    let defaultValue = undefined;
    let defaultSource = undefined;

    if (isUndefined(defaultValue)) {
      defaultValue = property.default;
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

    this.schemaChangeEmitter.emit();
    this.updateConfigurationEmitter.emit({ properties });
  }

  private doDeregisterConfigurations(
    configurations: IConfigurationNode[],
    bucket: Set<string>,
  ): void {
    const deregisterConfiguration = (configuration: IConfigurationNode) => {
      if (configuration.properties) {
        for (const key in configuration.properties) {
          bucket.add(key);
          delete this.configurationProperties[key];
        }
      }
      configuration.allOf?.forEach((node) => deregisterConfiguration(node));
    };

    for (const configuration of configurations) {
      deregisterConfiguration(configuration);

      const index = this.configurationContributors.indexOf(configuration);
      if (index !== -1) {
        this.configurationContributors.splice(index, 1);
      }
    }
  }

  notifyConfigurationSchemaUpdated(): void {
    this.schemaChangeEmitter.emit();
  }

  getConfigurationProperties(): StringDictionary<IRegisteredConfigurationPropertySchema> {
    return this.configurationProperties;
  }

  getConfigurations(): IConfigurationNode[] {
    return this.configurationContributors;
  }

  getExcludedConfigurationProperties(): StringDictionary<IRegisteredConfigurationPropertySchema> {
    return this.excludedConfigurationProperties;
  }

  onDidUpdateConfiguration(
    fn: (change: {
      properties: ReadonlySet<string>;
      defaultsOverrides?: boolean | undefined;
    }) => void,
  ) {
    return this.updateConfigurationEmitter.on(fn);
  }

  onDidSchemaChange(fn: () => void) {
    return this.schemaChangeEmitter.on(fn);
  }
}

export const Extension = {
  Configuration: 'base.contributions.configuration',
};

Registry.add(Extension.Configuration, new ConfigurationRegistry());
