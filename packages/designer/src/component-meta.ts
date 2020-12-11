import {
  ComponentMetadata,
  NpmInfo,
  NodeData,
  NodeSchema,
  ComponentAction,
  TitleContent,
  TransformedComponentMetadata,
  NestingFilter,
  isTitleConfig,
  I18nData,
  LiveTextEditingConfig,
  FieldConfig,
} from '@ali/lowcode-types';
import { computed } from '@ali/lowcode-editor-core';
import { isNode, Node, ParentalNode } from './document';
import { Designer } from './designer';
import { intlNode } from './locale';
import { IconContainer } from './icons/container';
import { IconPage } from './icons/page';
import { IconComponent } from './icons/component';
import { IconRemove } from './icons/remove';
import { IconClone } from './icons/clone';
import { ReactElement } from 'react';
import { IconHidden } from './icons/hidden';

function ensureAList(list?: string | string[]): string[] | null {
  if (!list) {
    return null;
  }
  if (!Array.isArray(list)) {
    if (typeof list !== 'string') {
      return null;
    }
    list = list.split(/ *[ ,|] */).filter(Boolean);
  }
  if (list.length < 1) {
    return null;
  }
  return list;
}

function isRegExp(obj: any): obj is RegExp {
  return obj && obj.test && obj.exec && obj.compile;
}

function buildFilter(rule?: string | string[] | RegExp | NestingFilter) {
  if (!rule) {
    return null;
  }
  if (typeof rule === 'function') {
    return rule;
  }
  if (isRegExp(rule)) {
    return (testNode: Node | NodeSchema) => rule.test(testNode.componentName);
  }
  const list = ensureAList(rule);
  if (!list) {
    return null;
  }
  return (testNode: Node | NodeSchema) => list.includes(testNode.componentName);
}

export class ComponentMeta {
  readonly isComponentMeta = true;

  private _npm?: NpmInfo;

  get npm() {
    return this._npm;
  }

  set npm(_npm) {
    this.setNpm(_npm);
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

  private _rootSelector?: string;

  get rootSelector(): string | undefined {
    return this._rootSelector;
  }

  private _transformedMetadata?: TransformedComponentMetadata;

  get configure() {
    const config = this._transformedMetadata?.configure;
    return config?.combined || config?.props || [];
  }

  private _liveTextEditing?: LiveTextEditingConfig[];

  get liveTextEditing() {
    return this._liveTextEditing;
  }

  private _isTopFixed?: boolean;

  get isTopFixed() {
    return this._isTopFixed;
  }

  private parentWhitelist?: NestingFilter | null;

  private childWhitelist?: NestingFilter | null;

  private _title?: TitleContent;

  get title(): string | I18nData | ReactElement {
    // TODO: 标记下。这块需要康师傅加一下API，页面正常渲染。
    // string | i18nData | ReactElement
    // TitleConfig  title.label
    if (isTitleConfig(this._title)) {
      return (this._title.label as any) || this.componentName;
    }
    return this._title || this.componentName;
  }

  @computed get icon() {
    // TODO: 标记下。这块需要康师傅加一下API，页面正常渲染。
    // give Slot default icon
    // if _title is TitleConfig  get _title.icon
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

  setNpm(info: NpmInfo) {
    if (!this._npm) {
      this._npm = info;
    }
  }

  private parseMetadata(metadata: ComponentMetadata) {
    const { componentName, npm } = metadata;
    this._npm = npm;
    this._componentName = componentName;

    // 额外转换逻辑
    this._transformedMetadata = this.transformMetadata(metadata);

    const { title } = this._transformedMetadata;
    if (title) {
      this._title =
        typeof title === 'string'
          ? {
            type: 'i18n',
            'en-US': this.componentName,
            'zh-CN': title,
          }
          : title;
    }

    const liveTextEditing = this._transformedMetadata.experimental?.liveTextEditing || [];

    function collectLiveTextEditing(items: FieldConfig[]) {
      items.forEach((config) => {
        if (config?.items) {
          collectLiveTextEditing(config.items);
        } else {
          const liveConfig = config.liveTextEditing || config.extraProps?.liveTextEditing;
          if (liveConfig) {
            liveTextEditing.push({
              propTarget: String(config.name),
              ...liveConfig,
            });
          }
        }
      });
    }
    collectLiveTextEditing(this.configure);
    this._liveTextEditing = liveTextEditing.length > 0 ? liveTextEditing : undefined;

    const isTopFiexd = this._transformedMetadata.experimental?.isTopFixed;

    if (isTopFiexd) {
      this._isTopFixed = isTopFiexd;
    }

    const { configure = {} } = this._transformedMetadata;
    this._acceptable = false;

    const { component } = configure;
    if (component) {
      this._isContainer = !!component.isContainer;
      this._isModal = !!component.isModal;
      this._descriptor = component.descriptor;
      this._rootSelector = component.rootSelector;
      if (component.nestingRule) {
        const { parentWhitelist, childWhitelist } = component.nestingRule;
        this.parentWhitelist = buildFilter(parentWhitelist);
        this.childWhitelist = buildFilter(childWhitelist);
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

  isRootComponent(includeBlock = true) {
    return this.componentName === 'Page' || this.componentName === 'Component' || (includeBlock && this.componentName === 'Block');
  }

  @computed get availableActions() {
    // eslint-disable-next-line prefer-const
    let { disableBehaviors, actions } = this._transformedMetadata?.configure.component || {};
    const disabled = ensureAList(disableBehaviors) || (this.isRootComponent(false) ? ['copy', 'remove'] : null);
    actions = builtinComponentActions.concat(this.designer.getGlobalComponentActions() || [], actions || []);

    if (disabled) {
      if (disabled.includes('*')) {
        return actions.filter((action) => action.condition === 'always');
      }
      return actions.filter((action) => disabled.indexOf(action.name) < 0);
    }
    return actions;
  }

  setMetadata(metadata: ComponentMetadata) {
    this.parseMetadata(metadata);
  }

  getMetadata(): TransformedComponentMetadata {
    return this._transformedMetadata!;
  }

  checkNestingUp(my: Node | NodeData, parent: ParentalNode) {
    // 检查父子关系，直接约束型，在画布中拖拽直接掠过目标容器
    if (this.parentWhitelist) {
      return this.parentWhitelist(parent, my);
    }
    return true;
  }

  checkNestingDown(my: Node, target: Node | NodeSchema | NodeSchema[]) {
    // 检查父子关系，直接约束型，在画布中拖拽直接掠过目标容器
    if (this.childWhitelist) {
      const _target: any = !Array.isArray(target) ? [target] : target;
      return _target.every((item: Node | NodeSchema) => {
        const _item = !isNode(item) ? new Node(my.document, item) : item;
        return this.childWhitelist && this.childWhitelist(_item, my);
      });
    }
    return true;
  }

  // compatiable vision
  prototype?: any;
}

export function isComponentMeta(obj: any): obj is ComponentMeta {
  return obj && obj.isComponentMeta;
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

export interface MetadataTransducer {
  (prev: TransformedComponentMetadata): TransformedComponentMetadata;
  /**
   * 0 - 9   system
   * 10 - 99 builtin-plugin
   * 100 -   app & plugin
   */
  level?: number;
  /**
   * use to replace TODO
   */
  id?: string;
}
const metadataTransducers: MetadataTransducer[] = [];

export function registerMetadataTransducer(transducer: MetadataTransducer, level = 100, id?: string) {
  transducer.level = level;
  transducer.id = id;
  const i = metadataTransducers.findIndex((item) => item.level != null && item.level > level);
  if (i < 0) {
    metadataTransducers.push(transducer);
  } else {
    metadataTransducers.splice(i, 0, transducer);
  }
}

export function getRegisteredMetadataTransducers(): MetadataTransducer[] {
  return metadataTransducers;
}

registerMetadataTransducer((metadata) => {
  const { configure, componentName } = metadata;
  const { component = {} } = configure;
  if (!component.nestingRule) {
    let m;
    // uri match xx.Group set subcontrolling: true, childWhiteList
    // eslint-disable-next-line no-cond-assign
    if ((m = /^(.+)\.Group$/.exec(componentName))) {
      // component.subControlling = true;
      if (!component.nestingRule) {
        component.nestingRule = {
          childWhitelist: [`${m[1]}`],
        };
      }
    // eslint-disable-next-line no-cond-assign
    } else if ((m = /^(.+)\.Node$/.exec(componentName))) {
      // uri match xx.Node set selfControlled: false, parentWhiteList
      // component.selfControlled = false;
      component.nestingRule = {
        parentWhitelist: [`${m[1]}`, componentName],
      };
    // eslint-disable-next-line no-cond-assign
    } else if ((m = /^(.+)\.(Item|Node|Option)$/.exec(componentName))) {
      // uri match .Item .Node .Option set parentWhiteList
      component.nestingRule = {
        parentWhitelist: [`${m[1]}`],
      };
    }
  }
  // if (component.isModal == null && /Dialog/.test(componentName)) {
  //   component.isModal = true;
  // }
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
      title: intlNode('remove'),
      action(node: Node) {
        node.remove();
      },
    },
    important: true,
  },
  {
    name: 'hide',
    content: {
      icon: IconHidden,
      title: intlNode('hide'),
      action(node: Node) {
        node.getExtraProp('hidden', true)?.setValue(true);
      },
    },
    condition: (node: Node) => {
      return node.componentMeta.isModal;
    },
    important: true,
  },
  {
    name: 'copy',
    content: {
      icon: IconClone,
      title: intlNode('copy'),
      action(node: Node) {
        // node.remove();
        const { document: doc, parent, index } = node;
        if (parent) {
          const newNode = doc.insertNode(parent, node, index + 1, true);
          newNode.select();
        }
      },
    },
    important: true,
  },
];

export function removeBuiltinComponentAction(name: string) {
  const i = builtinComponentActions.findIndex((action) => action.name === name);
  if (i > -1) {
    builtinComponentActions.splice(i, 1);
  }
}
export function addBuiltinComponentAction(action: ComponentAction) {
  builtinComponentActions.push(action);
}
