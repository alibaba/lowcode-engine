import {
  ComponentMetadata,
  NpmInfo,
  NodeData,
  NodeSchema,
  ComponentAction,
  TitleContent,
  TransformedComponentMetadata,
  getRegisteredMetadataTransducers,
  registerMetadataTransducer,
  computed,
} from '@ali/lowcode-globals';
import { Node, NodeParent } from './document';
import { Designer } from './designer';
import { intl } from './locale';
import { IconContainer } from './icons/container';
import { IconPage } from './icons/page';
import { IconComponent } from './icons/component';
import { IconRemove } from './icons/remove';
import { IconClone } from './icons/clone';

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

export class ComponentMeta {
  readonly isComponentMeta = true;
  private _uri?: string;
  get uri(): string {
    return this._uri!;
  }
  private _npm?: NpmInfo;
  get npm() {
    return this._npm;
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
  private _transformedMetadata?: TransformedComponentMetadata;
  get configure() {
    const config = this._transformedMetadata?.configure;
    return config?.combined || config?.props || [];
  }

  private parentWhitelist?: string[] | null;
  private childWhitelist?: string[] | null;

  private _title?: TitleContent;
  get title() {
    return this._title || this.componentName;
  }

  @computed get icon() {
    // give Slot default icon
    return (
      this._transformedMetadata?.icon ||
      (this.componentName === 'Page' ? IconPage : this.isContainer ? IconContainer : IconComponent)
    );
  }

  private _acceptable?: boolean;
  get acceptable(): boolean {
    return this._acceptable!;
  }

  constructor(readonly designer: Designer, metadata: ComponentMetadata) {
    this.parseMetadata(metadata);
  }

  private parseMetadata(metadta: ComponentMetadata) {
    const { componentName, uri, npm } = metadta;
    this._npm = npm;
    this._uri = uri || (npm ? npmToURI(npm) : componentName);
    this._componentName = componentName;

    metadta.uri = this._uri;
    // 额外转换逻辑
    this._transformedMetadata = this.transformMetadata(metadta);

    const title = this._transformedMetadata.title;
    if (title && typeof title === 'string') {
      this._title = {
        type: 'i18n',
        'en-US': this.componentName,
        'zh-CN': title,
      };
    }

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
    const result = getRegisteredMetadataTransducers().reduce((prevMetadata, current) => {
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

  setMetadata(metadata: ComponentMetadata) {
    this.parseMetadata(metadata);
  }

  getMetadata(): TransformedComponentMetadata {
    return this._transformedMetadata!;
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
      icon: IconRemove,
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
      icon: IconClone,
      description: intl('copy'),
      action(node: Node) {
        // node.remove();
      },
    },
    important: true,
  },
];
