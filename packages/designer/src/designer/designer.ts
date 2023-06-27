import { ComponentType } from 'react';
import { obx, computed, autorun, makeObservable, IReactionPublic, IReactionOptions, IReactionDisposer } from '@alilc/lowcode-editor-core';
import {
  IPublicTypeProjectSchema,
  IPublicTypeComponentMetadata,
  IPublicTypeComponentAction,
  IPublicTypeNpmInfo,
  IPublicModelEditor,
  IPublicTypeCompositeObject,
  IPublicTypePropsList,
  IPublicTypeNodeSchema,
  IPublicTypePropsTransducer,
  IShellModelFactory,
  IPublicModelDragObject,
  IPublicTypeScrollable,
  IPublicModelScroller,
  IPublicTypeLocationData,
  IPublicEnumTransformStage,
  IPublicModelLocateEvent,
} from '@alilc/lowcode-types';
import { megreAssets, IPublicTypeAssetsJson, isNodeSchema, isDragNodeObject, isDragNodeDataObject, isLocationChildrenDetail, Logger } from '@alilc/lowcode-utils';
import { IProject, Project } from '../project';
import { Node, DocumentModel, insertChildren, INode } from '../document';
import { ComponentMeta, IComponentMeta } from '../component-meta';
import { INodeSelector, Component } from '../simulator';
import { Scroller } from './scroller';
import { Dragon, IDragon } from './dragon';
import { ActiveTracker, IActiveTracker } from './active-tracker';
import { Detecting } from './detecting';
import { DropLocation } from './location';
import { OffsetObserver, createOffsetObserver } from './offset-observer';
import { ISettingTopEntry, SettingTopEntry } from './setting';
import { BemToolsManager } from '../builtin-simulator/bem-tools/manager';
import { ComponentActions } from '../component-actions';

const logger = new Logger({ level: 'warn', bizName: 'designer' });

export interface DesignerProps {
  [key: string]: any;
  editor: IPublicModelEditor;
  shellModelFactory: IShellModelFactory;
  className?: string;
  style?: object;
  defaultSchema?: IPublicTypeProjectSchema;
  hotkeys?: object;
  viewName?: string;
  simulatorProps?: Record<string, any> | ((document: DocumentModel) => object);
  simulatorComponent?: ComponentType<any>;
  dragGhostComponent?: ComponentType<any>;
  suspensed?: boolean;
  componentMetadatas?: IPublicTypeComponentMetadata[];
  globalComponentActions?: IPublicTypeComponentAction[];
  onMount?: (designer: Designer) => void;
  onDragstart?: (e: IPublicModelLocateEvent) => void;
  onDrag?: (e: IPublicModelLocateEvent) => void;
  onDragend?: (
      e: { dragObject: IPublicModelDragObject; copy: boolean },
      loc?: DropLocation,
    ) => void;
}

export interface IDesigner {
  readonly shellModelFactory: IShellModelFactory;

  viewName: string | undefined;

  readonly project: IProject;

  get dragon(): IDragon;

  get activeTracker(): IActiveTracker;

  get componentActions(): ComponentActions;

  get editor(): IPublicModelEditor;

  get detecting(): Detecting;

  get simulatorComponent(): ComponentType<any> | undefined;

  createScroller(scrollable: IPublicTypeScrollable): IPublicModelScroller;

  refreshComponentMetasMap(): void;

  createOffsetObserver(nodeInstance: INodeSelector): OffsetObserver | null;

  /**
   * 创建插入位置，考虑放到 dragon 中
   */
  createLocation(locationData: IPublicTypeLocationData<INode>): DropLocation;

  get componentsMap(): { [key: string]: IPublicTypeNpmInfo | Component };

  loadIncrementalAssets(incrementalAssets: IPublicTypeAssetsJson): Promise<void>;

  getComponentMeta(
    componentName: string,
    generateMetadata?: () => IPublicTypeComponentMetadata | null,
  ): IComponentMeta;

  clearLocation(): void;

  createComponentMeta(data: IPublicTypeComponentMetadata): IComponentMeta | null;

  getComponentMetasMap(): Map<string, IComponentMeta>;

  addPropsReducer(reducer: IPublicTypePropsTransducer, stage: IPublicEnumTransformStage): void;

  postEvent(event: string, ...args: any[]): void;

  transformProps(props: IPublicTypeCompositeObject | IPublicTypePropsList, node: Node, stage: IPublicEnumTransformStage): IPublicTypeCompositeObject | IPublicTypePropsList;

  createSettingEntry(nodes: INode[]): ISettingTopEntry;

  autorun(effect: (reaction: IReactionPublic) => void, options?: IReactionOptions<any, any>): IReactionDisposer;
}

export class Designer implements IDesigner {
  dragon: IDragon;

  viewName: string | undefined;

  readonly componentActions = new ComponentActions();

  readonly activeTracker = new ActiveTracker();

  readonly detecting = new Detecting();

  readonly project: IProject;

  readonly editor: IPublicModelEditor;

  readonly bemToolsManager = new BemToolsManager(this);

  readonly shellModelFactory: IShellModelFactory;

  private _dropLocation?: DropLocation;

  private propsReducers = new Map<IPublicEnumTransformStage, IPublicTypePropsTransducer[]>();

  private _lostComponentMetasMap = new Map<string, ComponentMeta>();

  private props?: DesignerProps;

  private oobxList: OffsetObserver[] = [];

  private selectionDispose: undefined | (() => void);

  @obx.ref private _componentMetasMap = new Map<string, IComponentMeta>();

  @obx.ref private _simulatorComponent?: ComponentType<any>;

  @obx.ref private _simulatorProps?: Record<string, any> | ((project: IProject) => object);

  @obx.ref private _suspensed = false;

  get currentDocument() {
    return this.project.currentDocument;
  }

  get currentHistory() {
    return this.currentDocument?.history;
  }

  get currentSelection() {
    return this.currentDocument?.selection;
  }

  constructor(props: DesignerProps) {
    makeObservable(this);
    const { editor, viewName, shellModelFactory } = props;
    this.editor = editor;
    this.viewName = viewName;
    this.shellModelFactory = shellModelFactory;
    this.setProps(props);

    this.project = new Project(this, props.defaultSchema, viewName);

    this.dragon = new Dragon(this);
    this.dragon.onDragstart((e) => {
      this.detecting.enable = false;
      const { dragObject } = e;
      if (isDragNodeObject(dragObject)) {
        if (dragObject.nodes.length === 1) {
          if (dragObject.nodes[0].parent) {
            // ensure current selecting
            dragObject.nodes[0].select();
          } else {
            this.currentSelection?.clear();
          }
        }
      } else {
        this.currentSelection?.clear();
      }
      if (this.props?.onDragstart) {
        this.props.onDragstart(e);
      }
      this.postEvent('dragstart', e);
    });

    this.dragon.onDrag((e) => {
      if (this.props?.onDrag) {
        this.props.onDrag(e);
      }
      this.postEvent('drag', e);
    });

    this.dragon.onDragend((e) => {
      const { dragObject, copy } = e;
      logger.debug('onDragend: dragObject ', dragObject, ' copy ', copy);
      const loc = this._dropLocation;
      if (loc) {
        if (isLocationChildrenDetail(loc.detail) && loc.detail.valid !== false) {
          let nodes: INode[] | undefined;
          if (isDragNodeObject(dragObject)) {
            nodes = insertChildren(loc.target, [...dragObject.nodes], loc.detail.index, copy);
          } else if (isDragNodeDataObject(dragObject)) {
            // process nodeData
            const nodeData = Array.isArray(dragObject.data) ? dragObject.data : [dragObject.data];
            const isNotNodeSchema = nodeData.find((item) => !isNodeSchema(item));
            if (isNotNodeSchema) {
              return;
            }
            nodes = insertChildren(loc.target, nodeData, loc.detail.index);
          }
          if (nodes) {
            loc.document?.selection.selectAll(nodes.map((o) => o.id));
            setTimeout(() => this.activeTracker.track(nodes![0]), 10);
          }
        }
      }
      if (this.props?.onDragend) {
        this.props.onDragend(e, loc);
      }
      this.postEvent('dragend', e, loc);
      this.detecting.enable = true;
    });

    this.activeTracker.onChange(({ node, detail }) => {
      node.document?.simulator?.scrollToNode(node, detail);
    });

    let historyDispose: undefined | (() => void);
    const setupHistory = () => {
      if (historyDispose) {
        historyDispose();
        historyDispose = undefined;
      }
      this.postEvent('history.change', this.currentHistory);
      if (this.currentHistory) {
        const { currentHistory } = this;
        historyDispose = currentHistory.onStateChange(() => {
          this.postEvent('history.change', currentHistory);
        });
      }
    };
    this.project.onCurrentDocumentChange(() => {
      this.postEvent('current-document.change', this.currentDocument);
      this.postEvent('selection.change', this.currentSelection);
      this.postEvent('history.change', this.currentHistory);
      this.setupSelection();
      setupHistory();
    });
    this.postEvent('init', this);
    this.setupSelection();
    setupHistory();
  }

  setupSelection = () => {
    if (this.selectionDispose) {
      this.selectionDispose();
      this.selectionDispose = undefined;
    }
    const { currentSelection } = this;
    // TODO: 避免选中 Page 组件，默认选中第一个子节点；新增规则 或 判断 Live 模式
    if (
      currentSelection &&
      currentSelection.selected.length === 0 &&
      this.simulatorProps?.designMode === 'live'
    ) {
      const rootNodeChildrens = this.currentDocument?.getRoot()?.getChildren()?.children;
      if (rootNodeChildrens && rootNodeChildrens.length > 0) {
        currentSelection.select(rootNodeChildrens[0].id);
      }
    }
    this.postEvent('selection.change', currentSelection);
    if (currentSelection) {
      this.selectionDispose = currentSelection.onSelectionChange(() => {
        this.postEvent('selection.change', currentSelection);
      });
    }
  };

  postEvent(event: string, ...args: any[]) {
    this.editor.eventBus.emit(`designer.${event}`, ...args);
  }

  get dropLocation() {
    return this._dropLocation;
  }

  /**
   * 创建插入位置，考虑放到 dragon 中
   */
  createLocation(locationData: IPublicTypeLocationData<INode>): DropLocation {
    const loc = new DropLocation(locationData);
    if (this._dropLocation && this._dropLocation.document && this._dropLocation.document !== loc.document) {
      this._dropLocation.document.dropLocation = null;
    }
    this._dropLocation = loc;
    this.postEvent('dropLocation.change', loc);
    if (loc.document) {
      loc.document.dropLocation = loc;
    }
    this.activeTracker.track({ node: loc.target, detail: loc.detail });
    return loc;
  }

  /**
   * 清除插入位置
   */
  clearLocation() {
    if (this._dropLocation && this._dropLocation.document) {
      this._dropLocation.document.dropLocation = null;
    }
    this.postEvent('dropLocation.change', undefined);
    this._dropLocation = undefined;
  }

  createScroller(scrollable: IPublicTypeScrollable): IPublicModelScroller {
    return new Scroller(scrollable);
  }

  createOffsetObserver(nodeInstance: INodeSelector): OffsetObserver | null {
    const oobx = createOffsetObserver(nodeInstance);
    this.clearOobxList();
    if (oobx) {
      this.oobxList.push(oobx);
    }
    return oobx;
  }

  private clearOobxList(force?: boolean) {
    let l = this.oobxList.length;
    if (l > 20 || force) {
      while (l-- > 0) {
        if (this.oobxList[l].isPurged()) {
          this.oobxList.splice(l, 1);
        }
      }
    }
  }

  touchOffsetObserver() {
    this.clearOobxList(true);
    this.oobxList.forEach((item) => item.compute());
  }

  createSettingEntry(nodes: INode[]): ISettingTopEntry {
    return new SettingTopEntry(this.editor, nodes);
  }

  /**
   * 获得合适的插入位置
   * @deprecated
   */
  getSuitableInsertion(
    insertNode?: INode | IPublicTypeNodeSchema | IPublicTypeNodeSchema[],
  ): { target: INode; index?: number } | null {
    const activeDoc = this.project.currentDocument;
    if (!activeDoc) {
      return null;
    }
    if (
      Array.isArray(insertNode) &&
      isNodeSchema(insertNode[0]) &&
      this.getComponentMeta(insertNode[0].componentName).isModal
    ) {
      return {
        target: activeDoc.rootNode as INode,
      };
    }
    const focusNode = activeDoc.focusNode!;
    const nodes = activeDoc.selection.getNodes();
    const refNode = nodes.find((item) => focusNode.contains(item));
    let target;
    let index: number | undefined;
    if (!refNode || refNode === focusNode) {
      target = focusNode;
    } else if (refNode.componentMeta.isContainer) {
      target = refNode;
    } else {
      // FIXME!!, parent maybe null
      target = refNode.parent!;
      index = (refNode.index || 0) + 1;
    }

    if (target && insertNode && !target.componentMeta.checkNestingDown(target, insertNode)) {
      return null;
    }

    return { target, index };
  }

  setProps(nextProps: DesignerProps) {
    const props = this.props ? { ...this.props, ...nextProps } : nextProps;
    if (this.props) {
      // check hotkeys
      // TODO:
      // check simulatorConfig
      if (props.simulatorComponent !== this.props.simulatorComponent) {
        this._simulatorComponent = props.simulatorComponent;
      }
      if (props.simulatorProps !== this.props.simulatorProps) {
        this._simulatorProps = props.simulatorProps;
        // 重新 setupSelection
        if (props.simulatorProps?.designMode !== this.props.simulatorProps?.designMode) {
          this.setupSelection();
        }
      }
      if (props.suspensed !== this.props.suspensed && props.suspensed != null) {
        this.suspensed = props.suspensed;
      }
      if (
        props.componentMetadatas !== this.props.componentMetadatas &&
        props.componentMetadatas != null
      ) {
        this.buildComponentMetasMap(props.componentMetadatas);
      }
    } else {
      // init hotkeys
      // todo:
      // init simulatorConfig
      if (props.simulatorComponent) {
        this._simulatorComponent = props.simulatorComponent;
      }
      if (props.simulatorProps) {
        this._simulatorProps = props.simulatorProps;
      }
      // init suspensed
      if (props.suspensed != null) {
        this.suspensed = props.suspensed;
      }
      if (props.componentMetadatas != null) {
        this.buildComponentMetasMap(props.componentMetadatas);
      }
    }
    this.props = props;
  }

  async loadIncrementalAssets(incrementalAssets: IPublicTypeAssetsJson): Promise<void> {
    const { components, packages } = incrementalAssets;
    components && this.buildComponentMetasMap(components);
    if (packages) {
      await this.project.simulator?.setupComponents(packages);
    }

    if (components) {
      // 合并 assets
      let assets = this.editor.get('assets') || {};
      let newAssets = megreAssets(assets, incrementalAssets);
      // 对于 assets 存在需要二次网络下载的过程，必须 await 等待结束之后，再进行事件触发
      await this.editor.set('assets', newAssets);
    }
    // TODO: 因为涉及修改 prototype.view，之后在 renderer 里修改了 vc 的 view 获取逻辑后，可删除
    this.refreshComponentMetasMap();
    // 完成加载增量资源后发送事件，方便插件监听并处理相关逻辑
    this.editor.eventBus.emit('designer.incrementalAssetsReady');
  }

  /**
   * 刷新 componentMetasMap，可间接触发模拟器里的 buildComponents
   */
  refreshComponentMetasMap() {
    this._componentMetasMap = new Map(this._componentMetasMap);
  }

  get(key: string): any {
    return this.props?.[key];
  }

  @computed get simulatorComponent(): ComponentType<any> | undefined {
    return this._simulatorComponent;
  }

  @computed get simulatorProps(): Record<string, any> {
    if (typeof this._simulatorProps === 'function') {
      return this._simulatorProps(this.project);
    }
    return this._simulatorProps || {};
  }

  /**
   * 提供给模拟器的参数
   */
  @computed get projectSimulatorProps(): any {
    return {
      ...this.simulatorProps,
      project: this.project,
      designer: this,
      onMount: (simulator: any) => {
        this.project.mountSimulator(simulator);
        this.editor.set('simulator', simulator);
      },
    };
  }

  get suspensed(): boolean {
    return this._suspensed;
  }

  set suspensed(flag: boolean) {
    this._suspensed = flag;
    // Todo afterwards...
    if (flag) {
      // this.project.suspensed = true?
    }
  }

  get schema(): IPublicTypeProjectSchema {
    return this.project.getSchema();
  }

  setSchema(schema?: IPublicTypeProjectSchema) {
    this.project.load(schema);
  }

  buildComponentMetasMap(metas: IPublicTypeComponentMetadata[]) {
    metas.forEach((data) => this.createComponentMeta(data));
  }

  createComponentMeta(data: IPublicTypeComponentMetadata): IComponentMeta | null {
    const key = data.componentName;
    if (!key) {
      return null;
    }
    let meta = this._componentMetasMap.get(key);
    if (meta) {
      meta.setMetadata(data);

      this._componentMetasMap.set(key, meta);
    } else {
      meta = this._lostComponentMetasMap.get(key);

      if (meta) {
        meta.setMetadata(data);
        this._lostComponentMetasMap.delete(key);
      } else {
        meta = new ComponentMeta(this, data);
      }

      this._componentMetasMap.set(key, meta);
    }
    return meta;
  }

  getGlobalComponentActions(): IPublicTypeComponentAction[] | null {
    return this.props?.globalComponentActions || null;
  }

  getComponentMeta(
    componentName: string,
    generateMetadata?: () => IPublicTypeComponentMetadata | null,
  ): IComponentMeta {
    if (this._componentMetasMap.has(componentName)) {
      return this._componentMetasMap.get(componentName)!;
    }

    if (this._lostComponentMetasMap.has(componentName)) {
      return this._lostComponentMetasMap.get(componentName)!;
    }

    const meta = new ComponentMeta(this, {
      componentName,
      ...(generateMetadata ? generateMetadata() : null),
    });

    this._lostComponentMetasMap.set(componentName, meta);

    return meta;
  }

  getComponentMetasMap() {
    return this._componentMetasMap;
  }

  @computed get componentsMap(): { [key: string]: IPublicTypeNpmInfo | Component } {
    const maps: any = {};
    const designer = this;
    designer._componentMetasMap.forEach((config, key) => {
      const metaData = config.getMetadata();
      if (metaData.devMode === 'lowCode') {
        maps[key] = metaData.schema;
      } else {
        const { view } = config.advanced;
        if (view) {
          maps[key] = view;
        } else {
          maps[key] = config.npm;
        }
      }
    });
    return maps;
  }

  transformProps(props: IPublicTypeCompositeObject | IPublicTypePropsList, node: Node, stage: IPublicEnumTransformStage) {
    if (Array.isArray(props)) {
      // current not support, make this future
      return props;
    }

    const reducers = this.propsReducers.get(stage);
    if (!reducers) {
      return props;
    }

    return reducers.reduce((xprops, reducer) => {
      try {
        return reducer(xprops, node.internalToShellNode() as any, { stage });
      } catch (e) {
        // todo: add log
        console.warn(e);
        return xprops;
      }
    }, props);
  }

  addPropsReducer(reducer: IPublicTypePropsTransducer, stage: IPublicEnumTransformStage) {
    if (!reducer) {
      logger.error('reducer is not available');
      return;
    }
    const reducers = this.propsReducers.get(stage);
    if (reducers) {
      reducers.push(reducer);
    } else {
      this.propsReducers.set(stage, [reducer]);
    }
  }

  autorun(effect: (reaction: IReactionPublic) => void, options?: IReactionOptions<any, any>): IReactionDisposer {
    return autorun(effect, options);
  }

  purge() {
    // TODO:
  }
}
