import '../fixtures/window';
import { nodeTopFixedReducer } from '../../src/props-reducers/node-top-fixed-reducer';
import formSchema from '../fixtures/schema/form';

it('nodeTopFixedReducer 测试', () => {
  expect(
    nodeTopFixedReducer(
      {
        propA: '111',
      },
      { componentMeta: { isTopFixed: true } },
    ),
  ).toEqual({
    propA: '111',
    __isTopFixed__: true,
  });

  expect(
    nodeTopFixedReducer(
      {
        propA: '111',
      },
      { componentMeta: { } },
    ),
  ).toEqual({
    propA: '111',
  });
});
