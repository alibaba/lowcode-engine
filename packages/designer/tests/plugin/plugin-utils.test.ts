import '../fixtures/window';
import { isValidPreferenceKey, filterValidOptions } from '../../src/plugin/plugin-utils';

describe('plugin utils 测试', () => {
  it('isValidPreferenceKey', () => {
    expect(isValidPreferenceKey('x')).toBeFalsy();
    expect(isValidPreferenceKey('x', { properties: {} })).toBeFalsy();
    expect(isValidPreferenceKey('x', { properties: 1 })).toBeFalsy();
    expect(isValidPreferenceKey('x', { properties: 'str' })).toBeFalsy();
    expect(isValidPreferenceKey('x', { properties: [] })).toBeFalsy();
    expect(
      isValidPreferenceKey('x', {
        title: 'title',
        properties: [
          {
            key: 'y',
            type: 'string',
            description: 'x desc',
          },
        ],
      }),
    ).toBeFalsy();
    expect(
      isValidPreferenceKey('x', {
        title: 'title',
        properties: [
          {
            key: 'x',
            type: 'string',
            description: 'x desc',
          },
        ],
      }),
    ).toBeTruthy();
  });

  it('filterValidOptions', () => {
    const mockDeclaration = {
      title: 'title',
      properties: [
        {
          key: 'x',
          type: 'string',
          description: 'x desc',
        },
        {
          key: 'y',
          type: 'string',
          description: 'y desc',
        },
        {
          key: 'z',
          type: 'string',
          description: 'z desc',
        },
      ],
    };

    expect(filterValidOptions()).toBeUndefined();
    expect(filterValidOptions(1)).toBe(1);
    expect(filterValidOptions({
      x: 1,
      y: 2,
    }, mockDeclaration)).toEqual({
      x: 1,
      y: 2,
    });
    expect(filterValidOptions({
      x: 1,
      y: undefined,
    }, mockDeclaration)).toEqual({
      x: 1,
    });
    expect(filterValidOptions({
      x: 1,
      z: null,
    }, mockDeclaration)).toEqual({
      x: 1,
    });
    expect(filterValidOptions({
      a: 1,
    }, mockDeclaration)).toEqual({
    });
  });
});
