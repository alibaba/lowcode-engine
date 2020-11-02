import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import '../fixtures/window';
import { Node } from '../../src/document/node/node';
import { Designer } from '../../src/designer/designer';
import divMeta from '../fixtures/component-metadata/div';
import { ComponentMeta } from '../../src/component-meta';

const mockCreateSettingEntry = jest.fn();
jest.mock('../../src/designer/designer', () => {
  return {
    Designer: jest.fn().mockImplementation(() => {
      return {
        getGlobalComponentActions: () => [],
      };
    }),
  };
});

let designer = null;
beforeAll(() => {
  designer = new Designer({});
});

describe('组件元数据处理', () => {
  it('构造函数', () => {
    const meta = new ComponentMeta(designer, divMeta);
    console.log(meta);
  });
});