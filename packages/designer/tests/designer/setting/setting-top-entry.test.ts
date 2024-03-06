import '../../fixtures/window';
import { Editor, Setters, reaction } from '@alilc/lowcode-editor-core';
import { Node } from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import settingSchema from '../../fixtures/schema/setting';
import { SettingTopEntry } from '../../../src/designer/setting/setting-top-entry';
import divMeta from '../../fixtures/component-metadata/div';
import { shellModelFactory } from '../../../../engine/src/modules/shell-model-factory';

const editor = new Editor();

describe('setting-top-entry 测试', () => {
  let designer: Designer;
  beforeEach(() => {
    editor.set('setters', new Setters())
    designer = new Designer({ editor, shellModelFactory });
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

    it('onMetadataChange', () => {
      designer.createComponentMeta(divMeta);
      designer.project.open(settingSchema);
      const { currentDocument } = designer.project;
      const divNode = currentDocument?.getNode('div') as Node;

      const { settingEntry } = divNode!;
      const mockFn = jest.fn();
      settingEntry.componentMeta.onMetadataChange(mockFn);
      settingEntry.componentMeta.refreshMetadata();
      expect(mockFn).toHaveBeenCalled();
    });

    it.skip('setupItems - customView', () => {
      designer.createComponentMeta(divMeta);
      designer.project.open(settingSchema);
      const { currentDocument } = designer.project;
      const divNode = currentDocument?.getNode('div') as Node;

      const { settingEntry } = divNode;
      // 模拟将第一个配置变成 react funcional component
      settingEntry.componentMeta.getMetadata().combined[0].items[0] = props => props.xx;
      settingEntry.setupItems();
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

    it('should notify when _first is set to null', (done) => {
      // 创建一个简单的INode数组用于初始化SettingTopEntry实例
      const nodes = [{ id: '1', propsData: {} }, { id: '2', propsData: {} }];
      const entry = new SettingTopEntry(editor as any, nodes as any);

      // 使用MobX的reaction来观察_first属性的变化
      const dispose = reaction(
        () => entry.first,
        (first) => {
          if (first === null) {
            dispose(); // 清理reaction监听
            done(); // 结束测试
          }
        }
      );

      // 执行purge方法，期望_first被设置为null，触发reaction回调
      entry.purge();
    });

    it('vision 兼容测试', () => {
      designer.createComponentMeta(divMeta);
      designer.project.open(settingSchema);
      const { currentDocument } = designer.project;
      const divNode = currentDocument?.getNode('div');

      // console.log(divNode?.getPropValue('behavior'));
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
