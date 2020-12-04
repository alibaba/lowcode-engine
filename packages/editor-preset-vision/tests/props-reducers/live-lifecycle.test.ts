import '../fixtures/window';
import { Node, Designer, getConvertedExtraKey } from '@ali/lowcode-designer';
import { Editor, globalContext } from '@ali/lowcode-editor-core';
import { liveLifecycleReducer } from '../../src/props-reducers/live-lifecycle-reducer';
import formSchema from '../fixtures/schema/form';

const editor = new Editor();
globalContext.register(editor, Editor);

it('liveLifecycleReducer 测试 - live', () => {
  const mockDidMount = jest.fn();
  const mockWillUnmount = jest.fn();
  editor.set('designMode', 'live');
  const newProps = liveLifecycleReducer(
    {
      lifeCycles: {
        didMount: mockDidMount,
        willUnmount: mockWillUnmount,
      },
    },
    {
      isRoot() {
        return true;
      },
    },
  );

  const { lifeCycles } = newProps;
  expect(typeof lifeCycles.componentDidMount).toBe('function');
  expect(typeof lifeCycles.componentWillUnMount).toBe('function');

  lifeCycles.didMount();
  lifeCycles.willUnmount();

  expect(mockDidMount).toHaveBeenCalled();
  expect(mockWillUnmount).toHaveBeenCalled();
});

it('liveLifecycleReducer 测试 - design', () => {
  const mockDidMount = jest.fn();
  const mockWillUnmount = jest.fn();
  editor.set('designMode', 'design');
  const newProps = liveLifecycleReducer(
    {
      lifeCycles: {
        didMount: mockDidMount,
        willUnmount: mockWillUnmount,
      },
    },
    {
      isRoot() {
        return true;
      },
    },
  );

  const { lifeCycles } = newProps;
  expect(lifeCycles).toEqual({});
});

it('liveLifecycleReducer 测试', () => {
  const mockDidMount = jest.fn();
  const mockWillUnmount = jest.fn();
  editor.set('designMode', 'design');
  const newProps = liveLifecycleReducer(
    {
      propA: '111',
    },
    {
      isRoot() {
        return true;
      },
    },
  );

  const { lifeCycles } = newProps;
  expect(lifeCycles).toBeUndefined;
});
