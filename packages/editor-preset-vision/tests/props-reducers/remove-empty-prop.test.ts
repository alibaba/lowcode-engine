import '../fixtures/window';
import { Node, Designer, getConvertedExtraKey } from '@ali/lowcode-designer';
import { Editor, globalContext } from '@ali/lowcode-editor-core';
import { removeEmptyPropsReducer } from '../../src/props-reducers/remove-empty-prop-reducer';
import formSchema from '../fixtures/schema/form';

it('removeEmptyPropsReducer 测试', () => {
  const newProps = removeEmptyPropsReducer(
    {
      propA: '111',
      dataSource: {
        online: [
          {
            options: {
              params: [
                {
                  name: 'propA',
                  value: '111',
                },
                {
                  value: '111',
                },
              ],
            },
          },
        ],
      },
    },
    {
      isRoot() {
        return true;
      },
    },
  );

  expect(newProps).toEqual({
    propA: '111',
    dataSource: {
      online: [
        {
          options: {
            params: [{
              name: 'propA',
              value: '111',
            }, {
              value: '111',
            }],
          },
        },
      ],
      list: [
        {
          options: {
            params: {
              propA: '111',
            },
          },
        },
      ],
    },
  });
});
