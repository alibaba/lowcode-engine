import { type StringDictionary, Emitter, type EventListener } from '@alilc/lowcode-shared';
import { ConfigurationModel } from './configurationModel';
import {
  type IConfigurationRegistry,
  type IRegisteredConfigurationPropertySchema,
  Extension,
} from './configurationRegistry';
import { Registry } from '../extension';

export interface IConfigurationOverrides {
  overrideIdentifier?: string | null;
}

export interface IConfigurationUpdateOverrides {
  overrideIdentifiers?: string[] | null;
}

export class DefaultConfiguration {
  private emitter = new Emitter<{
    defaults: ConfigurationModel;
    properties: string[];
  }>();

  private _configurationModel = ConfigurationModel.createEmptyModel();

  get configurationModel(): ConfigurationModel {
    return this._configurationModel;
  }

  initialize(): ConfigurationModel {
    this.resetConfigurationModel();
    Registry.as<IConfigurationRegistry>(Extension.Configuration).onDidUpdateConfiguration(
      ({ properties }) => this.onDidUpdateConfiguration([...properties]),
    );

    return this.configurationModel;
  }

  reload(): ConfigurationModel {
    this.resetConfigurationModel();
    return this.configurationModel;
  }

  onDidChangeConfiguration(
    listener: EventListener<[{ defaults: ConfigurationModel; properties: string[] }]>,
  ) {
    return this.emitter.on(listener);
  }

  private onDidUpdateConfiguration(properties: string[]): void {
    this.updateConfigurationModel(
      properties,
      Registry.as<IConfigurationRegistry>(Extension.Configuration).getConfigurationProperties(),
    );
    this.emitter.emit({ defaults: this.configurationModel, properties });
  }

  private resetConfigurationModel(): void {
    this._configurationModel = ConfigurationModel.createEmptyModel();

    const properties = Registry.as<IConfigurationRegistry>(
      Extension.Configuration,
    ).getConfigurationProperties();

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
