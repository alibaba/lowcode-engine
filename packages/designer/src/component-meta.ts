import { ReactElement } from 'react';
import {
  IPublicTypeComponentMetadata,
  IPublicTypeNpmInfo,
  IPublicTypeNodeData,
  IPublicTypeNodeSchema,
  IPublicTypeTitleContent,
  IPublicTypeTransformedComponentMetadata,
  IPublicTypeNestingFilter,
  IPublicTypeI18nData,
  IPublicTypeFieldConfig,
  IPublicModelComponentMeta,
  IPublicTypeAdvanced,
  IPublicTypeDisposable,
  IPublicTypeLiveTextEditingConfig,
} from '@alilc/lowcode-types';
import { deprecate, isRegExp, isTitleConfig, isNode } from '@alilc/lowcode-utils';
import { computed, createModuleEventBus, IEventBus } from '@alilc/lowcode-editor-core';
import { Node, INode } from './document';
import { Designer } from './designer';
import {
  IconContainer,
  IconPage,
  IconComponent,
} from './icons';

export function ensureAList(list?: string | string[]): string[] | null {
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

export function buildFilter(rule?: string | string[] | RegExp | IPublicTypeNestingFilter) {
  if (!rule) {
    return null;
  }
  if (typeof rule === 'function') {
    return rule;
  }
  if (isRegExp(rule)) {
    return (testNode: Node | IPublicTypeNodeSchema) => rule.test(testNode.componentName);
  }
  const list = ensureAList(rule);
  if (!list) {
    return null;
  }
  return (testNode: Node | IPublicTypeNodeSchema) => list.includes(testNode.componentName);
}

export interface IComponentMeta extends IPublicModelComponentMeta<INode> {
  prototype?: any;

  liveTextEditing?: IPublicTypeLiveTextEditingConfig[];

  get rootSelector(): string | undefined;

  setMetadata(metadata: IPublicTypeComponentMetadata): void;

  onMetadataChange(fn: (args: any) => void): IPublicTypeDisposable;
}

export class ComponentMeta implements IComponentMeta {
  readonly isComponentMeta = true;

  private _npm?: IPublicTypeNpmInfo;

  private emitter: IEventBus = createModuleEventBus('ComponentMeta');

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

  private _transformedMetadata?: IPublicTypeTransformedComponentMetadata;

  get configure(): IPublicTypeFieldConfig[] {
    const config = this._transformedMetadata?.configure;
    return config?.combined || config?.props || [];
  }

  private _liveTextEditing?: IPublicTypeLiveTextEditingConfig[];

  get liveTextEditing() {
    return this._liveTextEditing;
  }

  private _isTopFixed?: boolean;

  get isTopFixed(): boolean {
    return !!(this._isTopFixed);
  }

  private parentWhitelist?: IPublicTypeNestingFilter | null;

  private childWhitelist?: IPublicTypeNestingFilter | null;

  private _title?: IPublicTypeTitleContent;

  private _isMinimalRenderUnit?: boolean;

  get title(): string | IPublicTypeI18nData | ReactElement {
    // string | i18nData | ReactElement
    // TitleConfig title.label
    if (isTitleConfig(this._title)) {
      return (this._title?.label as any) || this.componentName;
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

  get advanced(): IPublicTypeAdvanced {
    return this.getMetadata().configure.advanced || {};
  }

  /**
   * @legacy compatiable for vision
   * @deprecated
   */
  prototype?: any;

  constructor(readonly designer: Designer, metadata: IPublicTypeComponentMetadata) {
    this.parseMetadata(metadata);
  }

  setNpm(info: IPublicTypeNpmInfo) {
    if (!this._npm) {
      this._npm = info;
    }
  }

  private parseMetadata(metadata: IPublicTypeComponentMetadata) {
    const { componentName, npm, ...others } = metadata;
    let _metadata = metadata;
    if ((metadata as any).prototype) {
      this.prototype = (metadata as any).prototype;
    }
    if (!npm && !Object.keys(others).length) {
      // 没有注册的组件，只能删除，不支持复制、移动等操作
      _metadata = {
        componentName,
        configure: {
          component: {
            disableBehaviors: ['copy', 'move', 'lock', 'unlock'],
          },
          advanced: {
            callbacks: {
              onMoveHook: () => false,
            },
          },
        },
      };
    }
    this._npm = npm || this._npm;
    this._componentName = componentName;

    // 额外转换逻辑
    this._transformedMetadata = this.transformMetadata(_metadata);

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

    const liveTextEditing = this.advanced.liveTextEditing || [];

    function collectLiveTextEditing(items: IPublicTypeFieldConfig[]) {
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

    const isTopFixed = this.advanced.isTopFixed;

    if (isTopFixed) {
      this._isTopFixed = isTopFixed;
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

  private transformMetadata(
      metadta: IPublicTypeComponentMetadata,
    ): IPublicTypeTransformedComponentMetadata {
    const registeredTransducers = this.designer.componentActions.getRegisteredMetadataTransducers();
    const result = registeredTransducers.reduce((prevMetadata, current) => {
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

  isRootComponent(includeBlock = true): boolean {
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
    actions = this.designer.componentActions.actions.concat(
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

  setMetadata(metadata: IPublicTypeComponentMetadata) {
    this.parseMetadata(metadata);
  }

  getMetadata(): IPublicTypeTransformedComponentMetadata {
    return this._transformedMetadata!;
  }

  checkNestingUp(my: INode | IPublicTypeNodeData, parent: INode) {
    // 检查父子关系，直接约束型，在画布中拖拽直接掠过目标容器
    if (this.parentWhitelist) {
      return this.parentWhitelist(
        parent.internalToShellNode(),
        isNode<INode>(my) ? my.internalToShellNode() : my,
      );
    }
    return true;
  }

  checkNestingDown(my: INode, target: INode | IPublicTypeNodeSchema | IPublicTypeNodeSchema[]): boolean {
    // 检查父子关系，直接约束型，在画布中拖拽直接掠过目标容器
    if (this.childWhitelist) {
      const _target: any = !Array.isArray(target) ? [target] : target;
      return _target.every((item: Node | IPublicTypeNodeSchema) => {
        const _item = !isNode<INode>(item) ? new Node(my.document, item) : item;
        return (
          this.childWhitelist &&
          this.childWhitelist(_item.internalToShellNode(), my.internalToShellNode())
        );
      });
    }
    return true;
  }

  onMetadataChange(fn: (args: any) => void): IPublicTypeDisposable {
    this.emitter.on('metadata_change', fn);
    return () => {
      this.emitter.removeListener('metadata_change', fn);
    };
  }

}

export function isComponentMeta(obj: any): obj is ComponentMeta {
  return obj && obj.isComponentMeta;
}

function preprocessMetadata(metadata: IPublicTypeComponentMetadata): IPublicTypeTransformedComponentMetadata {
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
