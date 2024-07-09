import { createDecorator, Provide, type Event } from '@alilc/lowcode-shared';
import { IConfigurationOverrides, IConfigurationUpdateOverrides } from './configuration';

export interface IConfigurationChangeEvent {
  readonly affectedKeys: ReadonlySet<string>;
  readonly change: IConfigurationChange;

  affectsConfiguration(configuration: string, overrides?: string[]): boolean;
}

export interface IConfigurationChange {
  keys: string[];
  overrides: [string, string[]][];
}

export interface IConfigurationService {
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
  updateValue(
    key: string,
    value: any,
    overrides: IConfigurationOverrides | IConfigurationUpdateOverrides,
  ): Promise<void>;

  inspect<T>(key: string, overrides?: IConfigurationOverrides): Readonly<T>;

  reloadConfiguration(): Promise<void>;

  keys(): string[];

  onDidChangeConfiguration: Event<IConfigurationChangeEvent>;
}

export const IConfigurationService = createDecorator<IConfigurationService>('configurationService');

@Provide(IConfigurationService)
export class ConfigurationService implements IConfigurationService {}
