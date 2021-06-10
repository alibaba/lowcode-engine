
import '../../../fixtures/window';
import { set, delayObxTick } from '../../../utils';
import { Editor } from '@ali/lowcode-editor-core';
import { Props, getConvertedExtraKey, getOriginalExtraKey, Prop, isProp, isValidArrayIndex } from '../../../../src/document/node/props/props';
import { Designer } from '../../../../src/designer/designer';
import { Project } from '../../../../src/project/project';
import { DocumentModel } from '../../../../src/document/document-model';

import { TransformStage } from '@ali/lowcode-types';


const mockedOwner = { componentName: 'Page' };

describe('Props 类测试', () => {
  let props: Props;
  beforeEach(() => {
    props = new Props(mockedOwner, {
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
    }, { condition: true });
  });
  afterEach(() => {
    props.purge();
  });

  it('getNode', () => {
    expect(props.getNode()).toBe(mockedOwner);
  });

  it('items / get', async () => {
    expect(props.size).toBe(6);

    expect(props.get('a').getValue()).toBe(1);
    expect(props.get('b').getValue()).toBe('str');
    expect(props.get('c').getValue()).toBe(true);
    expect(props.get('d').getValue()).toEqual({ type: 'JSExpression', value: 'state.a' });
    expect(props.get('z').getValue()).toEqual({
      z1: 1,
      z2: 'str',
    });


    expect(props.getPropValue('a')).toBe(1);
    props.setPropValue('a', 2);
    expect(props.getPropValue('a')).toBe(2);
    // props.clearPropValue('a');
    // expect(props.get('a')?.isUnset()).toBeTruthy();

    expect(props.get('z.z1')?.getValue()).toBe(1);
    expect(props.get('z.z2')?.getValue()).toBe('str');

    const fromStashProp = props.get('l', true);
    const fromStashNestedProp = props.get('m.m1', true);
    fromStashProp.setValue('fromStashProp');
    fromStashNestedProp?.setValue('fromStashNestedProp');

    await delayObxTick();
    expect(props.get('l').getValue()).toBe('fromStashProp');
    expect(props.get('m.m1').getValue()).toBe('fromStashNestedProp');
  });

  it('export', () => {
    expect(props.export()).toEqual({
      props: {
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
      },
      extras: {
        condition: true,
      },
    });

    expect(props.toData()).toEqual({
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

    props.get('a')?.unset();
    expect(props.toData()).toEqual({
      a: undefined,
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

  it('import', () => {
    props.import({
      x: 1,
      y: true,
    }, { loop: false });
    expect(props.export()).toEqual({
      props: {
        x: 1,
        y: true,
      },
      extras: {
        loop: false,
      },
    });

    props.import();
  });

  it('merge', async () => {
    props.merge({ x: 1 });

    await delayObxTick();

    expect(props.get('x')?.getValue()).toBe(1);
  });

  it('has / add / delete / deleteKey / remove', () => {
    expect(props.has('a')).toBeTruthy();
    expect(props.has('b')).toBeTruthy();
    expect(props.has('c')).toBeTruthy();
    expect(props.has('d')).toBeTruthy();
    expect(props.has('z')).toBeTruthy();
    expect(props.has('y')).toBeFalsy();

    props.add(1, 'newAdded');
    expect(props.has('newAdded')).toBeTruthy();

    props.deleteKey('c');
    expect(props.get('c', false)).toBeNull();
    props.delete(props.get('b'));
    expect(props.get('b', false)).toBeNull();

    props.get('d')?.remove();
    expect(props.get('d', false)).toBeNull();
  });

  it('迭代器 / map / forEach', () => {
    const mockedFn = jest.fn();
    for (const item of props) {
      mockedFn();
    }
    expect(mockedFn).toHaveBeenCalledTimes(6);
    mockedFn.mockClear();

    props.forEach(item => {
      mockedFn();
    });
    expect(mockedFn).toHaveBeenCalledTimes(6);
    mockedFn.mockClear();

    props.map(item => {
      return mockedFn();
    });
    expect(mockedFn).toHaveBeenCalledTimes(6);
    mockedFn.mockClear();

    props.filter(item => {
      return mockedFn();
    });
    expect(mockedFn).toHaveBeenCalledTimes(6);
    mockedFn.mockClear();
  });

  it('purge', () => {
    props.purge();

    expect(props.purged).toBeTruthy();
  });

  it('empty items', () => {
    expect(new Props(mockedOwner).export()).toEqual({});
  });

  describe('list 类型', () => {
    let props: Props;
    beforeEach(() => {
      props = new Props(mockedOwner, [1, true, 'haha'], { condition: true });
    });
    it('constructor', () => {
      props.purge();
    });

    it('export', () => {
      expect(props.export().extras).toEqual({
        condition: true,
      });
    });

    it('import', () => {
      props.import([1], { loop: true });
      expect(props.export().extras).toEqual({
        loop: true,
      });

      props.items[0]?.unset();
      props.export();
    });
  });
});


describe('其他函数', () => {
  it('getConvertedExtraKey', () => {
    expect(getConvertedExtraKey()).toBe('');
    expect(getConvertedExtraKey('a')).toBe('___a___');
    expect(getConvertedExtraKey('a.b')).toBe('___a___.b');
    expect(getConvertedExtraKey('a.0')).toBe('___a___.0');
  });

  it('getOriginalExtraKey', () => {
    expect(getOriginalExtraKey('___a___')).toBe('a');
    expect(getOriginalExtraKey('___a___.b')).toBe('a.b');
  });
});
