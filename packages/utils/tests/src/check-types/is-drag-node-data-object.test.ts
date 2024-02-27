import { IPublicEnumDragObjectType, IPublicTypeDragNodeDataObject } from '@alilc/lowcode-types';
import { isDragNodeDataObject } from '../../../src/check-types/is-drag-node-data-object';

describe('isDragNodeDataObject', () => {
  test('should return true for valid IPublicTypeDragNodeDataObject', () => {
    const obj: IPublicTypeDragNodeDataObject = {
      type: IPublicEnumDragObjectType.NodeData,
      // 其他属性...
    };

    expect(isDragNodeDataObject(obj)).toBe(true);
  });

  test('should return false for invalid IPublicTypeDragNodeDataObject', () => {
    const obj: any = {
      type: 'InvalidType',
      // 其他属性...
    };

    expect(isDragNodeDataObject(obj)).toBe(false);
  });

  test('should return false for null or undefined', () => {
    expect(isDragNodeDataObject(null)).toBe(false);
    expect(isDragNodeDataObject(undefined)).toBe(false);
  });

  // 可以添加更多测试用例...
});
