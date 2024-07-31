import { IPublicEnumDragObjectType } from '@alilc/lowcode-types';
import { isDragNodeObject } from '../../../src/check-types/is-drag-node-object';

describe('isDragNodeObject', () => {
  it('should return true if the object is of IPublicTypeDragNodeObject type and has type IPublicEnumDragObjectType.Node', () => {
    const obj = {
      type: IPublicEnumDragObjectType.Node,
      //... other properties
    };

    expect(isDragNodeObject(obj)).toBe(true);
  });

  it('should return false if the object is not of IPublicTypeDragNodeObject type', () => {
    const obj = {
      type: IPublicEnumDragObjectType.OtherType,
      //... other properties
    };

    expect(isDragNodeObject(obj)).toBe(false);
  });

  it('should return false if the object is of IPublicTypeDragNodeObject type but type is not IPublicEnumDragObjectType.Node', () => {
    const obj = {
      type: IPublicEnumDragObjectType.OtherType,
      //... other properties
    };

    expect(isDragNodeObject(obj)).toBe(false);
  });

  it('should return false if the object is null or undefined', () => {
    expect(isDragNodeObject(null)).toBe(false);
    expect(isDragNodeObject(undefined)).toBe(false);
  });
});
