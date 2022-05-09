import { ComponentType } from 'react';
import { obx, computed, autorun, makeObservable, IReactionPublic, IReactionOptions, IReactionDisposer } from '@alilc/lowcode-editor-core';
import {
  ProjectSchema,
  ComponentMetadata,
  ComponentAction,
  NpmInfo,
  IEditor,
  CompositeObject,
  PropsList,
  isNodeSchema,
  NodeSchema,
} from '@alilc/lowcode-types';
import { megreAssets, AssetsJson } from '@alilc/lowcode-utils';
import { Project } from '../project';
import { Node, DocumentModel, insertChildren, ParentalNode, TransformStage } from '../document';
import { ComponentMeta } from '../component-meta';
import { INodeSelector, Component } from '../simulator';
import { Scroller, IScrollable } from './scroller';
import { Dragon, isDragNodeObject, isDragNodeDataObject, LocateEvent, DragObject } from './dragon';
import { ActiveTracker } from './active-tracker';
import { Detecting } from './detecting';
import { DropLocation, LocationData, isLocationChildrenDetail } from './location';
import { OffsetObserver, createOffsetObserver } from './offset-observer';
import { focusing } from './focusing';
import { SettingTopEntry } from './setting';
import { BemToolsManager } from '../builtin-simulator/bem-tools/manager';

export interface DesignerProps {
  editor: IEditor;
  className?: string;
  style?: object;
  defaultSchema?: ProjectSchema;
  hotkeys?: object;
  simulatorProps?: object | ((document: DocumentModel) => object);
  simulatorComponent?: ComponentType<any>;
  dragGhostComponent?: ComponentType<any>;
  suspensed?: boolean;
  componentMetadatas?: ComponentMetadata[];
  globalComponentActions?: ComponentAction[];
  onMount?: (designer: Designer) => void;
  onDragstart?: (e: LocateEvent) => void;
  onDrag?: (e: LocateEvent) => void;
  onDragend?: (e: { dragObject: DragObject; copy: boolean }, loc?: DropLocation) => void;
  [key: string]: any;
}

export class Designer {
  readonly dragon = new Dragon(this);

  readonly activeTracker = new ActiveTracker();

  readonly detecting = new Detecting();

  readonly project: Project;

  readonly editor: IEditor;

  readonly bemToolsManager = new BemToolsManager(this);

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
    const { editor } = props;
    this.editor = editor;
    this.setProps(props);

    this.project = new Project(this, props.defaultSchema);

    let startTime: any;
    let src = '';
    this.dragon.onDragstart((e) => {
      startTime = Date.now() / 1000;
      this.detecting.enable = false;
      const { dragObject } = e;
      if (isDragNodeObject(dragObject)) {
        const node = dragObject.nodes[0]?.parent;
        const npm = node?.componentMeta?.npm;
        src =
          [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
          node?.componentMeta?.componentName ||
          '';
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
      const loc = this._dropLocation;
      if (loc) {
        if (isLocationChildrenDetail(loc.detail) && loc.detail.valid !== false) {
          let nodes: Node[] | undefined;
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
            loc.document.selection.selectAll(nodes.map((o) => o.id));
            setTimeout(() => this.activeTracker.track(nodes![0]), 10);
            const endTime: any = Date.now() / 1000;
            const parent = nodes[0]?.parent;
            const npm = parent?.componentMeta?.npm;
            const dest =
              [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
              parent?.componentMeta?.componentName ||
              '';
            // eslint-disable-next-line no-unused-expressions
            // this.postEvent('drag', {
            //   time: (endTime - startTime).toFixed(2),
            //   selected: nodes
            //     ?.map((n) => {
            //       if (!n) {
            //         return;
            //       }
            //       // eslint-disable-next-line no-shadow
            //       const npm = n?.componentMeta?.npm;
            //       return (
            //         [npm?.package, npm?.componentName].filter((item) => !!item).join('-') ||
            //         n?.componentMeta?.componentName
            //       );
            //     })
            //     .join('&'),
            //   align: loc?.detail?.near?.align || '',
            //   pos: loc?.detail?.near?.pos || '',
            //   src,
            //   dest,
            // });
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
      node.document.simulator?.scrollToNode(node, detail);
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

    // TODO: 先简单实现，后期通过焦点赋值
    focusing.focusDesigner = this;
  }

  setupSelection = () => {
    let selectionDispose: undefined | (() => void);
    if (selectionDispose) {
      selectionDispose();
      selectionDispose = undefined;
    }
    const { currentSelection } = this;
    // TODO: 避免选中 Page 组件，默认选中第一个子节点；新增规则 或 判断 Live 模式
    if (
      currentSelection &&
      currentSelection.selected.length === 0 &&
      this.simulatorProps?.designMode === 'live'
    ) {
      const rootNodeChildrens = this.currentDocument.getRoot().getChildren().children;
      if (rootNodeChildrens.length > 0) {
        currentSelection.select(rootNodeChildrens[0].id);
      }
    }
    this.postEvent('selection.change', currentSelection);
    if (currentSelection) {
      selectionDispose = currentSelection.onSelectionChange(() => {
        this.postEvent('selection.change', currentSelection);
      });
    }
  };

  postEvent(event: string, ...args: any[]) {
    this.editor.emit(`designer.${event}`, ...args);
  }

  private _dropLocation?: DropLocation;

  get dropLocation() {
    return this._dropLocation;
  }

  /**
   * 创建插入位置，考虑放到 dragon 中
   */
  createLocation(locationData: LocationData): DropLocation {
    const loc = new DropLocation(locationData);
    if (this._dropLocation && this._dropLocation.document !== loc.document) {
      this._dropLocation.document.internalSetDropLocation(null);
    }
    this._dropLocation = loc;
    this.postEvent('dropLocation.change', loc);
    loc.document.internalSetDropLocation(loc);
    this.activeTracker.track({ node: loc.target, detail: loc.detail });
    return loc;
  }

  /**
   * 清除插入位置
   */
  clearLocation() {
    if (this._dropLocation) {
      this._dropLocation.document.internalSetDropLocation(null);
    }
    this.postEvent('dropLocation.change', undefined);
    this._dropLocation = undefined;
  }

  createScroller(scrollable: IScrollable) {
    return new Scroller(scrollable);
  }

  private oobxList: OffsetObserver[] = [];

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

  createSettingEntry(nodes: Node[]) {
    return new SettingTopEntry(this.editor, nodes);
  }

  /**
   * 获得合适的插入位置
   */
  getSuitableInsertion(
    insertNode?: Node | NodeSchema | NodeSchema[],
  ): { target: ParentalNode; index?: number } | null {
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
        target: activeDoc.rootNode as ParentalNode,
      };
    }
    const focusNode = activeDoc.focusNode!;
    const nodes = activeDoc.selection.getNodes();
    const refNode = nodes.find(item => focusNode.contains(item));
    let target;
    let index: number | undefined;
    if (!refNode || refNode === focusNode) {
      target = focusNode;
    } else if (refNode.componentMeta.isContainer) {
      target = refNode;
    } else {
      // FIXME!!, parent maybe null
      target = refNode.parent!;
      index = refNode.index + 1;
    }

    if (target && insertNode && !target.componentMeta.checkNestingDown(target, insertNode)) {
      return null;
    }

    return { target, index };
  }

  private props?: DesignerProps;

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

  async loadIncrementalAssets(incrementalAssets: AssetsJson): Promise<void> {
    const { components, packages } = incrementalAssets;
    components && this.buildComponentMetasMap(components);
    if (packages) {
      await this.project.simulator!.setupComponents(packages);
    }

    if (components) {
      // 合并assets
      let assets = this.editor.get('assets');
      let newAssets = megreAssets(assets, incrementalAssets);
      this.editor.set('assets', newAssets);
    }
    // TODO: 因为涉及修改 prototype.view，之后在 renderer 里修改了 vc 的 view 获取逻辑后，可删除
    this.refreshComponentMetasMap();
    // 完成加载增量资源后发送事件，方便插件监听并处理相关逻辑
    this.editor.emit('designer.incrementalAssetsReady');
  }

  /**
   * 刷新 componentMetasMap，可间接触发模拟器里的 buildComponents
   */
  refreshComponentMetasMap() {
    this._componentMetasMap = new Map(this._componentMetasMap);
  }

  get(key: string): any {
    return this.props ? this.props[key] : null;
  }

  @obx.ref private _simulatorComponent?: ComponentType<any>;

  @computed get simulatorComponent(): ComponentType<any> | undefined {
    return this._simulatorComponent;
  }

  @obx.ref private _simulatorProps?: object | ((document: DocumentModel) => object);

  @computed get simulatorProps(): object | ((project: Project) => object) {
    return this._simulatorProps || {};
  }

  @obx.ref private _suspensed = false;

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

  get schema(): ProjectSchema {
    return this.project.getSchema();
  }

  setSchema(schema?: ProjectSchema) {
    this.project.load(schema);
  }

  @obx.ref private _componentMetasMap = new Map<string, ComponentMeta>();

  private _lostComponentMetasMap = new Map<string, ComponentMeta>();

  buildComponentMetasMap(metas: ComponentMetadata[]) {
    metas.forEach((data) => this.createComponentMeta(data));
  }

  createComponentMeta(data: ComponentMetadata): ComponentMeta {
    const key = data.componentName;
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

  getGlobalComponentActions(): ComponentAction[] | null {
    return this.props?.globalComponentActions || null;
  }

  getComponentMeta(
    componentName: string,
    generateMetadata?: () => ComponentMetadata | null,
  ): ComponentMeta {
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

  @computed get componentsMap(): { [key: string]: NpmInfo | Component } {
    const maps: any = {};
    const designer = this;
    designer._componentMetasMap.forEach((config, key) => {
      const metaData = config.getMetadata();
      if (metaData.devMode === 'lowCode') {
        maps[key] = metaData.schema;
      } else {
        const view = metaData.configure.advanced?.view;
        if (view) {
          maps[key] = view;
        } else {
          maps[key] = config.npm;
        }
      }
    });
    return maps;
  }

  private propsReducers = new Map<TransformStage, PropsReducer[]>();

  transformProps(props: CompositeObject | PropsList, node: Node, stage: TransformStage) {
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

  addPropsReducer(reducer: PropsReducer, stage: TransformStage) {
    const reducers = this.propsReducers.get(stage);
    if (reducers) {
      reducers.push(reducer);
    } else {
      this.propsReducers.set(stage, [reducer]);
    }
  }

  autorun(effect: (reaction: IReactionPublic) => void, options?: IReactionOptions): IReactionDisposer {
    return autorun(effect, options);
  }

  purge() {
    // TODO:
  }
}

export type PropsReducerContext = { stage: TransformStage };
export type PropsReducer = (
  props: CompositeObject,
  node: Node,
  ctx?: PropsReducerContext,
) => CompositeObject;
