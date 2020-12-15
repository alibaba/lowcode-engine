import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import '../../fixtures/window';
import { Editor } from '@ali/lowcode-editor-core';
import { Project } from '../../../src/project/project';
import { Node } from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import formSchema from '../../fixtures/schema/form';
import settingSchema from '../../fixtures/schema/setting';
import divMeta from '../../fixtures/component-metadata/div';
import { getIdsFromSchema, getNodeFromSchemaById } from '../../utils';

const editor = new Editor();

describe('setting-top-entry 测试', () => {
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
      expect(settingEntry.getPropValue('behavior')).toBe('NORMAL');
      expect(settingEntry.getProp('behavior').getValue()).toBe('NORMAL');
      settingEntry.setPropValue('behavior', 'LARGE');
      expect(settingEntry.getPropValue('behavior')).toBe('LARGE');
      expect(settingEntry.get('behavior').getValue()).toBe('LARGE');
      settingEntry.getProp('behavior').setValue('SMALL');
      expect(settingEntry.getPropValue('behavior')).toBe('SMALL');
      settingEntry.clearPropValue('behavior');
      expect(settingEntry.getPropValue('behavior')).toBeUndefined();

      expect(settingEntry.getPropValue('fieldId')).toBe('div_k1ow3h1o');
      settingEntry.setPropValue('fieldId', 'div_k1ow3h1o_new');
      expect(settingEntry.getPropValue('fieldId')).toBe('div_k1ow3h1o_new');

      expect(settingEntry.getExtraPropValue('extraPropA')).toBe('haha');
      settingEntry.setExtraPropValue('extraPropA', 'haha2');
      expect(settingEntry.getExtraPropValue('extraPropA')).toBe('haha2');

      settingEntry.mergeProps({
        newPropA: 'haha',
      });
      expect(settingEntry.getPropValue('newPropA')).toBe('haha');
      settingEntry.setProps({
        newPropB: 'haha',
      });
      expect(settingEntry.getPropValue('newPropB')).toBe('haha');
      settingEntry.setValue({
        newPropC: 'haha',
      });
      expect(settingEntry.getPropValue('newPropC')).toBe('haha');

      expect(settingEntry.getPage()).toBe(currentDocument);
      expect(settingEntry.getNode()).toBe(divNode);
      expect(settingEntry.node).toBe(divNode);
      expect(settingEntry.getId()).toBe('div');
      expect(settingEntry.first).toBe(divNode);
      expect(settingEntry.designer).toBe(designer);
      expect(settingEntry.isSingle).toBeTruthy();
      expect(settingEntry.isMultiple).toBeFalsy();
      expect(settingEntry.isSameComponent).toBeTruthy();

      expect(typeof settingEntry.getValue).toBe('function');
      settingEntry.getValue();
    });

    it('清理方法测试', () => {
      designer.createComponentMeta(divMeta);
      designer.project.open(settingSchema);
      const { currentDocument } = designer.project;
      const divNode = currentDocument?.getNode('div');

      const { settingEntry } = divNode!;
      expect(settingEntry.items).toHaveLength(3);
      settingEntry.purge();
      expect(settingEntry.items).toHaveLength(0);
    });

    it('vision 兼容测试', () => {
      designer.createComponentMeta(divMeta);
      designer.project.open(settingSchema);
      const { currentDocument } = designer.project;
      const divNode = currentDocument?.getNode('div');

      console.log(divNode?.getPropValue('behavior'));
      const { settingEntry } = divNode!;

      expect(typeof settingEntry.getChildren).toBe('function');
      expect(typeof settingEntry.getDOMNode).toBe('function');
      expect(typeof settingEntry.getStatus).toBe('function');
      expect(typeof settingEntry.setStatus).toBe('function');
      settingEntry.getStatus();
      settingEntry.setStatus();
      settingEntry.getChildren();
      settingEntry.getDOMNode();
    });

    it('没有 node', () => {
      const create1 = designer.createSettingEntry.bind(designer);
      const create2 = designer.createSettingEntry.bind(designer, []);
      expect(create1).toThrowError('nodes should not be empty');
      expect(create2).toThrowError('nodes should not be empty');
    });
  });

  describe('designer.createSettingEntry 生成 settingEntry（多 node 场景）', () => {
    it('相同类型的 node', () => {
      designer.project.open(settingSchema);
      const { currentDocument } = designer.project;
      const divNode = currentDocument?.getNode('div');
      const divNode2 = currentDocument?.getNode('div2');
      const settingEntry = designer.createSettingEntry([divNode, divNode2]);

      expect(settingEntry.isMultiple).toBeTruthy();
      expect(settingEntry.isSameComponent).toBeTruthy();
      expect(settingEntry.isSingle).toBeFalsy();

      expect(settingEntry.getPropValue('behavior')).toBe('NORMAL');
      expect(settingEntry.getProp('behavior').getValue()).toBe('NORMAL');
      settingEntry.setPropValue('behavior', 'LARGE');
      expect(settingEntry.getPropValue('behavior')).toBe('LARGE');
      expect(settingEntry.get('behavior').getValue()).toBe('LARGE');
      // 多个 node 都被成功设值
      expect(divNode?.getPropValue('behavior')).toBe('LARGE');
      expect(divNode2?.getPropValue('behavior')).toBe('LARGE');

      settingEntry.getProp('behavior').setValue('SMALL');
      expect(settingEntry.getPropValue('behavior')).toBe('SMALL');
      // 多个 node 都被成功设值
      expect(divNode?.getPropValue('behavior')).toBe('SMALL');
      expect(divNode2?.getPropValue('behavior')).toBe('SMALL');

      settingEntry.clearPropValue('behavior');
      expect(settingEntry.getPropValue('behavior')).toBeUndefined();
      // 多个 node 都被成功设值
      expect(divNode?.getPropValue('behavior')).toBeUndefined();
      expect(divNode2?.getPropValue('behavior')).toBeUndefined();

      expect(settingEntry.getPropValue('fieldId')).toBe('div_k1ow3h1o');
      settingEntry.setPropValue('fieldId', 'div_k1ow3h1o_new');
      expect(settingEntry.getPropValue('fieldId')).toBe('div_k1ow3h1o_new');

      expect(settingEntry.getExtraPropValue('extraPropA')).toBe('haha');
      settingEntry.setExtraPropValue('extraPropA', 'haha2');
      expect(settingEntry.getExtraPropValue('extraPropA')).toBe('haha2');
    });

    it('不同类型的 node', () => {
      designer.project.open(settingSchema);
      const { currentDocument } = designer.project;
      const divNode = currentDocument?.getNode('div');
      const testNode = currentDocument?.getNode('test');
      const settingEntry = designer.createSettingEntry([divNode, testNode]);

      expect(settingEntry.isMultiple).toBeTruthy();
      expect(settingEntry.isSameComponent).toBeFalsy();
      expect(settingEntry.isSingle).toBeFalsy();

      // 不同类型的 node 场景下，理论上从页面上已没有修改属性的方法调用，所以此处不再断言各设值方法
      // 思考：假如以后面向其他场景，比如用户用 API 强行调用，是否需要做健壮性保护？
    });
  });
});