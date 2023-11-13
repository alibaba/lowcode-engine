import { isJSSlot } from '../../../src/check-types/is-jsslot';
import { IPublicTypeJSSlot } from '@alilc/lowcode-types';

describe('isJSSlot', () => {
  it('should return true when input is of type IPublicTypeJSSlot', () => {
    const input: IPublicTypeJSSlot = {
      type: 'JSSlot',
      // other properties of IPublicTypeJSSlot
    };

    const result = isJSSlot(input);

    expect(result).toBe(true);
  });

  it('should return false when input is not of type IPublicTypeJSSlot', () => {
    const input = {
      type: 'OtherType',
      // other properties
    };

    const result = isJSSlot(input);

    expect(result).toBe(false);
  });

  it('should return false when input is null or undefined', () => {
    const input1 = null;
    const input2 = undefined;

    const result1 = isJSSlot(input1);
    const result2 = isJSSlot(input2);

    expect(result1).toBe(false);
    expect(result2).toBe(false);
  });
});
