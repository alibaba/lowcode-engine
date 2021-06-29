// @ts-nocheck
import { includeSlot, removeSlot } from '../../src/utils/slot';

const genGetExtraProp = (val: string) => () => {
  return {
    getAsString() {
      return val;
    },
  };
};

const remove = () => {};

const mockNode = {
  slots: [{
    getExtraProp: genGetExtraProp('haha'),
    remove,
  }, {
    getExtraProp: genGetExtraProp('heihei'),
    remove,
  }]
};

it('includeSlot', () => {
  expect(includeSlot(mockNode, 'haha')).toBeTruthy();
  expect(includeSlot(mockNode, 'heihei')).toBeTruthy();
  expect(includeSlot(mockNode, 'xixi')).toBeFalsy();
});

it('removeSlot', () => {
  expect(removeSlot(mockNode, 'xixi')).toBeFalsy();
  expect(mockNode.slots).toHaveLength(2);
  expect(removeSlot(mockNode, 'haha')).toBeTruthy();
  expect(mockNode.slots).toHaveLength(1);
  expect(removeSlot(mockNode, 'heihei')).toBeTruthy();
  expect(mockNode.slots).toHaveLength(0);
});
