import { ReactElement } from 'react';
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
} from '@alilc/lowcode-types';
import { deprecate } from '@alilc/lowcode-utils';
import { computed, engineConfig } from '@alilc/lowcode-editor-core';
import EventEmitter from 'events';
import { componentDefaults, legacyIssues } from './transducers';
import { isNode, Node, ParentalNode } from './document';
import { Designer } from './designer';
import { intlNode } from './locale';
import {
  IconLock,
  IconUnlock,
  IconContainer,
  IconPage,
  IconComponent,
  IconRemove,
  IconClone,
  IconHidden,
} from './icons';

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

  private emitter: EventEmitter = new EventEmitter();

  get npm() {
    return this._npm;
  }

  set npm(_npm: any) {
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

  get isMinimalRenderUnit(): boolean {
    return this._isMinimalRenderUnit || false;
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

  private _isMinimalRenderUnit?: boolean;

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
    // give Slot default icon
    // if _title is TitleConfig  get _title.icon
    return (
      this._transformedMetadata?.icon ||
      // eslint-disable-next-line
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
    this._npm = npm || this._npm;
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

    const liveTextEditing = this._transformedMetadata.configure.advanced?.liveTextEditing || [];

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

    const isTopFiexd = this._transformedMetadata.configure.advanced?.isTopFixed;

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
      this._isMinimalRenderUnit = component.isMinimalRenderUnit;
      if (component.nestingRule) {
        const { parentWhitelist, childWhitelist } = component.nestingRule;
        this.parentWhitelist = buildFilter(parentWhitelist);
        this.childWhitelist = buildFilter(childWhitelist);
      }
    } else {
      this._isContainer = false;
      this._isModal = false;
    }
    this.emitter.emit('metadata_change');
  }

  refreshMetadata() {
    this.parseMetadata(this.getMetadata());
  }

  private transformMetadata(metadta: ComponentMetadata): TransformedComponentMetadata {
    const result = getRegisteredMetadataTransducers().reduce((prevMetadata, current) => {
      return current(prevMetadata);
    }, preprocessMetadata(metadta));

    if (!result.configure) {
      result.configure = {};
    }
    if (result.experimental && !result.configure.advanced) {
      deprecate(result.experimental, '.experimental', '.configure.advanced');
      result.configure.advanced = result.experimental;
    }
    return result as any;
  }

  isRootComponent(includeBlock = true) {
    return (
      this.componentName === 'Page' ||
      this.componentName === 'Component' ||
      (includeBlock && this.componentName === 'Block')
    );
  }

  @computed get availableActions() {
    // eslint-disable-next-line prefer-const
    let { disableBehaviors, actions } = this._transformedMetadata?.configure.component || {};
    const disabled =
      ensureAList(disableBehaviors) ||
      (this.isRootComponent(false) ? ['copy', 'remove', 'lock', 'unlock'] : null);
    actions = builtinComponentActions.concat(
      this.designer.getGlobalComponentActions() || [],
      actions || [],
    );

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
      return this.parentWhitelist(
        parent.internalToShellNode(),
        isNode(my) ? my.internalToShellNode() : my,
      );
    }
    return true;
  }

  checkNestingDown(my: Node, target: Node | NodeSchema | NodeSchema[]) {
    // 检查父子关系，直接约束型，在画布中拖拽直接掠过目标容器
    if (this.childWhitelist) {
      const _target: any = !Array.isArray(target) ? [target] : target;
      return _target.every((item: Node | NodeSchema) => {
        const _item = !isNode(item) ? new Node(my.document, item) : item;
        return (
          this.childWhitelist &&
          this.childWhitelist(_item.internalToShellNode(), my.internalToShellNode())
        );
      });
    }
    return true;
  }

  onMetadataChange(fn: (args: any) => void): () => void {
    this.emitter.on('metadata_change', fn);
    return () => {
      this.emitter.removeListener('metadata_change', fn);
    };
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

export function registerMetadataTransducer(
  transducer: MetadataTransducer,
  level = 100,
  id?: string,
) {
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
        node.setVisible(false);
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
          const { isRGL, rglNode } = node.getRGL();
          if (isRGL) {
            // 复制layout信息
            let layout = rglNode.getPropValue('layout') || [];
            let curLayout = layout.filter((item) => item.i === node.getPropValue('fieldId'));
            if (curLayout && curLayout[0]) {
              layout.push({
                ...curLayout[0],
                i: newNode.getPropValue('fieldId'),
              });
              rglNode.setPropValue('layout', layout);
              // 如果是磁贴块复制，则需要滚动到影响位置
              setTimeout(() => newNode.document.simulator?.scrollToNode(newNode), 10);
            }
          }
        }
      },
    },
    important: true,
  },
  {
    name: 'lock',
    content: {
      icon: IconLock, // 锁定 icon
      title: intlNode('lock'),
      action(node: Node) {
        node.lock();
      },
    },
    condition: (node: Node) => {
      return engineConfig.get('enableCanvasLock', false) && node.isContainer() && !node.isLocked;
    },
    important: true,
  },
  {
    name: 'unlock',
    content: {
      icon: IconUnlock, // 解锁 icon
      title: intlNode('unlock'),
      action(node: Node) {
        node.lock(false);
      },
    },
    condition: (node: Node) => {
      return engineConfig.get('enableCanvasLock', false) && node.isContainer() && node.isLocked;
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

export function modifyBuiltinComponentAction(
  actionName: string,
  handle: (action: ComponentAction) => void,
) {
  const builtinAction = builtinComponentActions.find((action) => action.name === actionName);
  if (builtinAction) {
    handle(builtinAction);
  }
}

registerMetadataTransducer(legacyIssues, 2, 'legacy-issues'); // should use a high level priority, eg: 2
registerMetadataTransducer(componentDefaults, 100, 'component-defaults');
