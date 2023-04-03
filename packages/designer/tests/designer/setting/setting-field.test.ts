// @ts-nocheck
import '../../fixtures/window';
import {
  Editor,
  Setters as InnerSetters,
} from '@alilc/lowcode-editor-core';
import {
  Setters,
} from '@alilc/lowcode-shell';
import { SettingTopEntry } from '../../../src/designer/setting/setting-top-entry';
import { SettingField } from '../../../src/designer/setting/setting-field';
import { Node } from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import settingSchema from '../../fixtures/schema/setting';
import buttonMeta from '../../fixtures/component-metadata/button';
import { DocumentModel } from 'designer/src/document';
import { delayObxTick } from '../../utils';
import { shellModelFactory } from '../../../../engine/src/modules/shell-model-factory';

const editor = new Editor();

describe('setting-field 测试', () => {
  let designer: Designer;
  let doc: DocumentModel;
  let setters: Setters;
  beforeEach(() => {
    setters = new InnerSetters();
    editor.set('setters', setters);
    designer = new Designer({ editor, shellModelFactory });
    designer.createComponentMeta(buttonMeta);
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
          // a: 'str',
          // b: 222,
          // obj: {
          //   x: 1,
          // },
          // jse: {
          //   type: 'JSExpression',
          //   value: 'state.a',
          //   mock: 111,
          // }
        },
      });
      // mockTopEntry = new SettingTopEntry(editor, [mockNode]);
    });
    afterEach(() => {
      mockNode = null;
      mockTopEntry = null;
    });

    it('常规方法', () => {
      // 普通 field
      const settingEntry = mockNode.settingEntry;
      const field = settingEntry.get('behavior');
      expect(field.title).toBe('默认状态');
      expect(field.expanded).toBeTruthy();
      field.setExpanded(false);
      expect(field.expanded).toBeFalsy();
      expect(field.config).toMatchSnapshot();
      expect(field.getConfig()).toMatchSnapshot();
      expect(field.getConfig('extraProps')).toEqual({
        display: 'inline',
        defaultValue: 'NORMAL',
      });
      expect(field.items).toHaveLength(0);
      expect(field.getItems()).toHaveLength(0);
      expect(field.getItems(x => x)).toHaveLength(0);

      expect(field.setter.componentName).toBe('MixedSetter');
      field.purge();
      expect(field.items).toHaveLength(0);

      const subField = field.createField({
        name: 'sub',
        title: 'sub',
      });
      subField.setValue({
        type: 'JSExpression',
        value: 'state.a',
        mock: 'haha',
      });
      subField.setHotValue('heihei');
      expect(subField.getHotValue('heihei'));
      expect(subField.getValue().mock).toBe('heihei');

      // 不存在的 field
      const nonExistingField = mockNode.settingEntry.get('non-exsiting');
      expect(nonExistingField.setter).toBeNull();

      // group 类型的 field
      const groupField = settingEntry.get('groupkgzzeo41');
      expect(groupField.items).toEqual([]);

      // 有子节点的 field
      const objField = settingEntry.get('obj');
      expect(objField.items).toHaveLength(3);
      expect(objField.getItems()).toHaveLength(3);
      expect(objField.getItems(x => x.name === 'a')).toHaveLength(1);
      objField.purge();
      expect(objField.items).toHaveLength(0);
      const objAField = settingEntry.get('obj.a');
      expect(objAField.setter).toBe('StringSetter');
    });

    it('setValue / getValue / setHotValue / getHotValue', () => {
      // 获取已有的 prop
      const settingEntry = mockNode.settingEntry as SettingTopEntry;
      const field = settingEntry.get('behavior');

      // 会读取 extraProps.defaultValue
      expect(field.getHotValue()).toBe('NORMAL');

      field.setValue('HIDDEN');
      expect(field.getValue()).toBe('HIDDEN');
      expect(field.getHotValue()).toBe('HIDDEN');

      field.setHotValue('DISABLED');
      expect(field.getHotValue()).toBe('DISABLED');

      field.setHotValue('NORMAL', { fromSetHotValue: true });
      expect(field.getHotValue()).toBe('NORMAL');

      field.setValue('HIDDEN', true);
      expect(field.getHotValue()).toBe('HIDDEN');

      // dirty fix list setter
      field.setHotValue([{ __sid__: 1 }]);

      // 数组的 field
      const arrField = settingEntry.get('arr');
      const subArrField = arrField.createField({
        name: 0,
        title: 'sub',
      });
      const subArrField02 = arrField.createField({
        name: 1,
        title: 'sub',
      });
      const subArrField03 = arrField.createField({
        name: '2',
        title: 'sub',
      });
      subArrField.setValue({name: '1'});
      expect(subArrField.path).toEqual(['arr', 0]);
      expect(subArrField02.path).toEqual(['arr', 1]);
      subArrField02.setValue({name: '2'});
      expect(subArrField.getValue()).toEqual({name: '1'});
      expect(arrField.getHotValue()).toEqual([{name: '1'}, {name: '2'}]);
      subArrField.clearValue();
      expect(subArrField.getValue()).toBeUndefined();
      expect(arrField.getHotValue()).toEqual([undefined, {name: '2'}]);
      subArrField03.setValue({name: '3'});
      expect(arrField.getHotValue()).toEqual([undefined, {name: '2'}, {name: '3'}]);
    });

    it('js expression setValue / setHotValue', () => {
      const settingEntry = mockNode.settingEntry;
      const field = settingEntry.get('behavior');

      const subField = field.createField({
        name: 'sub',
        title: 'sub',
      });
      subField.setValue({
        type: 'JSExpression',
        value: 'state.a',
        mock: 'haha',
      });

      subField.setHotValue({
        type: 'JSExpression',
        value: 'state.b',
      });

      expect(subField.getValue()).toEqual({
        type: 'JSExpression',
        value: 'state.b',
        mock: 'haha',
      });

      subField.setHotValue('mock02');

      expect(subField.getValue()).toEqual({
        type: 'JSExpression',
        value: 'state.b',
        mock: 'mock02',
      });
    });

    it('onEffect', async () => {
      const settingEntry = mockNode.settingEntry as SettingTopEntry;
      const field = settingEntry.get('behavior');

      const mockFn = jest.fn();

      field.onEffect(mockFn);

      field.setValue('DISABLED');

      await delayObxTick();

      expect(mockFn).toHaveBeenCalled();
    });

    it('autorun', async () => {
      const settingEntry = mockNode.settingEntry as SettingTopEntry;
      const arrField = settingEntry.get('columns');
      const subArrField = arrField.createField({
        name: 0,
        title: 'sub',
      });
      const objSubField = subArrField.createField({
        name: 'objSub',
        title: 'objSub',
      });
      const mockFnArrField = jest.fn();
      const mockFnSubArrField = jest.fn();
      const mockFnObjSubField = jest.fn();

      arrField.setValue([{ objSub: "subMock0.Index.0" }]);
      // 这里需要 setValue 两遍，触发 prop 的 purge 方法，使 purged 为 true，之后的 purge 方法不会正常执行，prop 才能正常缓存，autorun 才能正常执行
      // TODO: 该机制后续得研究一下，再确定是否要修改
      arrField.setValue([{ objSub: "subMock0.Index.0" }]);

      arrField.onEffect(() => {
        mockFnArrField(arrField.getValue());
      });
      arrField.onEffect(() => {
        mockFnSubArrField(subArrField.getValue());
      });
      arrField.onEffect(() => {
        mockFnObjSubField(objSubField.getValue());
      });

      await delayObxTick();

      expect(mockFnObjSubField).toHaveBeenCalledWith('subMock0.Index.0');
      expect(mockFnSubArrField).toHaveBeenCalledWith({ objSub: "subMock0.Index.0" });
      expect(mockFnArrField).toHaveBeenCalledWith([{ objSub: "subMock0.Index.0" }]);

      arrField.setValue([{ objSub: "subMock0.Index.1" }]);

      await delayObxTick();

      expect(mockFnObjSubField).toHaveBeenCalledWith('subMock0.Index.1');
      expect(mockFnSubArrField).toHaveBeenCalledWith({ objSub: "subMock0.Index.1" });
      expect(mockFnArrField).toHaveBeenCalledWith([{ objSub: "subMock0.Index.1" }]);

      subArrField.setValue({ objSub: "subMock0.Index.2" });

      await delayObxTick();

      expect(mockFnObjSubField).toHaveBeenCalledWith('subMock0.Index.2');
      expect(mockFnSubArrField).toHaveBeenCalledWith({ objSub: "subMock0.Index.2" });
      expect(mockFnArrField).toHaveBeenCalledWith([{ objSub: "subMock0.Index.2" }]);

      objSubField.setValue('subMock0.Index.3');

      await delayObxTick();

      expect(mockFnObjSubField).toHaveBeenCalledWith('subMock0.Index.3');
      expect(mockFnSubArrField).toHaveBeenCalledWith({ objSub: "subMock0.Index.3" });
      expect(mockFnArrField).toHaveBeenCalledWith([{ objSub: "subMock0.Index.3" }]);
    })
  });
});
