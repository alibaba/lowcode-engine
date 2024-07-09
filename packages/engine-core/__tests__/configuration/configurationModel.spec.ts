import { ConfigurationModel } from '../../src';
import { describe, it, expect } from 'vitest';

describe('ConfigurationModel', () => {
  it('should create an empty model', () => {
    const model = ConfigurationModel.createEmptyModel();
    expect(model.isEmpty()).toBe(true);
  });

  it('should add, set, and get values', () => {
    const model = ConfigurationModel.createEmptyModel();
    const key = 'testKey';
    const value = 'testValue';

    model.setValue(key, value);
    expect(model.getValue(key)).toBe(value);

    const newValue = 'newValue';
    model.addValue(key, newValue);
    expect(model.getValue(key)).toBe(newValue);

    model.removeValue(key);
    expect(model.getValue(key)).toBeUndefined();
  });

  it('should handle overrides', () => {
    const model = ConfigurationModel.createEmptyModel();
    const key = '[env].testKey';
    const value = 'testValue';

    model.setValue(key, value);
    const overrides = model.overrides[0];
    expect(overrides.keys).toContain('testKey');
    expect(overrides.contents).toHaveProperty('testKey', value);
    expect(overrides.identifiers).toContain('env');

    model.removeValue(key);
    expect(model.getValue(key)).toBeUndefined();
    expect(model.overrides.length).toBe(0);
  });

  it('should create overrides correctly', () => {
    const model = ConfigurationModel.createEmptyModel();
    const baseKey = 'baseKey';
    const baseValue = 'baseValue';
    const overrideKey = '[environment].overrideKey';
    const overrideValue = 'overrideValue';

    // Set base and override values
    model.setValue(baseKey, baseValue);
    model.setValue(overrideKey, overrideValue);

    // Override configuration model for a specific environment
    const envModel = model.override('environment');
    expect(envModel.getValue('overrideKey')).toBe(overrideValue);
    expect(envModel.getValue(baseKey)).toBeUndefined();
    expect(envModel.overrides).toEqual(model.overrides);
  });
});
