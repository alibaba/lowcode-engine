import jsx from '../../../src/plugins/component/react/jsx';
import { IContainerInfo } from '../../../src/types';

describe('condition at root', () => {
  test('condition=true should be ignored', async () => {
    const containerIr: IContainerInfo = {
      containerType: 'Page',
      moduleName: 'test',
      componentName: 'Page',
      fileName: 'test',
      condition: true,
      children: [{ componentName: 'Text', children: 'Hello world!' }],
    };
    const result = await jsx()({
      ir: containerIr,
      contextData: {},
      chunks: [],
      depNames: [],
    });
    expect(result).toMatchSnapshot();
  });

  test('condition=null should be ignored', async () => {
    const containerIr: IContainerInfo = {
      containerType: 'Page',
      moduleName: 'test',
      componentName: 'Page',
      fileName: 'test',
      condition: null,
      children: [{ componentName: 'Text', children: 'Hello world!' }],
    };
    const result = await jsx()({
      ir: containerIr,
      contextData: {},
      chunks: [],
      depNames: [],
    });
    expect(result).toMatchSnapshot();
  });

  test('condition=JSExpression should be ignored', async () => {
    const containerIr: IContainerInfo = {
      containerType: 'Page',
      moduleName: 'test',
      componentName: 'Page',
      fileName: 'test',
      condition: {
        type: 'JSExpression',
        value: 'this.state.something',
      },
      children: [{ componentName: 'Text', children: 'Hello world!' }],
    };
    const result = await jsx()({
      ir: containerIr,
      contextData: {},
      chunks: [],
      depNames: [],
    });
    expect(result).toMatchSnapshot();
  });

  test('condition and loop should be both works', async () => {
    const containerIr: IContainerInfo = {
      containerType: 'Page',
      moduleName: 'test',
      componentName: 'Page',
      fileName: 'test',
      condition: {
        type: 'JSExpression',
        value: 'this.state.something',
      },
      loop: {
        type: 'JSExpression',
        value: 'this.state.otherThings',
      },
      children: [{ componentName: 'Text', children: 'Hello world!' }],
    };
    const result = await jsx()({
      ir: containerIr,
      contextData: {},
      chunks: [],
      depNames: [],
    });
    expect(result).toMatchSnapshot();
  });

  test('invalid attr name should not be generated', async () => {
    const containerIr: IContainerInfo = {
      containerType: 'Page',
      moduleName: 'test',
      componentName: 'Page',
      fileName: 'test',
      condition: null,
      children: [{ componentName: 'Text', children: 'Hello world!', props: { 'a': 1, 'a.b': 2 } }],
    };
    const result = await jsx()({
      ir: containerIr,
      contextData: {},
      chunks: [],
      depNames: [],
    });
    expect(result).toMatchSnapshot();
  })
});
