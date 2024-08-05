// @ts-nocheck
import adapter, { Env } from '../../src/adapter';



describe('test src/adapter ', () => {
  
  it('adapter basic use works', () => {
    expect(adapter).toBeTruthy();

  });
  
  it('isValidRuntime works', () => {
    expect(adapter.isValidRuntime([] as any)).toBeFalsy();

    expect(adapter.isValidRuntime('' as any)).toBeFalsy();

    let invalidRuntime = {};
    expect(() => adapter.isValidRuntime(invalidRuntime as any)).toThrowError(/Component/);
    invalidRuntime = {
      Component: {},
    };
    expect(() => adapter.isValidRuntime(invalidRuntime as any)).toThrowError(/PureComponent/);
    invalidRuntime = {
      Component: {},
      PureComponent: {},
    };
    expect(() => adapter.isValidRuntime(invalidRuntime as any)).toThrowError(/createElement/);
    invalidRuntime = {
      Component: {},
      PureComponent: {},
      createElement: {},
    };
    expect(() => adapter.isValidRuntime(invalidRuntime as any)).toThrowError(/createContext/);
    invalidRuntime = {
      Component: {},
      PureComponent: {},
      createElement: {},
      createContext: {},
    };
    expect(() => adapter.isValidRuntime(invalidRuntime as any)).toThrowError(/forwardRef/);
    invalidRuntime = {
      Component: {},
      PureComponent: {},
      createElement: {},
      createContext: {},
      forwardRef: {},
    };
    expect(() => adapter.isValidRuntime(invalidRuntime as any)).toThrowError(/findDOMNode/);
    const validRuntime = {
      Component: {},
      PureComponent: {},
      createElement: {},
      createContext: {},
      forwardRef: {},
      findDOMNode: {},
    };

    expect(adapter.isValidRuntime(validRuntime as any)).toBeTruthy();
  });

  it('setRuntime/getRuntime works', () => {
    const validRuntime = {
      Component: {},
      PureComponent: {},
      createElement: {},
      createContext: {},
      forwardRef: {},
      findDOMNode: {},
    };

    adapter.setRuntime(validRuntime as any);
    expect(adapter.getRuntime()).toBe(validRuntime);

    // won`t work when invalid runtime paased in. 
    adapter.setRuntime([] as any);
    expect(adapter.getRuntime()).toBe(validRuntime);


  });

  it('setEnv/.env/isReact works', () => {
    adapter.setEnv(Env.React);
    expect(adapter.env).toBe(Env.React);
    expect(adapter.isReact()).toBeTruthy();
  });

  it('setRenderers/getRenderers works', () => {
    const mockRenderers = { BaseRenderer: {} as IBaseRenderComponent};
    adapter.setRenderers(mockRenderers);
    expect(adapter.getRenderers()).toBe(mockRenderers);
    adapter.setRenderers(undefined);
    expect(adapter.getRenderers()).toStrictEqual({});
  });

  it('setConfigProvider/getConfigProvider works', () => {
    const mockConfigProvider = { a: 111 };
    adapter.setConfigProvider(mockConfigProvider);
    expect(adapter.getConfigProvider()).toBe(mockConfigProvider);
  });
});