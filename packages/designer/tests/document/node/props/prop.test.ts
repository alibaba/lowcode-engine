import '../../../fixtures/window';
import { set } from '../../../utils';
import { Editor } from '@ali/lowcode-editor-core';
import { Props } from '../../../../src/document/node/props/props';
import { Designer } from '../../../../src/designer/designer';
import { Project } from '../../../../src/project/project';
import { DocumentModel } from '../../../../src/document/document-model';
import { Prop, isProp, isValidArrayIndex } from '../../../../src/document/node/props/prop';
import { TransformStage } from '@ali/lowcode-types';
import { delayObxTick } from '../../../utils';

const mockedOwner = {
  componentName: 'Div',
};

const mockedPropsInst = {
  owner: mockedOwner,
};
mockedPropsInst.props = mockedPropsInst;

describe('Prop 类测试', () => {
  describe('基础类型', () => {
    let boolProp: Prop;
    let strProp: Prop;
    let numProp: Prop;
    let nullProp: Prop;
    let expProp: Prop;
    let slotProp: Prop;
    beforeEach(() => {
      boolProp = new Prop(mockedPropsInst, true, 'boolProp');
      strProp = new Prop(mockedPropsInst, 'haha', 'strProp');
      numProp = new Prop(mockedPropsInst, 1, 'numProp');
      nullProp = new Prop(mockedPropsInst, null, 'nullProp');
      expProp = new Prop(mockedPropsInst, { type: 'JSExpression', value: 'state.haha' }, 'expProp');
      // slotProp = new Prop(mockedPropsInst, { type: 'JSSlot', value: [{ componentName: 'Button' }] }, 'slotProp');
    });
    afterEach(() => {
      boolProp.purge();
      strProp.purge();
      numProp.purge();
      nullProp.purge();
      expProp.purge();
      // slotProp.purge();
    });

    it('consturctor / getProps / getNode', () => {
      expect(boolProp.parent).toBe(mockedPropsInst);
      expect(boolProp.getProps()).toBe(mockedPropsInst);
      expect(boolProp.getNode()).toBe(mockedOwner);
    });

    it('misc', () => {
      expect(boolProp.get('x', false)).toBeNull();
      expect(boolProp.maps).toBeNull();
      expect(boolProp.add()).toBeNull();

      strProp.unset();
      strProp.add(2, true);
      strProp.set(1);

      expect(numProp.set()).toBeNull();
      expect(numProp.has()).toBeFalsy();
    });

    it('getValue / getAsString / setValue', () => {
      expect(strProp.getValue()).toBe('haha');
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
      expect(boolProp.export(TransformStage.Save)).toBe(true);
      expect(strProp.export(TransformStage.Save)).toBe('haha');
      expect(numProp.export(TransformStage.Save)).toBe(1);
      expect(nullProp.export(TransformStage.Save)).toBe('');
      expect(nullProp.export(TransformStage.Serilize)).toBe(null);
      expect(expProp.export(TransformStage.Save)).toEqual({
        type: 'JSExpression',
        value: 'state.haha',
      });

      strProp.unset();
      expect(strProp.getValue()).toBeUndefined();
      expect(strProp.isUnset()).toBeTruthy();
      expect(strProp.export(TransformStage.Save)).toBeUndefined();

      expect(
        new Prop(mockedPropsInst, false, '___condition___').export(TransformStage.Render),
      ).toBeTruthy();
      // console.log(slotProp.export(TransformStage.Render));
    });

    it('compare', () => {
      const newProp = new Prop(mockedPropsInst, 'haha');
      expect(strProp.compare(newProp)).toBe(0);
      expect(strProp.compare(expProp)).toBe(2);

      newProp.unset();
      expect(strProp.compare(newProp)).toBe(2);
      strProp.unset();
      expect(strProp.compare(newProp)).toBe(0);
    });

    it('isVirtual', () => {
      expect(new Prop(mockedPropsInst, 111, '!virtualProp')).toBeTruthy();
    });

    it('purge', () => {
      boolProp.purge();
      expect(boolProp.purged).toBeTruthy();
      boolProp.purge();
    });

    it('迭代器 / map / forEach', () => {
      const mockedFn = jest.fn();
      for (let item of strProp) {
        mockedFn();
      }
      expect(mockedFn).not.toHaveBeenCalled();
      mockedFn.mockClear();

      strProp.forEach(item => {
        mockedFn();
      });
      expect(mockedFn).not.toHaveBeenCalled();
      mockedFn.mockClear();

      strProp.map(item => {
        mockedFn();
      });
      expect(mockedFn).not.toHaveBeenCalled();
      mockedFn.mockClear();
    });
  });

  describe('复杂类型', () => {
    describe('items(map 类型)', () => {
      let prop: Prop;
      beforeEach(() => {
        prop = new Prop(mockedPropsInst, {
          a: 1,
          b: 'str',
          c: true,
          d: {
            type: 'JSExpression',
            value: 'state.a',
          },
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
        expect(prop.size).toBe(5);

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

        const fromStashProp = prop.get('l');
        const fromStashNestedProp = prop.get('m.m1');
        fromStashProp.setValue('fromStashProp');
        fromStashNestedProp?.setValue('fromStashNestedProp')

        await delayObxTick();
        expect(prop.get('l').getValue()).toBe('fromStashProp');
        expect(prop.get('m.m1').getValue()).toBe('fromStashNestedProp');
      });

      it('export', () => {
        // TODO: 需要访问一下才能触发构造 _items
        prop.items;
        expect(prop.export()).toEqual({
          a: 1,
          b: 'str',
          c: true,
          d: {
            type: 'JSExpression',
            value: 'state.a',
          },
          z: {
            z1: 1,
            z2: 'str',
          },
        });
      });

      it('compare', () => {
        const prop1 = new Prop(mockedPropsInst, { a: 1 });
        const prop2 = new Prop(mockedPropsInst, { b: 1 });
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
        const mockedFn = jest.fn();
        for (let item of prop) {
          mockedFn();
        }
        expect(mockedFn).toHaveBeenCalledTimes(5);
        mockedFn.mockClear();

        prop.forEach(item => {
          mockedFn();
        });
        expect(mockedFn).toHaveBeenCalledTimes(5);
        mockedFn.mockClear();

        prop.map(item => {
          mockedFn();
        });
        expect(mockedFn).toHaveBeenCalledTimes(5);
        mockedFn.mockClear();
      });

      it('dispose', () => {
        prop.dispose();

        expect(prop._items).toBeNull();
        expect(prop._maps).toBeNull();
      });
    });

    describe('items(list 类型)', () => {
      let prop: Prop;
      beforeEach(() => {
        prop = new Prop(mockedPropsInst, [1, true, 'haha']);
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
      });

      it('export', () => {
        // 触发构造
        prop.items;
        expect(prop.export()).toEqual([1, true, 'haha']);
      });

      it('compare', () => {
        const prop1 = new Prop(mockedPropsInst, [1]);
        const prop2 = new Prop(mockedPropsInst, [2]);
        const prop3 = new Prop(mockedPropsInst, [1, 2]);
        expect(prop1.compare(prop2)).toBe(1);
        expect(prop1.compare(prop3)).toBe(2);
      });

      it('set', () => {
        prop.set(0, 1);
        expect(prop.get(0, false)?.getValue()).toBe(1);
        // illegal
        // expect(prop.set(5, 1)).toBeNull();
      });
    });
  });

  describe('slotNode / setAsSlot', () => {
    const editor = new Editor();
    const designer = new Designer({ editor });
    const doc = new DocumentModel(designer.project, {
      componentName: 'Page',
      children: [{
        id: 'div',
        componentName: 'Div',
      }],
    });
    const div = doc.getNode('div');

    const slotProp = new Prop(div?.getProps(), {
      type: 'JSSlot',
      value: [{
        componentName: 'Button'
      }],
    });

    expect(slotProp.slotNode?.componentName).toBe('Slot');

    // TODO: id 总是变，不好断言
    expect(slotProp.code.includes('Button')).toBeTruthy();

    console.log(slotProp.export());

    expect(slotProp.export().value[0].componentName).toBe('Button');
    expect(slotProp.export(TransformStage.Serilize).value[0].componentName).toBe('Button');

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
