import '../../../fixtures/window';
import { Editor, engineConfig } from '@alilc/lowcode-editor-core';
import { Designer } from '../../../../src/designer/designer';
import { DocumentModel } from '../../../../src/document/document-model';
import { Prop, isProp, isValidArrayIndex } from '../../../../src/document/node/props/prop';
import { IPublicEnumTransformStage } from '@alilc/lowcode-types';
import { shellModelFactory } from '../../../../../engine/src/modules/shell-model-factory';

const slotNodeImportMockFn = jest.fn();
const slotNodeRemoveMockFn = jest.fn();
const mockOwner = {
  componentName: 'Div',
  addSlot() {},
  document: {
    createNode(schema) {
      return {
        ...schema,
        addSlot() {},
        internalSetSlotFor() {},
        import: slotNodeImportMockFn,
        export() {
          return schema;
        },
        remove: slotNodeRemoveMockFn,
      };
    },
    designer: {},
  },
  isInited: true,
};

const mockPropsInst = {
  owner: mockOwner,
};
mockPropsInst.props = mockPropsInst;

describe('Prop 类测试', () => {
  describe('基础类型', () => {
    let boolProp: Prop;
    let strProp: Prop;
    let numProp: Prop;
    let nullProp: Prop;
    let expProp: Prop;
    let slotProp: Prop;
    beforeEach(() => {
      boolProp = new Prop(mockPropsInst, true, 'boolProp');
      strProp = new Prop(mockPropsInst, 'haha', 'strProp');
      numProp = new Prop(mockPropsInst, 1, 'numProp');
      nullProp = new Prop(mockPropsInst, null, 'nullProp');
      expProp = new Prop(mockPropsInst, { type: 'JSExpression', value: 'state.haha' }, 'expProp');
      slotProp = new Prop(
        mockPropsInst,
        {
          type: 'JSSlot',
          title: '测试 slot',
          name: 'testSlot',
          params: { a: 1 },
          value: [{ componentName: 'Button' }],
        },
        'slotProp',
      );
      slotNodeImportMockFn.mockClear();
      slotNodeRemoveMockFn.mockClear();
    });
    afterEach(() => {
      boolProp.purge();
      strProp.purge();
      numProp.purge();
      nullProp.purge();
      expProp.purge();
      slotProp.purge();
    });

    it('consturctor / getProps / getNode', () => {
      expect(boolProp.parent).toBe(mockPropsInst);
      expect(boolProp.getProps()).toBe(mockPropsInst);
      expect(boolProp.getNode()).toBe(mockOwner);
    });

    it('misc', () => {
      expect(boolProp.get('x', false)).toBeNull();
      expect(boolProp.maps).toBeNull();
      expect(boolProp.add()).toBeNull();

      strProp.unset();
      strProp.add(2, true);
      strProp.set(0);

      expect(numProp.set()).toBeNull();
      expect(numProp.has()).toBeFalsy();
      expect(numProp.path).toEqual(['numProp']);
    });

    it('getValue / getAsString / setValue', () => {
      expect(strProp.getValue()).toBe('haha');
      strProp.setValue('heihei');
      strProp.setValue('heihei');
      expect(strProp.getValue()).toBe('heihei');
      expect(strProp.getAsString()).toBe('heihei');

      strProp.unset();
      expect(strProp.getValue()).toBeUndefined();
    });

    it('code', () => {
      expect(expProp.code).toBe('state.haha');
      expect(boolProp.code).toBe('true');
      expect(strProp.code).toBe('"haha"');

      expProp.code = 'state.heihei';
      expect(expProp.code).toBe('state.heihei');
      expect(expProp.getValue()).toEqual({
        type: 'JSExpression',
        value: 'state.heihei',
      });

      boolProp.code = 'false';
      expect(boolProp.code).toBe('false');
      expect(boolProp.getValue()).toBe(false);

      strProp.code = '"heihei"';
      expect(strProp.code).toBe('"heihei"');
      expect(strProp.getValue()).toBe('heihei');

      // TODO: 不确定为什么会有这个分支
      strProp.code = 'state.a';
      expect(strProp.code).toBe('state.a');
      expect(strProp.getValue()).toEqual({
        type: 'JSExpression',
        value: 'state.a',
        mock: 'heihei',
      });
    });

    it('export', () => {
      expect(boolProp.export(IPublicEnumTransformStage.Save)).toBe(true);
      expect(strProp.export(IPublicEnumTransformStage.Save)).toBe('haha');
      expect(numProp.export(IPublicEnumTransformStage.Save)).toBe(1);
      expect(nullProp.export(IPublicEnumTransformStage.Save)).toBe('');
      expect(nullProp.export(IPublicEnumTransformStage.Serilize)).toBe(null);
      expect(expProp.export(IPublicEnumTransformStage.Save)).toEqual({
        type: 'JSExpression',
        value: 'state.haha',
      });

      strProp.unset();
      expect(strProp.getValue()).toBeUndefined();
      expect(strProp.isUnset()).toBeTruthy();
      expect(strProp.export(IPublicEnumTransformStage.Save)).toBeUndefined();

      expect(
        new Prop(mockPropsInst, false, '___condition___').export(IPublicEnumTransformStage.Render),
      ).toBeTruthy();
      engineConfig.set('enableCondition', true);
      expect(
        new Prop(mockPropsInst, false, '___condition___').export(IPublicEnumTransformStage.Render),
      ).toBeFalsy();
      expect(slotProp.export(IPublicEnumTransformStage.Render)).toEqual({
        type: 'JSSlot',
        params: { a: 1 },
        value: {
          componentName: 'Slot',
          title: '测试 slot',
          name: 'testSlot',
          params: { a: 1 },
          children: [{ componentName: 'Button' }],
        },
      });
      expect(slotProp.export(IPublicEnumTransformStage.Save)).toEqual({
        type: 'JSSlot',
        params: { a: 1 },
        value: [{ componentName: 'Button' }],
        title: '测试 slot',
        name: 'testSlot',
      });
    });

    it('compare', () => {
      const newProp = new Prop(mockPropsInst, 'haha');
      const newProp2 = new Prop(mockPropsInst, { a: 1 });
      expect(strProp.compare(newProp)).toBe(0);
      expect(strProp.compare(expProp)).toBe(2);

      newProp.unset();
      expect(strProp.compare(newProp)).toBe(2);
      strProp.unset();
      expect(strProp.compare(newProp)).toBe(0);
      expect(strProp.compare(newProp2)).toBe(2);
    });

    it('isVirtual', () => {
      expect(new Prop(mockPropsInst, 111, '!virtualProp')).toBeTruthy();
    });

    it('purge', () => {
      boolProp.purge();
      expect(boolProp.purged).toBeTruthy();
      boolProp.purge();
    });

    it('slot', () => {
      // 更新 slot
      slotProp.setValue({
        type: 'JSSlot',
        value: [
          {
            componentName: 'Form',
          },
        ],
      });
      expect(slotNodeImportMockFn).toBeCalled();

      // 节点类型转换
      slotProp.setValue(true);
      expect(slotNodeRemoveMockFn).toBeCalled();
    });

    it('迭代器 / map / forEach', () => {
      const mockFn = jest.fn();
      for (const item of strProp) {
        mockFn();
      }
      expect(mockFn).not.toHaveBeenCalled();
      mockFn.mockClear();

      strProp.forEach((item) => {
        mockFn();
      });
      expect(mockFn).not.toHaveBeenCalled();
      mockFn.mockClear();

      strProp.map((item) => {
        return mockFn();
      });
      expect(mockFn).not.toHaveBeenCalled();
      mockFn.mockClear();
    });
  });

  describe('复杂类型', () => {
    describe('items(map 类型)', () => {
      let prop: Prop;
      beforeEach(() => {
        prop = new Prop(mockPropsInst, {
          a: 1,
          b: 'str',
          c: true,
          d: {
            type: 'JSExpression',
            value: 'state.a',
          },
          emptyArr: [],
          emptyObj: {},
          z: {
            z1: 1,
            z2: 'str',
          },
        });
      });
      afterEach(() => {
        prop.purge();
      });

      it('items / get', async () => {
        expect(prop.size).toBe(7);

        expect(prop.get('a').getValue()).toBe(1);
        expect(prop.get('b').getValue()).toBe('str');
        expect(prop.get('c').getValue()).toBe(true);
        expect(prop.get('d').getValue()).toEqual({ type: 'JSExpression', value: 'state.a' });
        expect(prop.get('z').getValue()).toEqual({
          z1: 1,
          z2: 'str',
        });

        expect(prop.getPropValue('a')).toBe(1);
        prop.setPropValue('a', 2);
        expect(prop.getPropValue('a')).toBe(2);
        prop.clearPropValue('a');
        expect(prop.get('a')?.isUnset()).toBeTruthy();

        expect(prop.get('z.z1')?.getValue()).toBe(1);
        expect(prop.get('z.z2')?.getValue()).toBe('str');

        const newlyCreatedProp = prop.get('l', true);
        const newlyCreatedNestedProp = prop.get('m.m1', true);
        newlyCreatedProp.setValue('newlyCreatedProp');
        newlyCreatedNestedProp?.setValue('newlyCreatedNestedProp');

        expect(prop.get('l').getValue()).toBe('newlyCreatedProp');
        expect(prop.get('m.m1').getValue()).toBe('newlyCreatedNestedProp');

        const newlyCreatedNestedProp2 = prop.get('m.m2', true);
        // .m2 的值为 undefined，导出时将会被移除
        expect(prop.get('m').getValue()).toEqual({ m1: 'newlyCreatedNestedProp' });

        // 对于空值的 list / map 类型，_items 应该为 null
        expect(prop.get('emptyArr')._items).toBeNull();
        expect(prop.get('emptyObj')._items).toBeNull();
      });

      it('export', () => {
        expect(prop.export()).toEqual({
          a: 1,
          b: 'str',
          c: true,
          d: {
            type: 'JSExpression',
            value: 'state.a',
          },
          emptyArr: [],
          emptyObj: {},
          z: {
            z1: 1,
            z2: 'str',
          },
        });
      });

      it('compare', () => {
        const prop1 = new Prop(mockPropsInst, { a: 1 });
        const prop2 = new Prop(mockPropsInst, { b: 1 });
        expect(prop1.compare(prop2)).toBe(1);
      });

      it('has / add / delete / deleteKey / remove', () => {
        expect(prop.has('a')).toBeTruthy();
        expect(prop.has('b')).toBeTruthy();
        expect(prop.has('c')).toBeTruthy();
        expect(prop.has('d')).toBeTruthy();
        expect(prop.has('z')).toBeTruthy();
        expect(prop.has('y')).toBeFalsy();

        // 触发一下内部 maps 构造
        prop.items;
        expect(prop.has('z')).toBeTruthy();

        expect(prop.add(1)).toBeNull();

        prop.deleteKey('c');
        expect(prop.get('c', false)).toBeNull();
        prop.delete(prop.get('b'));
        expect(prop.get('b', false)).toBeNull();

        prop.get('d')?.remove();
        expect(prop.get('d', false)).toBeNull();
      });

      it('set', () => {
        prop.set('e', 1);
        expect(prop.get('e', false)?.getValue()).toBe(1);
        prop.set('a', 5);
        expect(prop.get('a', false)?.getValue()).toBe(5);
      });

      it('迭代器 / map / forEach', () => {
        const mockFn = jest.fn();
        for (const item of prop) {
          mockFn();
        }
        expect(mockFn).toHaveBeenCalledTimes(7);
        mockFn.mockClear();

        prop.forEach((item) => {
          mockFn();
        });
        expect(mockFn).toHaveBeenCalledTimes(7);
        mockFn.mockClear();

        prop.map((item) => {
          return mockFn();
        });
        expect(mockFn).toHaveBeenCalledTimes(7);
        mockFn.mockClear();
      });

      it('dispose', () => {
        prop.items;
        prop.dispose();

        expect(prop._items).toBeNull();
        expect(prop._maps).toBeNull();
      });
    });

    describe('items(list 类型)', () => {
      let prop: Prop;
      beforeEach(() => {
        prop = new Prop(mockPropsInst, [1, true, 'haha']);
      });
      afterEach(() => {
        prop.purge();
      });

      it('items / get', () => {
        expect(prop.size).toBe(3);

        expect(prop.get(0).getValue()).toBe(1);
        expect(prop.get(1).getValue()).toBe(true);
        expect(prop.get(2).getValue()).toBe('haha');

        expect(prop.getAsString()).toBe('');

        prop.unset();
        prop.set(0, true);
        expect(prop.set('x', 'invalid')).toBeNull();
        expect(prop.get(0).getValue()).toBeTruthy();

        // map / list 级联测试
        prop.get('loopArgs.0', true).setValue('newItem');;
        expect(prop.get('loopArgs.0').getValue()).toBe('newItem');
      });

      it('export', () => {
        expect(prop.export()).toEqual([1, true, 'haha']);
        // 触发构造
        prop.items;
        expect(prop.export()).toEqual([1, true, 'haha']);
      });

      it('compare', () => {
        const prop1 = new Prop(mockPropsInst, [1]);
        const prop2 = new Prop(mockPropsInst, [2]);
        const prop3 = new Prop(mockPropsInst, [1, 2]);
        expect(prop1.compare(prop2)).toBe(1);
        expect(prop1.compare(prop3)).toBe(2);
      });

      it('set', () => {
        prop.set(0, 1);
        expect(prop.get(0, false)?.getValue()).toBe(1);
        // illegal
        // expect(prop.set(5, 1)).toBeNull();
      });

      it('should return undefined when all items are undefined', () => {
        prop = new Prop(mockPropsInst, [undefined, undefined], '___loopArgs___');
        expect(prop.getValue()).toEqual([undefined, undefined]);
      });

      it('迭代器 / map / forEach', () => {
        const listProp = new Prop(mockPropsInst, [1, 2]);
        const mockFn = jest.fn();
        for (const item of listProp) {
          mockFn();
        }
        expect(mockFn).toHaveBeenCalledTimes(2);
        mockFn.mockClear();

        listProp.forEach((item) => {
          mockFn();
        });
        expect(mockFn).toHaveBeenCalledTimes(2);
        mockFn.mockClear();

        listProp.map((item) => {
          return mockFn();
        });
        expect(mockFn).toHaveBeenCalledTimes(2);
        mockFn.mockClear();
      });
    });
  });

  describe('slotNode / setAsSlot', () => {
    const editor = new Editor();
    const designer = new Designer({ editor, shellModelFactory });
    const doc = new DocumentModel(designer.project, {
      componentName: 'Page',
      children: [
        {
          id: 'div',
          componentName: 'Div',
        },
      ],
    });
    const div = doc.getNode('div');

    const slotProp = new Prop(div?.getProps(), {
      type: 'JSSlot',
      value: [
        {
          componentName: 'Button',
        },
      ],
    });

    expect(slotProp.slotNode?.componentName).toBe('Slot');

    // TODO: id 总是变，不好断言
    expect(slotProp.code.includes('Button')).toBeTruthy();

    slotProp.export();

    expect(slotProp.export().value[0].componentName).toBe('Button');
    expect(slotProp.export(IPublicEnumTransformStage.Serilize).value[0].componentName).toBe('Button');

    slotProp.purge();
    expect(slotProp.purged).toBeTruthy();
    slotProp.dispose();
  });

  describe('slotNode-value / setAsSlot', () => {
    const editor = new Editor();
    const designer = new Designer({ editor, shellModelFactory });
    const doc = new DocumentModel(designer.project, {
      componentName: 'Page',
      children: [
        {
          id: 'div',
          componentName: 'Div',
        },
      ],
    });
    const div = doc.getNode('div');

    const slotProp = new Prop(div?.getProps(), {
      type: 'JSSlot',
      value: {
        componentName: 'Slot',
        id: 'node_oclei5rv2e2',
        props: {
          slotName: "content",
          slotTitle: "主内容"
        },
        children: [
          {
            componentName: 'Button',
          }
        ]
      },
    });

    expect(slotProp.slotNode?.componentName).toBe('Slot');

    expect(slotProp.slotNode?.title).toBe('主内容');
    expect(slotProp.slotNode?.getExtraProp('name')?.getValue()).toBe('content');
    expect(slotProp.slotNode?.export()?.id).toBe('node_oclei5rv2e2');

    slotProp.export();

    // Save
    expect(slotProp.export()?.value[0].componentName).toBe('Button');
    expect(slotProp.export()?.title).toBe('主内容');
    expect(slotProp.export()?.name).toBe('content');

    // Render
    expect(slotProp.export(IPublicEnumTransformStage.Render)?.value.children[0].componentName).toBe('Button');
    expect(slotProp.export(IPublicEnumTransformStage.Render)?.value.componentName).toBe('Slot');

    slotProp.purge();
    expect(slotProp.purged).toBeTruthy();
    slotProp.dispose();
  });
});

describe('其他导出函数', () => {
  it('isProp', () => {
    expect(isProp({ isProp: true })).toBeTruthy();
  });

  it('isValidArrayIndex', () => {
    expect(isValidArrayIndex('1')).toBeTruthy();
    expect(isValidArrayIndex('1', 2)).toBeTruthy();
    expect(isValidArrayIndex('2', 1)).toBeFalsy();
  });
});
