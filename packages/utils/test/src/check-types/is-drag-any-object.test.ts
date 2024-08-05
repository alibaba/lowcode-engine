import { isDragAnyObject } from '../../../src/check-types/is-drag-any-object';
import { IPublicEnumDragObjectType } from '@alilc/lowcode-types';

describe('isDragAnyObject', () => {
  it('should return false if obj is null', () => {
    const result = isDragAnyObject(null);
    expect(result).toBe(false);
  });

  it('should return false if obj is number', () => {
    const result = isDragAnyObject(2);
    expect(result).toBe(false);
  });

  it('should return false if obj.type is NodeData', () => {
    const obj = { type: IPublicEnumDragObjectType.NodeData };
    const result = isDragAnyObject(obj);
    expect(result).toBe(false);
  });

  it('should return false if obj.type is Node', () => {
    const obj = { type: IPublicEnumDragObjectType.Node };
    const result = isDragAnyObject(obj);
    expect(result).toBe(false);
  });

  it('should return true if obj.type is anything else', () => {
    const obj = { type: 'SomeOtherType' };
    const result = isDragAnyObject(obj);
    expect(result).toBe(true);
  });
});
