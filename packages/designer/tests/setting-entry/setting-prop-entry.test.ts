import set from 'lodash/set';
import cloneDeep from 'lodash/clonedeep';
import '../fixtures/window';
import { Editor } from '@ali/lowcode-editor-core';
import { Project } from '../../src/project/project';
import { Node } from '../../src/document/node/node';
import { Designer } from '../../src/designer/designer';
import formSchema from '../fixtures/schema/form';
import settingSchema from '../fixtures/schema/setting';
import divMeta from '../fixtures/prototype/div-meta';
import { getIdsFromSchema, getNodeFromSchemaById } from '../utils';

const editor = new Editor();

describe('setting-prop-entry 测试', () => {
  let designer: Designer;
  beforeEach(() => {
    designer = new Designer({ editor });
  });
  afterEach(() => {
    designer._componentMetasMap.clear();
    designer = null;
  });

  describe('node 构造函数生成 settingEntry', () => {
    it('常规方法测试', () => {
      designer.createComponentMeta(divMeta);
      designer.project.open(settingSchema);
      const { currentDocument } = designer.project;
      const divNode = currentDocument?.getNode('div');

      const { settingEntry } = divNode!;
      const behaviorProp = settingEntry.getProp('behavior');
      expect(behaviorProp.getProps()).toBe(settingEntry);
      expect(behaviorProp.props).toBe(settingEntry);
      expect(behaviorProp.getName()).toBe('behavior');
      expect(behaviorProp.getKey()).toBe('behavior');
      expect(behaviorProp.isIgnore()).toBeFalsy;
      behaviorProp.setKey('behavior2');
      expect(behaviorProp.getKey()).toBe('behavior2');
      behaviorProp.setKey('behavior');
      expect(behaviorProp.getValue()).toBe('NORMAL');
      expect(behaviorProp.getMockOrValue()).toBe('NORMAL');

      behaviorProp.setValue('LARGE');
      expect(behaviorProp.getValue()).toBe('LARGE');
      // behaviorProp.setPropValue('behavior', 'SMALL');
      // expect(behaviorProp.getValue()).toBe('SMALL');
      behaviorProp.setValue('NORMAL');
      expect(behaviorProp.getValue()).toBe('NORMAL');

      behaviorProp.clearValue();
      behaviorProp.clearPropValue();
      expect(settingEntry.getProp('behavior').getValue()).toBeUndefined;

      behaviorProp.setValue('LARGE');
      expect(behaviorProp.getValue()).toBe('LARGE');
      behaviorProp.remove();
      expect(settingEntry.getProp('behavior').getValue()).toBeUndefined;

      expect(behaviorProp.getNode()).toBe(divNode);
      expect(behaviorProp.getId().startsWith('entry')).toBeTruthy;
      expect(behaviorProp.designer).toBe(designer);
      expect(behaviorProp.isSingle).toBeTruthy;
      expect(behaviorProp.isMultiple).toBeFalsy;
      expect(behaviorProp.isGroup).toBeFalsy;
      expect(behaviorProp.isSameComponent).toBeTruthy;
      expect(typeof settingEntry.getValue).toBe('function');
      settingEntry.getValue();

      behaviorProp.setExtraPropValue('extraPropA', 'heihei');
      expect(behaviorProp.getExtraPropValue('extraPropA', 'heihei'));
    });

    it.skip('type: group 场景测试', () => {

    });

    it('JSExpression 类型的 prop', () => {
      designer.createComponentMeta(divMeta);
      designer.project.open(settingSchema);
      const { currentDocument } = designer.project;
      const divNode = currentDocument?.getNode('div');

      const { settingEntry } = divNode!;
      const customClassNameProp = settingEntry.getProp('customClassName');
      expect(customClassNameProp.isUseVariable()).toBeTruthy;
      expect(customClassNameProp.useVariable).toBeTruthy;

      expect(customClassNameProp.getValue()).toEqual({
        type: 'JSExpression',
        value: 'getFromSomewhere()'
      });
      expect(customClassNameProp.getMockOrValue()).toBeUndefined;
      expect(customClassNameProp.getVariableValue()).toBe('getFromSomewhere()');
      customClassNameProp.setVariableValue('xxx');
      expect(customClassNameProp.getVariableValue()).toBe('xxx');

      const customClassName2Prop = settingEntry.getProp('customClassName2');
      expect(customClassName2Prop.getMockOrValue()).toEqual({
        hi: 'mock',
      });
    });
  });
});