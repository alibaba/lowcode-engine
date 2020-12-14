import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import '../../fixtures/window';
import { Editor } from '@ali/lowcode-editor-core';
import { Project } from '../../../src/project/project';
import { Node } from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import formSchema from '../../../fixtures/schema/form';
import settingSchema from '../../fixtures/schema/setting';
import divMeta from '../../fixtures/component-metadata/div';
import { getIdsFromSchema, getNodeFromSchemaById } from '../../utils';
import { DocumentModel } from 'designer/src/document';

const editor = new Editor();

describe('setting-prop-entry 测试', () => {
  let designer: Designer;
  let doc: DocumentModel;
  beforeEach(() => {
    designer = new Designer({ editor });
    designer.createComponentMeta(divMeta);
    doc = designer.project.open(settingSchema);
  });
  afterEach(() => {
    designer._componentMetasMap.clear();
    designer = null;
    doc.purge();
    doc = null;
  });

  describe('node 构造函数生成 settingEntry', () => {
    it('常规方法测试', () => {
      const divNode = doc?.getNode('div');

      const { settingEntry } = divNode!;
      const behaviorProp = settingEntry.getProp('behavior');
      expect(behaviorProp.getProps()).toBe(settingEntry);
      expect(behaviorProp.props).toBe(settingEntry);
      expect(behaviorProp.getName()).toBe('behavior');
      expect(behaviorProp.getKey()).toBe('behavior');
      expect(behaviorProp.isIgnore()).toBeFalsy();
      behaviorProp.setKey('behavior2');
      expect(behaviorProp.getKey()).toBe('behavior2');
      behaviorProp.setKey('behavior');

      expect(behaviorProp.getNode()).toBe(divNode);
      expect(behaviorProp.getId().startsWith('entry')).toBeTruthy();
      expect(behaviorProp.designer).toBe(designer);
      expect(behaviorProp.isSingle).toBeTruthy();
      expect(behaviorProp.isMultiple).toBeFalsy();
      expect(behaviorProp.isGroup).toBeFalsy();
      expect(behaviorProp.isSameComponent).toBeTruthy();
      expect(typeof settingEntry.getValue).toBe('function');
      settingEntry.getValue();

      behaviorProp.setExtraPropValue('extraPropA', 'heihei');
      expect(behaviorProp.getExtraPropValue('extraPropA', 'heihei'));
    });

    it('setValue / getValue', () => {
      const divNode = doc?.getNode('div');

      const { settingEntry } = divNode!;
      const behaviorProp = settingEntry.getProp('behavior');
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
      expect(behaviorProp.getValue()).toBeUndefined();

      behaviorProp.setValue('LARGE');
      expect(behaviorProp.getValue()).toBe('LARGE');
      behaviorProp.remove();
      expect(divNode?.getProp('behavior').getValue()).toBeUndefined();
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
      expect(customClassNameProp.isUseVariable()).toBeTruthy();
      expect(customClassNameProp.useVariable).toBeTruthy();

      expect(customClassNameProp.getValue()).toEqual({
        type: 'JSExpression',
        value: 'getFromSomewhere()'
      });
      expect(customClassNameProp.getMockOrValue()).toBeUndefined();
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