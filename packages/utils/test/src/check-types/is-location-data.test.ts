import { isLocationData } from '../../../src/check-types/is-location-data';
import { IPublicTypeLocationData } from '@alilc/lowcode-types';

describe('isLocationData', () => {
  it('should return true when obj is valid location data', () => {
    const obj: IPublicTypeLocationData = {
      target: 'some target',
      detail: 'some detail',
    };

    const result = isLocationData(obj);

    expect(result).toBe(true);
  });

  it('should return false when obj is missing target or detail', () => {
    const obj1 = {
      target: 'some target',
      // missing detail
    };

    const obj2 = {
      // missing target
      detail: 'some detail',
    };

    const result1 = isLocationData(obj1);
    const result2 = isLocationData(obj2);

    expect(result1).toBe(false);
    expect(result2).toBe(false);
  });

  it('should return false when obj is null or undefined', () => {
    const obj1 = null;
    const obj2 = undefined;

    const result1 = isLocationData(obj1);
    const result2 = isLocationData(obj2);

    expect(result1).toBe(false);
    expect(result2).toBe(false);
  });
});
