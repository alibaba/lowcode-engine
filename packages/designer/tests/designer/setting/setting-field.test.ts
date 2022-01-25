// @ts-nocheck
import '../../fixtures/window';
import { Editor } from '@alilc/lowcode-editor-core';
import { Project } from '../../../src/project/project';
import { SettingTopEntry } from '../../../src/designer/setting/setting-top-entry';
import { SettingField } from '../../../src/designer/setting/setting-field';
import { Node } from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import settingSchema from '../../fixtures/schema/setting';
import buttonMeta from '../../fixtures/component-metadata/button';
import { DocumentModel } from 'designer/src/document';
import { delayObxTick } from '../../utils';

const editor = new Editor();

describe('setting-field 测试', () => {
  let designer: Designer;
  let doc: DocumentModel;
  beforeEach(() => {
    designer = new Designer({ editor });
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
      const settingEntry = mockNode.settingEntry as SettingTopEntry;
      const field = settingEntry.get('behavior') as SettingField;
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
      const groupField = settingEntry.get('groupkgzzeo41') as SettingField;
      expect(groupField.items).toBeUndefined();

      // 有子节点的 field
      const objField = settingEntry.get('obj') as SettingField;
      expect(objField.items).toHaveLength(3);
      expect(objField.getItems()).toHaveLength(3);
      expect(objField.getItems(x => x.name === 'a')).toHaveLength(1);
      objField.purge();
      expect(objField.items).toHaveLength(0);
      const objAField = settingEntry.get('obj.a') as SettingField;
      expect(objAField.setter).toBe('StringSetter');
    });

    it('setValue / getValue / setHotValue / getHotValue', () => {
      // 获取已有的 prop
      const settingEntry = mockNode.settingEntry as SettingTopEntry;
      const field = settingEntry.get('behavior') as SettingField;

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
    });

    it('onEffect', async () => {
      const settingEntry = mockNode.settingEntry as SettingTopEntry;
      const field = settingEntry.get('behavior') as SettingField;

      const mockFn = jest.fn();

      field.onEffect(mockFn);

      field.setValue('DISABLED');

      await delayObxTick();

      expect(mockFn).toHaveBeenCalled();
    });
  });
});
