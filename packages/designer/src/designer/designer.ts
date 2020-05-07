import { ComponentType } from 'react';
import { obx, computed, autorun } from '@ali/lowcode-editor-core';
import {
  ProjectSchema,
  ComponentMetadata,
  ComponentAction,
  NpmInfo,
  IEditor,
  CompositeObject,
  PropsList,
} from '@ali/lowcode-types';
import { Project } from '../project';
import { Node, DocumentModel, insertChildren, isRootNode, ParentalNode, TransformStage } from '../document';
import { ComponentMeta } from '../component-meta';
import { INodeSelector, Component } from '../simulator';
import { Scroller, IScrollable } from './scroller';
import { Dragon, isDragNodeObject, isDragNodeDataObject, LocateEvent, DragObject } from './dragon';
import { ActiveTracker } from './active-tracker';
import { Hovering } from './hovering';
import { DropLocation, LocationData, isLocationChildrenDetail } from './location';
import { OffsetObserver, createOffsetObserver } from './offset-observer';
import { focusing } from './focusing';
import { SettingTopEntry } from './setting';

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
  readonly hovering = new Hovering();
  readonly project: Project;
  readonly editor: IEditor;

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
    const { editor } = props;
    this.editor = editor;
    this.setProps(props);

    this.project = new Project(this, props.defaultSchema);

    this.dragon.onDragstart((e) => {
      this.hovering.enable = false;
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
      const loc = this._dropLocation;
      if (loc) {
        if (isLocationChildrenDetail(loc.detail)) {
          let nodes: Node[] | undefined;
          if (isDragNodeObject(dragObject)) {
            nodes = insertChildren(loc.target, dragObject.nodes, loc.detail.index, copy);
          } else if (isDragNodeDataObject(dragObject)) {
            // process nodeData
            const nodeData = Array.isArray(dragObject.data) ? dragObject.data : [dragObject.data];
            nodes = insertChildren(loc.target, nodeData, loc.detail.index);
          }
          if (nodes) {
            loc.document.selection.selectAll(nodes.map((o) => o.id));
            setTimeout(() => this.activeTracker.track(nodes![0]), 10);
          }
        }
      }
      if (this.props?.onDragend) {
        this.props.onDragend(e, loc);
      }
      this.postEvent('dragend', e, loc);
      this.hovering.enable = true;
    });

    this.activeTracker.onChange(({ node, detail }) => {
      node.document.simulator?.scrollToNode(node, detail);
    });

    let selectionDispose: undefined | (() => void);
    const setupSelection = () => {
      if (selectionDispose) {
        selectionDispose();
        selectionDispose = undefined;
      }
      this.postEvent('selection.change', this.currentSelection);
      if (this.currentSelection) {
        const currentSelection = this.currentSelection;
        selectionDispose = currentSelection.onSelectionChange(() => {
          this.postEvent('selection.change', currentSelection);
        });
      }
    };
    let historyDispose: undefined | (() => void);
    const setupHistory = () => {
      if (historyDispose) {
        historyDispose();
        historyDispose = undefined;
      }
      this.postEvent('history.change', this.currentHistory);
      if (this.currentHistory) {
        const currentHistory = this.currentHistory;
        historyDispose = currentHistory.onStateChange(() => {
          this.postEvent('history.change', currentHistory);
        });
      }
    };
    this.project.onCurrentDocumentChange(() => {
      this.postEvent('current-document.change', this.currentDocument);
      this.postEvent('selection.change', this.currentSelection);
      this.postEvent('history.change', this.currentHistory);
      setupSelection();
      setupHistory();
    });
    this.postEvent('designer.init', this);
    setupSelection();
    setupHistory();

    // TODO: 先简单实现，后期通过焦点赋值
    focusing.focusDesigner = this;
  }

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
    this._dropLocation = undefined;
  }

  createScroller(scrollable: IScrollable) {
    return new Scroller(scrollable);
  }

  createOffsetObserver(nodeInstance: INodeSelector): OffsetObserver | null {
    return createOffsetObserver(nodeInstance);
  }

  createSettingEntry(editor: IEditor, nodes: Node[]) {
    return new SettingTopEntry(editor, nodes);
  }

  /**
   * 获得合适的插入位置
   */
  getSuitableInsertion(): { target: ParentalNode; index?: number } | null {
    const activedDoc = this.project.currentDocument;
    if (!activedDoc) {
      return null;
    }
    const nodes = activedDoc.selection.getNodes();
    let target;
    let index: number | undefined;
    if (!nodes || nodes.length < 1) {
      target = activedDoc.rootNode;
    } else {
      const node = nodes[0];
      if (isRootNode(node)) {
        target = node;
      } else {
        // FIXME!!, parent maybe null
        target = node.parent!;
        index = node.index + 1;
      }
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
      }
      if (props.suspensed !== this.props.suspensed && props.suspensed != null) {
        this.suspensed = props.suspensed;
      }
      if (props.componentMetadatas !== this.props.componentMetadatas && props.componentMetadatas != null) {
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

  get(key: string): any {
    return this.props ? this.props[key] : null;
  }

  @obx.ref private _simulatorComponent?: ComponentType<any>;

  @computed get simulatorComponent(): ComponentType<any> | undefined {
    return this._simulatorComponent;
  }

  @obx.ref private _simulatorProps?: object | ((document: DocumentModel) => object);

  @computed get simulatorProps(): object | ((document: DocumentModel) => object) {
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

  @obx.val private _componentMetasMap = new Map<string, ComponentMeta>();
  private _lostComponentMetasMap = new Map<string, ComponentMeta>();

  private buildComponentMetasMap(metas: ComponentMetadata[]) {
    metas.forEach((data) => this.createComponentMeta(data));
  }

  createComponentMeta(data: ComponentMetadata): ComponentMeta {
    const key = data.componentName;
    let meta = this._componentMetasMap.get(key);
    if (meta) {
      meta.setMetadata(data);
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

  getComponentMeta(componentName: string, generateMetadata?: () => ComponentMetadata | null): ComponentMeta {
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

  @computed get componentsMap(): { [key: string]: NpmInfo | Component } {
    const maps: any = {};
    this._componentMetasMap.forEach((config, key) => {
      const view = config.getMetadata().experimental?.view;
      if (view) {
        maps[key] = view;
      } else if (config.npm) {
        maps[key] = config.npm;
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

    return reducers.reduce((xprops, reducer) => reducer(xprops, node), props);
  }

  addPropsReducer(reducer: PropsReducer, stage: TransformStage) {
    const reducers = this.propsReducers.get(stage);
    if (reducers) {
      reducers.push(reducer);
    } else {
      this.propsReducers.set(stage, [reducer]);
    }
  }

  autorun(action: (context: { firstRun: boolean }) => void, sync = false): () => void {
    return autorun(action, sync as true);
  }

  purge() {
    // todo:
  }
}

export type PropsReducer = (props: CompositeObject, node: Node) => CompositeObject;
