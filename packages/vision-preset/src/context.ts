import { assign } from 'lodash';

import { Component, ReactElement } from 'react';
import VisualManager from './base/visualManager';
import Prototype from './bundle/prototype';

// TODO: Env 本地引入后需要兼容方法 getDesignerLocale
// import Env from './env';

let contextInstance: VisualEngineContext;

// prop is Prop object in Designer
export type SetterProvider = (prop: any, componentPrototype: Prototype) => Component | ReactElement<any>;

export default class VisualEngineContext {
  private managerMap: { [name: string]: VisualManager } = {};
  private moduleMap: { [name: string]: any } = {};
  private pluginsMap: { [name: string]: any } = {};

  constructor() {
    if (!contextInstance) {
      contextInstance = this;
    } else {
      return contextInstance;
    }
  }

  use(pluginName: string, plugin: any) {
    this.pluginsMap[pluginName || 'unknown'] = plugin;
  }

  getPlugin(name: string) {
    if (!name) {
      name = 'default';
    }
    if (this.pluginsMap[name]) {
      return this.pluginsMap[name];
    } else if (this.moduleMap[name]) {
      return this.moduleMap[name];
    }
    return this.getManager(name);
  }

  registerManager(managerMap?: { [name: string]: VisualManager }): this;
  registerManager(name: string, manager: VisualManager): this;
  registerManager(name?: any, manager?: VisualManager): this {
    if (name && typeof name === 'object') {
      this.managerMap = assign(this.managerMap, name);
    } else {
      this.managerMap[name] = manager as VisualManager;
    }
    return this;
  }

  registerModule(moduleMap: { [name: string]: any }): this;
  registerModule(name: string, module: any): this;
  registerModule(name?: any, module?: any): this {
    if (typeof name === 'object') {
      this.moduleMap = Object.assign({}, this.moduleMap, name);
    } else {
      this.moduleMap[name] = module;
    }
    return this;
  }

  getManager(name: string): VisualManager {
    return this.managerMap[name];
  }

  getModule(name: string): any {
    return this.moduleMap[name];
  }

  // getDesignerLocale(): string {
  //   return Env.getLocale();
  // }

  /**
   * Builtin APIs
   */

  /**
   * support dynamic setter replacement
   */
  registerDynamicSetterProvider(setterProvider: SetterProvider) {
    if (!setterProvider) {
      console.error('ERROR: ', 'please set provider function.');
      return;
    }
    this.use('ve.plugin.setterProvider', setterProvider);
  }

  /**
   * support add treePane on the setting pane
   * @param treePane see @ali/ve-tree-pane
   * @param treeCore see @ali/ve-tree-pane
   */
  registerTreePane(TreePane: Component, TreeCore: Component) {
    if (TreePane && TreeCore) {
      this.registerModule('TreePane', TreePane);
      this.registerModule('TreeCore', TreeCore);
    }
  }
}
