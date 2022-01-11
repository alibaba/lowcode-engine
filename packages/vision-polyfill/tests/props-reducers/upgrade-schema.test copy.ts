import '../fixtures/window';
import { Node, Designer, getConvertedExtraKey } from '@ali/lowcode-designer';
import { Editor } from '@ali/lowcode-editor-core';
import {
  upgradePropsReducer,
  upgradePageLifeCyclesReducer,
} from '../../src/props-reducers/upgrade-reducer';
import formSchema from '../fixtures/schema/form';

describe('upgradePropsReducer 测试', () => {
  it('upgradePropsReducer 测试', () => {
    const props = {
      a: {
        type: 'JSBlock',
        value: {
          componentName: 'Slot',
          props: {
            slotTitle: '标题',
            slotName: 'title',
          },
          children: [],
        },
      },
      b: {
        type: 'JSBlock',
        value: {
          componentName: 'Div',
          props: {},
        },
      },
      c: {
        c1: {
          type: 'JSBlock',
          value: {
            componentName: 'Slot',
            props: {
              slotTitle: '标题',
              slotName: 'title',
            },
          },
        },
      },
      d: {
        type: 'variable',
        variable: 'state.a',
        value: '111',
      },
      __slot__haha: true,
    };

    expect(upgradePropsReducer(props)).toEqual({
      a: {
        type: 'JSSlot',
        title: '标题',
        name: 'title',
        value: [],
      },
      b: {
        componentName: 'Div',
        props: {},
      },
      c: {
        c1: {
          type: 'JSSlot',
          title: '标题',
          name: 'title',
          value: undefined,
        },
      },
      d: {
        type: 'JSExpression',
        value: 'state.a',
        mock: '111',
      },
    });
  });

  it('空值', () => {
    expect(upgradePropsReducer(null)).toBeNull;
    expect(upgradePropsReducer(undefined)).toBeUndefined;
  });
});

const editor = new Editor();
const designer = new Designer({ editor });
designer.project.open(formSchema);

it('upgradePageLifeCyclesReducer 测试', () => {
  const rootNode = designer.currentDocument?.rootNode;
  const mockDidMount = jest.fn();
  const mockWillUnmount = jest.fn();
  upgradePageLifeCyclesReducer({
    didMount: mockDidMount,
    willUnmount: mockWillUnmount,
  }, rootNode);

  const lifeCycles = rootNode?.getPropValue(getConvertedExtraKey('lifeCycles'));

  expect(typeof lifeCycles.didMount).toBe('function');
  expect(typeof lifeCycles.willUnmount).toBe('function');

  lifeCycles.didMount();
  lifeCycles.willUnmount();

  expect(mockDidMount).toHaveBeenCalled();
  expect(mockWillUnmount).toHaveBeenCalled();
});
