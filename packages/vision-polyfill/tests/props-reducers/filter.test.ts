import '../fixtures/window';
import { Node, Designer, getConvertedExtraKey } from '@ali/lowcode-designer';
import { Editor } from '@ali/lowcode-editor-core';
import { filterReducer } from '../../src/props-reducers/filter-reducer';
import formSchema from '../fixtures/schema/form';

describe('filterReducer 测试', () => {
  it('filterReducer 测试 - 有 filters', () => {
    const mockNode = {
      componentMeta: {
        getMetadata() {
          return {
            experimental: {
              filters: [
                {
                  name: 'shouldBeFitlered',
                  filter: () => false,
                },
                {
                  name: 'keeped',
                  filter: () => true,
                },
                {
                  name: 'throwErr',
                  filter: () => { throw new Error('xxx'); },
                },
                {
                  name: 'zzz',
                  filter: () => true,
                },
              ],
            },
          };
        },
      },
      settingEntry: {
        getProp(propName) {
          return { name: propName };
        },
      },
    };
    expect(filterReducer({
      shouldBeFitlered: 111,
      keeped: 222,
      noCorresponingFilter: 222,
      throwErr: 111,
    }, mockNode)).toEqual({
      keeped: 222,
      noCorresponingFilter: 222,
      throwErr: 111,
    });
  });

  it('filterReducer 测试 - 无 filters', () => {
    const mockNode = {
      componentMeta: {
        getMetadata() {
          return {
            experimental: {
              filters: [],
            },
          };
        },
      },
      settingEntry: {
        getProp(propName) {
          return { name: propName };
        },
      },
    };
    expect(filterReducer({
      shouldBeFitlered: 111,
      keeped: 222,
      noCorresponingFilter: 222,
    }, mockNode)).toEqual({
      shouldBeFitlered: 111,
      keeped: 222,
      noCorresponingFilter: 222,
    });
  });
});
