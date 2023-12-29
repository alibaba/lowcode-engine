import { isLowCodeComponentType } from '../../../src/check-types/is-lowcode-component-type';
import { IPublicTypeLowCodeComponent, IPublicTypeProCodeComponent } from '@alilc/lowcode-types';

describe('isLowCodeComponentType', () => {
  test('should return true for a low code component type', () => {
    const desc: IPublicTypeLowCodeComponent = {
      // create a valid low code component description
    };

    expect(isLowCodeComponentType(desc)).toBe(true);
  });

  test('should return false for a pro code component type', () => {
    const desc: IPublicTypeProCodeComponent = {
      // create a valid pro code component description
      package: 'pro-code'
    };

    expect(isLowCodeComponentType(desc)).toBe(false);
  });
});
