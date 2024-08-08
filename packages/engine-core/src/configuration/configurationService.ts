import { createDecorator, Disposable, Events } from '@alilc/lowcode-shared';
import {
  Configuration,
  DefaultConfiguration,
  type IConfigurationData,
  type IConfigurationOverrides,
  type IConfigurationValue,
  UserConfiguration,
} from './configurations';
import { ConfigurationModel } from './configurationModel';
import { isEqual } from 'lodash-es';
import {
  ConfigurationChangeEvent,
  type IConfigurationChangeEvent,
  type IConfigurationChange,
} from './configurationChangeEvent';

export interface IConfigurationService {
  initialize(): Promise<void>;

  /**
   * Fetches the value of the section for the given overrides.
   * Value can be of native type or an object keyed off the section name.
   *
   * @param section - Section of the configuration. Can be `null` or `undefined`.
   * @param overrides - Overrides that has to be applied while fetching
   *
   */
  getValue<T>(): T;
  getValue<T>(section: string): T;
  getValue<T>(overrides: IConfigurationOverrides): T;
  getValue<T>(section: string, overrides: IConfigurationOverrides): T;

  /**
   * Update a configuration value.
   *
   * Use `overrides` to update the configuration for a resource or for override identifiers or both.
   *
   * Passing a resource through overrides will update the configuration in the workspace folder containing that resource.
   *
   * *Note 1:* Updating configuration to a default value will remove the configuration from the requested target. If not target is passed, it will be removed from all writeable targets.
   *
   * *Note 2:* Use `undefined` value to remove the configuration from the given target. If not target is passed, it will be removed from all writeable targets.
   *
   * @param key setting to be updated
   * @param value The new value
   */
  updateValue(key: string, value: any): Promise<void>;
  updateValue(key: string, value: any, overrides: IConfigurationOverrides): Promise<void>;

  inspect<T>(key: string, overrides?: IConfigurationOverrides): IConfigurationValue<Readonly<T>>;

  reloadConfiguration(): Promise<void>;

  keys(): {
    default: string[];
    user: string[];
    memory?: string[];
  };

  onDidChangeConfiguration: Events.Event<IConfigurationChangeEvent>;
}

export const IConfigurationService = createDecorator<IConfigurationService>('configurationService');

export class ConfigurationService extends Disposable implements IConfigurationService {
  private configuration: Configuration;
  private readonly defaultConfiguration: DefaultConfiguration;
  private readonly userConfiguration: UserConfiguration;

  private readonly _onDidChangeConfiguration = this._addDispose(
    new Events.Emitter<IConfigurationChangeEvent>(),
  );
  onDidChangeConfiguration = this._onDidChangeConfiguration.event;

  constructor() {
    super();

    this.defaultConfiguration = new DefaultConfiguration();
    this.userConfiguration = new UserConfiguration({});
    this.configuration = new Configuration(
      this.defaultConfiguration.configurationModel,
      ConfigurationModel.createEmptyModel(),
      ConfigurationModel.createEmptyModel(),
    );
  }

  async initialize(): Promise<void> {
    const [defaultModel, userModel] = await Promise.all([
      this.defaultConfiguration.initialize(),
      this.userConfiguration.loadConfiguration(),
    ]);

    this.configuration = new Configuration(
      defaultModel,
      userModel,
      ConfigurationModel.createEmptyModel(),
    );
  }

  getConfigurationData(): IConfigurationData {
    return this.configuration.toData();
  }

  getValue<T>(): T;
  getValue<T>(section: string): T;
  getValue<T>(overrides: IConfigurationOverrides): T;
  getValue<T>(section: string, overrides: IConfigurationOverrides): T;
  getValue(arg1?: unknown, arg2?: unknown): any {
    const section = typeof arg1 === 'string' ? arg1 : undefined;
    const overrides = isConfigurationOverrides(arg1)
      ? arg1
      : isConfigurationOverrides(arg2)
        ? arg2
        : {};

    return this.configuration.getValue(section, overrides);
  }

  updateValue(key: string, value: any): Promise<void>;
  updateValue(key: string, value: any, overrides: IConfigurationOverrides): Promise<void>;
  async updateValue(key: string, value: any, arg3?: IConfigurationOverrides): Promise<void> {
    const overrides: IConfigurationOverrides | undefined = isConfigurationOverrides(arg3)
      ? arg3
      : undefined;

    const inspect = this.inspect(key, {
      overrideIdentifier: overrides?.overrideIdentifier,
    });

    // Remove the setting, if the value is same as default value
    if (isEqual(value, inspect.defaultValue)) {
      value = undefined;
    }

    if (overrides?.overrideIdentifier) {
      const overrideIdentifier = overrides.overrideIdentifier;
      const existingOverride = this.configuration.userConfiguration.overrides.find((override) =>
        override.identifiers.includes(overrideIdentifier),
      );
      if (!existingOverride) {
        overrides.overrideIdentifier = undefined;
      }
    }

    const path = overrides?.overrideIdentifier ? [overrides.overrideIdentifier, key] : [key];

    // modify user config later todo...
    await this.userConfiguration.syncRemoteConfiguration(path, value);
  }

  inspect<T>(key: string, overrides: IConfigurationOverrides = {}): IConfigurationValue<T> {
    return this.configuration.inspect<T>(key, overrides);
  }

  keys(): {
    default: string[];
    user: string[];
  } {
    return this.configuration.keys();
  }

  async reloadConfiguration(): Promise<void> {
    const configurationModel = await this.userConfiguration.loadConfiguration();
    this.onDidChangeUserConfiguration(configurationModel);
  }

  private onDidChangeUserConfiguration(user: ConfigurationModel) {
    const previous = this.configuration.toData();
    const change = this.configuration.compareAndUpdateUserConfiguration(user);
    this.trigger(change, previous);
  }

  private trigger(configurationChange: IConfigurationChange, previous: IConfigurationData): void {
    const event = new ConfigurationChangeEvent(
      configurationChange,
      { data: previous },
      this.configuration,
    );
    this._onDidChangeConfiguration.notify(event);
  }
}

export function isConfigurationOverrides(thing: any): thing is IConfigurationOverrides {
  return (
    thing &&
    typeof thing === 'object' &&
    (!thing.overrideIdentifier || typeof thing.overrideIdentifier === 'string')
  );
}

export function keyFromOverrideIdentifiers(overrideIdentifiers: string[]): string {
  return overrideIdentifiers.reduce(
    (result, overrideIdentifier) => `${result}[${overrideIdentifier}]`,
    '',
  );
}
