
import React, { Component, createElement, forwardRef, PureComponent, createContext } from 'react';
const mockGetRenderers = jest.fn();
const mockGetRuntime = jest.fn();
const mockParseExpression = jest.fn();
jest.mock('../../src/adapter', () => {
  return {
    getRenderers: () => { return mockGetRenderers();},
    getRuntime: () => { return mockGetRuntime();},
   };
});
jest.mock('../../src/utils', () => {
  const originalUtils = jest.requireActual('../../src/utils');
  return {
    ...originalUtils,
    parseExpression: (...args) => { mockParseExpression(args);},
   };
});


import baseRendererFactory from '../../src/renderer/base';
import { IBaseRendererProps } from '../../src/types';
import TestRenderer from 'react-test-renderer';
import components from '../utils/components';
import schema from '../fixtures/schema/basic';


describe('Base Render factory', () => {
  it('customBaseRenderer logic works', () => {
    mockGetRenderers.mockReturnValue({BaseRenderer: {}});
    const baseRenderer = baseRendererFactory();
    expect(mockGetRenderers).toBeCalledTimes(1);
    expect(baseRenderer).toStrictEqual({});
    mockGetRenderers.mockClear();
  });
});

describe('Base Render methods', () => {
  let RendererClass;
  const mockRendererFactory = () => {
    return class extends Component {
      constructor(props: IBaseRendererProps, context: any) {
        super(props, context);
      }
    }
  }
  beforeEach(() => {
    const mockRnederers = {
      PageRenderer: mockRendererFactory(),
      ComponentRenderer: mockRendererFactory(),
      BlockRenderer: mockRendererFactory(),
      AddonRenderer: mockRendererFactory(),
      TempRenderer: mockRendererFactory(),
      DivRenderer: mockRendererFactory(),
    };
    mockGetRenderers.mockReturnValue(mockRnederers);
    mockGetRuntime.mockReturnValue({
      Component,
      createElement,
      PureComponent,
      createContext,
      forwardRef,
    });
    RendererClass = baseRendererFactory();
  })

  afterEach(() => {
    mockGetRenderers.mockClear();
  })

  it('should excute lifecycle.getDerivedStateFromProps when defined', () => {
    const mockGetDerivedStateFromProps = {
      type: 'JSFunction',
      value: 'function() {\n    console.log(\'did mount\');\n  }',
    };
    const mockSchema = schema;
    (mockSchema.lifeCycles as any).getDerivedStateFromProps = mockGetDerivedStateFromProps;

    // const originalUtils = jest.requireActual('../../src/utils');
    // mockParseExpression.mockImplementation(originalUtils.parseExpression);
    const component = TestRenderer.create(
      <RendererClass
        __schema={mockSchema}
        components={components as any}
        thisRequiredInJSE={false}
        a='1'
      />);
    // console.log(component.root.props.a);
    // component.update(<RendererClasssnippets
    //   schema={mockSchema}
    //   components={components as any}
    //   thisRequiredInJSE={false}
    //   a='2'
    // />);
    // console.log(component.root.props.a);
    // expect(mockParseExpression).toHaveBeenCalledWith(mockGetDerivedStateFromProps, expect.anything())
    // test lifecycle.getDerivedStateFromProps is null

    // test lifecycle.getDerivedStateFromProps is JSExpression

    // test lifecycle.getDerivedStateFromProps is JSFunction

    // test lifecycle.getDerivedStateFromProps is function

  });


  // it('should excute lifecycle.getSnapshotBeforeUpdate when defined', () => {
  // });

  // it('should excute lifecycle.componentDidMount when defined', () => {
  // });

  // it('should excute lifecycle.componentDidUpdate when defined', () => {
  // });

  // it('should excute lifecycle.componentWillUnmount when defined', () => {
  // });

  // it('should excute lifecycle.componentDidCatch when defined', () => {
  // });

  // it('__executeLifeCycleMethod should work', () => {
  // });

  // it('reloadDataSource should work', () => {
  // });

  // it('shouldComponentUpdate should work', () => {
  // });


  // it('_getComponentView should work', () => {
  // });

  // it('__bindCustomMethods should work', () => {
  // });

  // it('__generateCtx should work', () => {
  // });

  // it('__parseData should work', () => {
  // });

  // it('__initDataSource should work', () => {
  // });

  // it('__initI18nAPIs should work', () => {
  // });

  // it('__writeCss should work', () => {
  // });

  // it('__render should work', () => {
  // });

  // it('getSchemaChildren should work', () => {
  // });

  // it('__createDom should work', () => {
  // });

  // it('__createVirtualDom should work', () => {
  // });

  // it('__componentHOCs should work', () => {
  // });

  // it('__getSchemaChildrenVirtualDom should work', () => {
  // });

  // it('__getComponentProps should work', () => {
  // });

  // it('__createLoopVirtualDom should work', () => {
  // });

  // it('__designModeIsDesign should work', () => {
  // });

  // it('__parseProps should work', () => {
  // });

  // it('$ should work', () => {
  // });

  // it('__renderContextProvider should work', () => {
  // });

  // it('__renderContextConsumer should work', () => {
  // });

  // it('__getHOCWrappedComponent should work', () => {
  // });

  // it('__renderComp should work', () => {
  // });

  // it('__renderContent should work', () => {
  // });

  // it('__checkSchema should work', () => {
  // });

  // it('requestHandlersMap should work', () => {
  // });

  // it('utils should work', () => {
  // });

  // it('constants should work', () => {
  // });

  // it('history should work', () => {
  // });

  // it('location should work', () => {
  // });

  // it('match should work', () => {
  // });
});