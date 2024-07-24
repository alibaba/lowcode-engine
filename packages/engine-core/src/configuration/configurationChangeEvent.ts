import { isEqual } from 'lodash-es';
import {
  Configuration,
  type IConfigurationData,
  type IConfigurationOverrides,
} from './configurations';

export interface IConfigurationChange {
  keys: string[];
  overrides: [string, string[]][];
}

export interface IConfigurationChangeEvent {
  readonly affectedKeys: ReadonlySet<string>;
  readonly change: IConfigurationChange;

  affectsConfiguration(section: string, overrides?: IConfigurationOverrides): boolean;
}

export class ConfigurationChangeEvent implements IConfigurationChangeEvent {
  private readonly _marker = '\n';
  private readonly _markerCode1 = this._marker.charCodeAt(0);
  private readonly _markerCode2 = '.'.charCodeAt(0);
  private readonly _affectsConfigStr: string;

  readonly affectedKeys = new Set<string>();

  constructor(
    readonly change: IConfigurationChange,
    private readonly previous: { data: IConfigurationData } | undefined,
    private readonly currentConfiguraiton: Configuration,
  ) {
    for (const key of change.keys) {
      this.affectedKeys.add(key);
    }
    for (const [, keys] of change.overrides) {
      for (const key of keys) {
        this.affectedKeys.add(key);
      }
    }

    // Example: '\nfoo.bar\nabc.def\n'
    this._affectsConfigStr = this._marker;
    for (const key of this.affectedKeys) {
      this._affectsConfigStr += key + this._marker;
    }
  }

  private _previousConfiguration: Configuration | undefined = undefined;
  get previousConfiguration(): Configuration | undefined {
    if (!this._previousConfiguration && this.previous) {
      this._previousConfiguration = Configuration.parse(this.previous.data);
    }
    return this._previousConfiguration;
  }

  affectsConfiguration(section: string, overrides?: IConfigurationOverrides): boolean {
    // we have one large string with all keys that have changed. we pad (marker) the section
    // and check that either find it padded or before a segment character
    const needle = this._marker + section;
    const idx = this._affectsConfigStr.indexOf(needle);
    if (idx < 0) {
      // NOT: (marker + section)
      return false;
    }
    const pos = idx + needle.length;
    if (pos >= this._affectsConfigStr.length) {
      return false;
    }
    const code = this._affectsConfigStr.charCodeAt(pos);
    if (code !== this._markerCode1 && code !== this._markerCode2) {
      // NOT: section + (marker | segment)
      return false;
    }

    if (overrides) {
      const value1 = this.previousConfiguration
        ? this.previousConfiguration.getValue(section, overrides)
        : undefined;
      const value2 = this.currentConfiguraiton.getValue(section, overrides);
      return !isEqual(value1, value2);
    }

    return true;
  }
}
