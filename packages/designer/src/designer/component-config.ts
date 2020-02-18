import { ReactNode, ReactElement, ComponentType } from 'react';
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

export type CustomView = ReactElement | ComponentType<any>;

export interface TipConfig {
  className?: string;
  children?: ReactNode;
  theme?: string;
  direction?: string; // 'n|s|w|e|top|bottom|left|right';
}

export interface IconConfig {
  name: string;
  size?: string;
  className?: string;
  effect?: string;
}

export interface TitleConfig {
  label?: ReactNode;
  tip?: string | ReactElement | TipConfig;
  icon?: string | ReactElement | IconConfig;
  className?: string;
}

export type Title = string | ReactElement | TitleConfig;

export enum DisplayType {
  Inline = 'inline',
  Block = 'block',
  Accordion = 'Accordion',
  Plain = 'plain',
  Caption = 'caption',
}

export interface SetterConfig {
  /**
   * if *string* passed must be a registered Setter Name
   */
  componentName: string | CustomView;
  /**
   * the props pass to Setter Component
   */
  props?: {
    [prop: string]: any;
  };
}

/**
 * if *string* passed must be a registered Setter Name
 */
export type SetterType = SetterConfig | string | CustomView;

export interface SettingFieldConfig {
  /**
   * the name of this setting field, which used in quickEditor
   */
  name: string;
  /**
   * the field body contains
   */
  setter: SetterType;
  /**
   * the prop target which to set, eg. "style.width"
   * @default sameas .name
   */
  propTarget?: string;
  /**
   * the field title
   * @default sameas .propTarget
   */
  title?: Title;
  extraProps?: {
    /**
     * default value of target prop for setter use
     */
    defaultValue?: any;
    onChange?: (value: any) => void;
    getValue?: () => any;
    /**
     * the field conditional show, is not set always true
     * @default undefined
     */
    condition?: (node: Node) => boolean;
    /**
     * quick add "required" validation
     */
    required?: boolean;
    /**
     * the field display
     * @default DisplayType.Block
     */
    display?: DisplayType.Inline | DisplayType.Block | DisplayType.Accordion | DisplayType.Plain;
    /**
     * default collapsed when display accordion
     */
    defaultCollapsed?: boolean;
    /**
     * layout control
     * number or [column number, left offset]
     * @default 6
     */
    span?: number | [number, number];
  };
}

export interface SettingGroupConfig {
  /**
   * the type "group"
   */
  type: 'group';
  /**
   * the name of this setting group, which used in quickEditor
   */
  name?: string;
  /**
   * the setting items which group body contains
   */
  items: Array<SettingFieldConfig | SettingGroupConfig | CustomView>;
  /**
   * the group title
   * @default sameas .name
   */
  title?: Title;
  extraProps: {
    /**
     * the field conditional show, is not set always true
     * @default undefined
     */
    condition?: (node: Node) => boolean;
    /**
     * the group display
     * @default DisplayType.Block
     */
    display?: DisplayType.Block | DisplayType.Accordion;
    /**
     * default collapsed when display accordion
     */
    defaultCollapsed?: boolean;
    /**
     * the gap between span
     * @default 0 px
     */
    gap?: number;
    /**
     * layout control
     * number or [column number, left offset]
     * @default 6
     */
    span?: number | [number, number];
  };
}

export type PropSettingConfig = SettingFieldConfig | SettingGroupConfig | CustomView;

export interface NestingRule {
  childWhitelist?: string[];
  parentWhitelist?: string[];
}

export interface Configure {
  props?: PropSettingConfig[];
  styles?: object;
  events?: object;
  component?: {
    isContainer?: boolean;
    isModal?: boolean;
    descriptor?: string;
    nestingRule?: NestingRule;
  };
}

export interface ComponentDescriptionSpec {
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
  configure?: PropSettingConfig[] | Configure;
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

export class ComponentConfig {
  readonly isComponentConfig = true;
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
    return this._isContainer!;
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
  get configure(): Configure {
    return this._configure!;
  }

  private parentWhitelist?: string[] | null;
  private childWhitelist?: string[] | null;

  get title() {
    return this._spec.title;
  }

  get icon() {
    return this._spec.icon;
  }

  get propsConfigure() {
    return this.configure.props;
  }

  constructor(private _spec: ComponentDescriptionSpec) {
    this.parseSpec(_spec);
  }

  private parseSpec(spec: ComponentDescriptionSpec) {
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
    if (!this.configure.props) {
      this.configure.props = props ? generatePropsConfigure(props) : [];
    }
    const { component } = this.configure;
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

  set spec(spec: ComponentDescriptionSpec) {
    this._spec = spec;
    this.parseSpec(spec);
  }

  get spec(): ComponentDescriptionSpec {
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
