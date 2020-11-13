import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
import formSchema from '../fixtures/schema/form';
import { Project } from '../../src';

describe.skip('VisualEngine.Project 相关 API 测试', () => {
  it('getSchema / setSchema 系列', () => {
    Project.setSchema({
      componentsMap: {},
      componentsTree: [formSchema],
    });
    expect(Project.getSchema()).toEqual({
      componentsMap: {},
      componentsTree: [formSchema],
    });

  });

  it('setConfig', () => {
    Project.setConfig({ haha: 1 });
    expect(Project.get('config')).toEqual({
      haha: 1,
    });
  });
});
