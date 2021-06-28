// @ts-nocheck
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import '../../fixtures/window';
import { Editor } from '@ali/lowcode-editor-core';
import { Project } from '../../../src/project/project';
import { SettingTopEntry } from '../../../src/designer/setting/setting-top-entry';
import { SettingPropEntry } from '../../../src/designer/setting/setting-prop-entry';
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

  describe('纯粹的 UnitTest', () => {
    let mockNode: Node;
    let mockTopEntry: SettingTopEntry;
    beforeEach(() => {
      mockNode = new Node(designer.currentDocument, {
        componentName: 'Button',
        props: {
          a: 'str',
          b: 222,
          obj: {
            x: 1,
          },
          jse: {
            type: 'JSExpression',
            value: 'state.a',
            mock: 111,
          }
        },
      });
      mockTopEntry = new SettingTopEntry(editor, [mockNode]);
    });
    afterEach(() => {
      mockNode = null;
      mockTopEntry = null;
    });

    it('常规方法', () => {
      // type: group 类型
      const prop = new SettingPropEntry(mockTopEntry, 'xGroup', 'group');
      expect(prop.setKey('xxx')).toBeUndefined();
      expect(prop.remove()).toBeUndefined();

      const prop2 = new SettingPropEntry(mockTopEntry, '#xGroup');
      expect(prop2.setKey('xxx')).toBeUndefined();
      expect(prop2.remove()).toBeUndefined();

      expect(prop.getVariableValue()).toBe('');
    });

    it('setValue / getValue / onValueChange', () => {
      // 获取已有的 prop
      const prop1 = mockTopEntry.getProp('a');
      prop1.extraProps = {
        getValue: (prop, val) => `prefix ${val}`,
        setValue: (prop, val) => { prop.setValue(`modified ${val}`, false, false, { disableMutator: true }) },
        defaultValue: 'default',
      };

      expect(prop1.getDefaultValue()).toBe('default');
      expect(prop1.getValue()).toBe('prefix str');

      // disableMutator: true
      prop1.setValue('bbb', false, false, { disableMutator: true });
      expect(prop1.getValue()).toBe('prefix bbb');

      // disableMutator: false
      prop1.setValue('bbb');
      expect(prop1.getValue()).toBe('prefix modified bbb');

      const mockFn3 = jest.fn();
      const prop2 = mockTopEntry.getProp('obj');
      const prop3 = prop2.get('x');
      const offFn = prop3.onValueChange(mockFn3);
      expect(prop3.getValue()).toBe(1);
      prop3.setValue(2);
      expect(mockFn3).toHaveBeenCalled();

      offFn();
      prop3.setValue(3);
      mockFn3.mockClear();
      expect(mockFn3).toHaveBeenCalledTimes(0);

      const prop4 = mockTopEntry.getProp('b');
      prop4.extraProps = {
        getValue: () => { throw 'error'; },
      };
      expect(prop4.getValue()).toBe(222);
    });

    it('clearValue', () => {
      const prop1 = mockTopEntry.getProp('a');
      prop1.clearValue();
      expect(prop1.getValue()).toBeUndefined();

      const mockFn = jest.fn();
      prop1.extraProps = {
        setValue: mockFn,
      };
      prop1.clearValue();
      expect(mockFn).toHaveBeenCalled();
    });

    it('getVariableValue/ setUseVariable / isUseVariable / getMockOrValue', () => {
      const prop1 = mockTopEntry.getProp('jse');

      expect(prop1.isUseVariable()).toBeTruthy();
      expect(prop1.useVariable).toBeTruthy();

      expect(prop1.getMockOrValue()).toEqual(111);
      expect(prop1.getVariableValue()).toEqual('state.a');

      prop1.setUseVariable(false);
      expect(prop1.getValue()).toEqual(111);
      prop1.setUseVariable(true);
      expect(prop1.getValue()).toEqual({
        type: 'JSExpression',
        value: '',
        mock: 111,
      });
      prop1.setUseVariable(true);
    });
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

    it.skip('type: group 场景测试', () => {});

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
        value: 'getFromSomewhere()',
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
