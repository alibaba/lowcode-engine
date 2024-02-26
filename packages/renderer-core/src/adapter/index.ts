import { IRuntime, IRendererModules, IGeneralConstructor } from '../types';

export enum Env {
  React = 'react',
}

class Adapter {
  runtime: IRuntime;

  builtinModules = ['Component', 'PureComponent', 'createElement', 'createContext', 'forwardRef', 'findDOMNode'];

  env: Env;

  renderers: IRendererModules;

  configProvider: any;

  constructor() {
    this.initRuntime();
  }

  initRuntime() {
    const Component: IGeneralConstructor = class <T = any, S = any> {
      state: Readonly<S>;
      props: Readonly<T> & Readonly<{ children?: any | undefined }>;
      refs: Record<string, unknown>;
      context: Record<string, unknown>;
      setState() {}
      forceUpdate() {}
      render() {}
    };
    const PureComponent = class <T = any, S = any> {
      state: Readonly<S>;
      props: Readonly<T> & Readonly<{ children?: any | undefined }>;
      refs: Record<string, unknown>;
      context: Record<string, unknown>;
      setState() {}
      forceUpdate() {}
      render() {}
    };
    const createElement = () => {};
    const createContext = () => {};
    const forwardRef = () => {};
    const findDOMNode = () => {};
    this.runtime = {
      Component,
      PureComponent,
      createElement,
      createContext,
      forwardRef,
      findDOMNode,
    };
  }

  setRuntime(runtime: IRuntime) {
    if (this.isValidRuntime(runtime)) {
      this.runtime = runtime;
    }
  }

  isValidRuntime(runtime: IRuntime) {
    if (typeof runtime !== 'object' || Array.isArray(runtime)) {
      return false;
    }

    return this.builtinModules.every((m) => {
      const flag = !!runtime[m];
      if (!flag) {
        throw new Error(`runtime is invalid, module '${m}' does not exist`);
      }
      return flag;
    });
  }

  getRuntime() {
    return this.runtime;
  }

  setEnv(env: Env) {
    this.env = env;
  }

  isReact() {
    return this.env === Env.React;
  }

  setRenderers(renderers: IRendererModules) {
    this.renderers = renderers;
  }

  getRenderers() {
    return this.renderers || {};
  }

  setConfigProvider(Comp: any) {
    this.configProvider = Comp;
  }

  getConfigProvider() {
    return this.configProvider;
  }
}

export default new Adapter();
