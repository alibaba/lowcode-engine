import { isLocationChildrenDetail } from '../../../src/check-types/is-location-children-detail';
import { IPublicTypeLocationChildrenDetail, IPublicTypeLocationDetailType } from '@alilc/lowcode-types';

describe('isLocationChildrenDetail', () => {
  it('should return true when obj is IPublicTypeLocationChildrenDetail', () => {
    const obj: IPublicTypeLocationChildrenDetail = {
      type: IPublicTypeLocationDetailType.Children,
      // 添加其他必要的属性
    };

    expect(isLocationChildrenDetail(obj)).toBe(true);
  });

  it('should return false when obj is not IPublicTypeLocationChildrenDetail', () => {
    const obj = {
      type: 'other',
      // 添加其他必要的属性
    };

    expect(isLocationChildrenDetail(obj)).toBe(false);
    expect(isLocationChildrenDetail(null)).toBe(false);
    expect(isLocationChildrenDetail(undefined)).toBe(false);
    expect(isLocationChildrenDetail('string')).toBe(false);
    expect(isLocationChildrenDetail(0)).toBe(false);
    expect(isLocationChildrenDetail(2)).toBe(false);
  });
});
