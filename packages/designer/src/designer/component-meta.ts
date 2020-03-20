import { ReactNode, ReactElement, ComponentType, createElement } from 'react';
import Node, { NodeParent } from './document/node/node';
import { NodeData, NodeSchema } from './schema';
import { PropConfig } from './prop-config';
import Designer from './designer';
import { Remove, Clone } from '../../../globals';
import { computed } from '@recore/obx';
import { intl } from '../locale';

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
    rectSelector?: string;
    // copy,move,delete
    disableBehaviors?: string[];
    actions?: ComponentAction[];
  };
}

export interface ContentObject {
  // 图标
  icon?: string | ComponentType<any> | ReactElement;
  // 描述
  description?: string;
  // 执行动作
  action?: (node: Node) => void;
}

export interface ComponentAction {
  // behaviorName
  name: string;
  // 菜单名称
  content: string | ReactNode | ContentObject;
  // 子集
  items?: ComponentAction[];
  // 不显示
  condition?: boolean | ((node: Node) => boolean);
  // 显示在工具条上
  important?: boolean;
}

export function isContentObject(obj: any): obj is ContentObject {
  return obj && typeof obj === 'object';
}

export interface ComponentMetadata {
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

interface TransformedComponentMetadata extends ComponentMetadata {
  configure: Configure & {
    combined?: any[];
  };
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
  const pkg = [];
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

export type MetadataTransducer = (prev: TransformedComponentMetadata) => TransformedComponentMetadata;
const metadataTransducers: MetadataTransducer[] = [];

// propsParser
//

export function registerMetadataTransducer(transducer: MetadataTransducer) {
  metadataTransducers.push(transducer);
}

export class ComponentMeta {
  readonly isComponentMeta = true;
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
    return this._isContainer! || this.isRootComponent();
  }
  private _isModal?: boolean;
  get isModal(): boolean {
    return this._isModal!;
  }
  private _descriptor?: string;
  get descriptor(): string | undefined {
    return this._descriptor;
  }
  private _rectSelector?: string;
  get rectSelector(): string | undefined {
    return this._rectSelector;
  }
  private _acceptable?: boolean;
  get acceptable(): boolean {
    return this._acceptable!;
  }
  private _transformedMetadata?: TransformedComponentMetadata;
  get configure() {
    const config = this._transformedMetadata?.configure;
    return config?.combined || config?.props || [];
  }

  private parentWhitelist?: string[] | null;
  private childWhitelist?: string[] | null;

  get title() {
    return this._metadata.title || this.componentName;
  }

  get icon() {
    return this._metadata.icon;
  }

  constructor(readonly designer: Designer, private _metadata: ComponentMetadata) {
    this.parseMetadata(_metadata);
  }

  private parseMetadata(metadta: ComponentMetadata) {
    const { componentName, uri, npm, props } = metadta;
    this._uri = uri || (npm ? npmToURI(npm) : componentName);
    this._componentName = componentName;

    metadta.uri = this._uri;
    // 额外转换逻辑
    this._transformedMetadata = this.transformMetadata(metadta);

    const { configure = {} } = this._transformedMetadata;
    this._acceptable = false;

    const { component } = configure;
    if (component) {
      this._isContainer = component.isContainer ? true : false;
      this._isModal = component.isModal ? true : false;
      this._descriptor = component.descriptor;
      this._rectSelector = component.rectSelector;
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

  private transformMetadata(metadta: ComponentMetadata): TransformedComponentMetadata {
    const result = metadataTransducers.reduce((prevMetadata, current) => {
      return current(prevMetadata);
    }, preprocessMetadata(metadta));

    if (!result.configure) {
      result.configure = {};
    }
    return result as any;
  }

  isRootComponent() {
    return this.componentName === 'Page' || this.componentName === 'Block' || this.componentName === 'Component';
  }

  @computed get availableActions() {
    let { disableBehaviors, actions } = this._transformedMetadata?.configure.component || {};
    actions = builtinComponentActions.concat(this.designer.getGlobalComponentActions() || [], actions || []);
    if (!disableBehaviors && this.isRootComponent()) {
      disableBehaviors = ['copy', 'remove'];
    }
    if (disableBehaviors) {
      return actions.filter(action => disableBehaviors!.indexOf(action.name) < 0);
    }
    return actions;
  }

  set metadata(metadata: ComponentMetadata) {
    this._metadata = metadata;
    this.parseMetadata(metadata);
  }

  get metadata(): ComponentMetadata {
    return this._metadata;
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

function preprocessMetadata(metadata: ComponentMetadata): TransformedComponentMetadata {
  if (metadata.configure) {
    if (Array.isArray(metadata.configure)) {
      return {
        ...metadata,
        configure: {
          props: metadata.configure,
        },
      };
    }
    return metadata as any;
  }

  return {
    ...metadata,
    configure: {},
  };
}

registerMetadataTransducer(metadata => {
  const { configure, componentName } = metadata;
  const { component = {} } = configure;
  if (!component.nestingRule) {
    let m;
    // uri match xx.Group set subcontrolling: true, childWhiteList
    if ((m = /^(.+)\.Group$/.exec(componentName))) {
      // component.subControlling = true;
      if (!component.nestingRule) {
        component.nestingRule = {
          childWhitelist: [`${m[1]}`],
        };
      }
    }
    // uri match xx.Node set selfControlled: false, parentWhiteList
    else if ((m = /^(.+)\.Node$/.exec(componentName))) {
      // component.selfControlled = false;
      component.nestingRule = {
        parentWhitelist: [`${m[1]}`, componentName],
      };
    }
    // uri match .Item .Node .Option set parentWhiteList
    else if ((m = /^(.+)\.(Item|Node|Option)$/.exec(componentName))) {
      component.nestingRule = {
        parentWhitelist: [`${m[1]}`],
      };
    }
  }
  if (component.isModal == null && /Dialog/.test(componentName)) {
    component.isModal = true;
  }
  return {
    ...metadata,
    configure: {
      ...configure,
      component,
    },
  };
});

const builtinComponentActions: ComponentAction[] = [
  {
    name: 'remove',
    content: {
      icon: Remove,
      description: intl('remove'),
      action(node: Node) {
        node.remove();
      },
    },
    important: true,
  },
  {
    name: 'copy',
    content: {
      icon: Clone,
      description: intl('copy'),
      action(node: Node) {
        // node.remove();
      },
    },
    important: true,
  },
];
