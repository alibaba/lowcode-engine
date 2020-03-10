import { ReactNode } from 'react';
import Node, { NodeParent } from './document/node/node';
import { NodeData, NodeSchema } from './schema';

export type BasicTypes = 'array' | 'bool' | 'func' | 'number' | 'object' | 'string' | 'node' | 'element' | 'any';
export interface CompositeType {
  type: BasicTypes;
  isRequired: boolean;
}

// TODO: add complex types

export interface PropConfig {
  name: string;
  propType: BasicTypes | CompositeType;
  description?: string;
  defaultValue?: any;
}

export interface NestingRule {
  childWhitelist?: string[];
  parentWhitelist?: string[];
}

export interface Configure {
  props?: any[];
  styles?: object;
  events?: object;
  component?: {
    isContainer?: boolean;
    isModal?: boolean;
    descriptor?: string;
    nestingRule?: NestingRule;
  };
}

export interface ComponentDescription {
  componentName: string;
  /**
   * unique id
   */
  uri?: string;
  /**
   * title or description
   */
  title?: string;
  /**
   * svg icon for component
   */
  icon?: string | ReactNode;
  tags?: string[];
  description?: string;
  docUrl?: string;
  screenshot?: string;
  devMode?: 'procode' | 'lowcode';
  npm?: {
    package: string;
    exportName: string;
    subName: string;
    main: string;
    destructuring: boolean;
    version: string;
  };
  props?: PropConfig[];
  configure?: any[] | Configure;
}

function ensureAList(list?: string | string[]): string[] | null {
  if (!list) {
    return null;
  }
  if (!Array.isArray(list)) {
    list = list.split(/ *[ ,|] */).filter(Boolean);
  }
  if (list.length < 1) {
    return null;
  }
  return list;
}

function npmToURI(npm: {
  package: string;
  exportName?: string;
  subName?: string;
  destructuring?: boolean;
  main?: string;
  version: string;
}): string {
  let pkg = [];
  if (npm.package) {
    pkg.push(npm.package);
  }
  if (npm.main) {
    if (npm.main[0] === '/') {
      pkg.push(npm.main.slice(1));
    } else if (npm.main.slice(0, 2) === './') {
      pkg.push(npm.main.slice(2));
    } else {
      pkg.push(npm.main);
    }
  }

  let uri = pkg.join('/');
  uri += `:${npm.destructuring && npm.exportName ? npm.exportName : 'default'}`;

  if (npm.subName) {
    uri += `.${npm.subName}`;
  }

  return uri;
}

function generatePropsConfigure(props: PropConfig[]) {
  // todo:
  return [];
}

export class ComponentType {
  readonly isComponentType = true;
  private _uri?: string;
  get uri(): string {
    return this._uri!;
  }
  private _componentName?: string;
  get componentName(): string {
    return this._componentName!;
  }
  private _isContainer?: boolean;
  get isContainer(): boolean {
    return true; // this._isContainer! || this.isRootComponent();
  }
  private _isModal?: boolean;
  get isModal(): boolean {
    return this._isModal!;
  }
  private _descriptor?: string;
  get descriptor(): string {
    return this._descriptor!;
  }
  private _acceptable?: boolean;
  get acceptable(): boolean {
    return this._acceptable!;
  }
  private _configure?: Configure;
  get configure() {
    return [{
      name: '#props',
      title: "属性",
      items: [{
        name: 'label',
        title: '标签',
        setter: 'StringSetter'
      }, {
        name: 'name',
        title: '名称',
        setter: {
          componentName: 'ArraySetter',
          props: {
            itemConfig: {
              setter: 'StringSetter',
              defaultValue: ''
            }
          }
        }
      }, {
        name: 'size',
        title: '大小',
        setter: 'StringSetter'
      }, {
        name: 'age',
        title: '年龄',
        setter: 'NumberSetter'
      }]
    }, {
      name: '#styles',
      title: "样式",
      items: [{
        name: 'className',
        title: '类名绑定',
        setter: 'ClassNameSetter'
      }, {
        name: 'className2',
        title: '类名绑定',
        setter: 'StringSetter'
      }, {
        name: '#inlineStyles',
        title: '行内样式',
        items: []
      }]
    }, {
      name: '#events',
      title: "事件",
      items: [{
        name: '!events',
        title: '事件绑定',
        setter: 'EventsSetter'
      }]
    }, {
      name: '#data',
      title: "数据",
      items: []
    }];
  }

  private parentWhitelist?: string[] | null;
  private childWhitelist?: string[] | null;

  get title() {
    return this._spec.title || this.componentName;
  }

  get icon() {
    return this._spec.icon;
  }

  constructor(private _spec: ComponentDescription) {
    this.parseSpec(_spec);
  }

  private parseSpec(spec: ComponentDescription) {
    const { componentName, uri, configure, npm, props } = spec;
    this._uri = uri || (npm ? npmToURI(npm) : componentName);
    this._componentName = componentName;
    this._acceptable = false;

    if (!configure || Array.isArray(configure)) {
      this._configure = {
        props: !configure ? [] : configure,
        styles: {
          supportClassName: true,
          supportInlineStyle: true,
        },
      };
    } else {
      this._configure = configure;
    }
    if (!this._configure.props) {
      this._configure.props = props ? generatePropsConfigure(props) : [];
    }
    const { component } = this._configure;
    if (component) {
      this._isContainer = component.isContainer ? true : false;
      this._isModal = component.isModal ? true : false;
      this._descriptor = component.descriptor;
      if (component.nestingRule) {
        const { parentWhitelist, childWhitelist } = component.nestingRule;
        this.parentWhitelist = ensureAList(parentWhitelist);
        this.childWhitelist = ensureAList(childWhitelist);
      }
    } else {
      this._isContainer = false;
      this._isModal = false;
    }
  }

  isRootComponent() {
    return this.componentName === 'Page' || this.componentName === 'Block' || this.componentName === 'Component';
  }

  set spec(spec: ComponentDescription) {
    this._spec = spec;
    this.parseSpec(spec);
  }

  get spec(): ComponentDescription {
    return this._spec;
  }

  checkNestingUp(my: Node | NodeData, parent: NodeParent) {
    if (this.parentWhitelist) {
      return this.parentWhitelist.includes(parent.componentName);
    }
    return true;
  }

  checkNestingDown(my: Node, target: Node | NodeSchema) {
    if (this.childWhitelist) {
      return this.childWhitelist.includes(target.componentName);
    }
    return true;
  }
}
