import { IRuntime, IRendererModules } from '../types';

export enum Env {
  React = 'react',
  Rax = 'rax',
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
    const Component = class {};
    const PureComponent = class {};
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

    return this.builtinModules.every(m => {
      const flag = !!this.runtime[m];
      if (!flag) {
        throw new Error(`runtime is inValid, module '${m}' is not existed`);
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

  isRax() {
    return this.env === Env.Rax;
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
