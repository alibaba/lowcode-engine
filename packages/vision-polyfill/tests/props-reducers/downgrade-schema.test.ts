import '../fixtures/window';
import { Node, Designer, getConvertedExtraKey } from '@ali/lowcode-designer';
import { Editor } from '@ali/lowcode-editor-core';
import {
  compatibleReducer,
} from '../../src/props-reducers/downgrade-schema-reducer';
import formSchema from '../fixtures/schema/form';

describe('compatibleReducer 测试', () => {
  it('compatibleReducer 测试', () => {
    const downgradedProps = {
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
      e: {
        e1: {
          type: 'variable',
          variable: 'state.b',
          value: '222',
        },
        e2: {
          type: 'JSExpression',
          value: 'state.b',
          mock: '222',
          events: {},
        },
      },
    };

    expect(compatibleReducer({
      a: {
        type: 'JSSlot',
        title: '标题',
        name: 'title',
        value: [],
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
      e: {
        e1: {
          type: 'JSExpression',
          value: 'state.b',
          mock: '222',
        },
        e2: {
          type: 'JSExpression',
          value: 'state.b',
          mock: '222',
          events: {},
        },
      },
    })).toEqual(downgradedProps);
  });

  it('空值', () => {
    expect(compatibleReducer(null)).toBeNull;
    expect(compatibleReducer(undefined)).toBeUndefined;
    expect(compatibleReducer(111)).toBe(111);
  });
});
