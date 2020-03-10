import { ComponentType as ReactComponentType } from 'react';
import { obx, computed, autorun } from '@recore/obx';
import BuiltinSimulatorView from '../builtins/simulator';
import Project from './project';
import { ProjectSchema } from './schema';
import Dragon, { isDragNodeObject, isDragNodeDataObject, LocateEvent, DragObject } from './helper/dragon';
import ActiveTracker from './helper/active-tracker';
import Hovering from './helper/hovering';
import Location, { LocationData, isLocationChildrenDetail } from './helper/location';
import DocumentModel from './document/document-model';
import Node, { insertChildren } from './document/node/node';
import { isRootNode } from './document/node/root-node';
import { ComponentDescription, ComponentType } from './component-type';
import Scroller, { IScrollable } from './helper/scroller';
import { INodeSelector } from './simulator';
import OffsetObserver, { createOffsetObserver } from './helper/offset-observer';
import { EventEmitter } from 'events';

export interface DesignerProps {
  className?: string;
  style?: object;
  defaultSchema?: ProjectSchema;
  hotkeys?: object;
  simulatorProps?: object | ((document: DocumentModel) => object);
  simulatorComponent?: ReactComponentType<any>;
  dragGhostComponent?: ReactComponentType<any>;
  suspensed?: boolean;
  componentsDescription?: ComponentDescription[];
  eventPipe?: EventEmitter;
  onMount?: (designer: Designer) => void;
  onDragstart?: (e: LocateEvent) => void;
  onDrag?: (e: LocateEvent) => void;
  onDragend?: (e: { dragObject: DragObject; copy: boolean }, loc?: Location) => void;
  [key: string]: any;
}

export default class Designer {
  // readonly hotkey: Hotkey;
  readonly dragon = new Dragon(this);
  readonly activeTracker = new ActiveTracker();
  readonly hovering = new Hovering();
  readonly project: Project;

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
    this.setProps(props);

    this.project = new Project(this, props.defaultSchema);

    this.dragon.onDragstart(e => {
      this.hovering.enable = false;
      const { dragObject } = e;
      if (isDragNodeObject(dragObject) && dragObject.nodes.length === 1) {
        // ensure current selecting
        dragObject.nodes[0].select();
      }
      if (this.props?.onDragstart) {
        this.props.onDragstart(e);
      }
      this.postEvent('dragstart', e);
    });

    this.dragon.onDrag(e => {
      if (this.props?.onDrag) {
        this.props.onDrag(e);
      }
      this.postEvent('drag', e);
    });

    this.dragon.onDragend(e => {
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
            loc.document.selection.selectAll(nodes.map(o => o.id));
            setTimeout(() => this.activeTracker.track(nodes![0]), 10);
          }
        }
      }
      this.clearLocation();
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
      if (this.currentSelection) {
        const currentSelection = this.currentSelection;
        selectionDispose = currentSelection.onSelectionChange(() => {
          this.postEvent('current-selection-change', currentSelection);
        });
      }
    }
    this.project.onCurrentDocumentChange(() => {
      this.postEvent('current-document-change', this.currentDocument);
      this.postEvent('current-selection-change', this.currentSelection);
      this.postEvent('current-history-change', this.currentHistory);
      setupSelection();
    });
    setupSelection();
  }

  postEvent(event: string, ...args: any[]) {
    this.props?.eventPipe?.emit(`designer.${event}`, ...args);
  }

  private _dropLocation?: Location;
  /**
   * 创建插入位置，考虑放到 dragon 中
   */
  createLocation(locationData: LocationData): Location {
    const loc = new Location(locationData);
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

  /**
   * 获得合适的插入位置
   */
  getSuitableInsertion() {
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
  setProps(props: DesignerProps) {
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
      if (props.componentsDescription !== this.props.componentsDescription && props.componentsDescription != null) {
        this.buildComponentTypesMap(props.componentsDescription);
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
      if (props.componentsDescription != null) {
        this.buildComponentTypesMap(props.componentsDescription);
      }
    }
    this.props = props;
  }

  get(key: string): any {
    return this.props ? this.props[key] : null;
  }

  @obx.ref private _simulatorComponent?: ReactComponentType<any>;

  @computed get simulatorComponent(): ReactComponentType<any> {
    return this._simulatorComponent || BuiltinSimulatorView;
  }

  @obx.ref private _simulatorProps?: object | ((document: DocumentModel) => object);

  @computed get simulatorProps(): object | ((document: DocumentModel) => object) {
    return this._simulatorProps || {};
  }

  @obx.ref private _suspensed: boolean = false;

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
    return this.project.schema;
  }

  set schema(schema: ProjectSchema) {
    // todo:
  }

  @obx.val private _componentTypesMap = new Map<string, ComponentType>();
  private _lostComponentTypesMap = new Map<string, ComponentType>();

  private buildComponentTypesMap(specs: ComponentDescription[]) {
    specs.forEach(spec => {
      const key = spec.componentName;
      let cType = this._componentTypesMap.get(key);
      if (cType) {
        cType.spec = spec;
      } else {
        cType = this._lostComponentTypesMap.get(key);

        if (cType) {
          cType.spec = spec;
          this._lostComponentTypesMap.delete(key);
        } else {
          cType = new ComponentType(spec);
        }

        this._componentTypesMap.set(key, cType);
      }
    });
  }

  getComponentType(componentName: string): ComponentType {
    if (this._componentTypesMap.has(componentName)) {
      return this._componentTypesMap.get(componentName)!;
    }

    if (this._lostComponentTypesMap.has(componentName)) {
      return this._lostComponentTypesMap.get(componentName)!;
    }

    const cType = new ComponentType({
      componentName,
    });

    this._lostComponentTypesMap.set(componentName, cType);

    return cType;
  }

  get componentsMap(): { [key: string]: ComponentDescription } {
    const maps: any = {};
    this._componentTypesMap.forEach((config, key) => {
      maps[key] = config.spec;
    });
    return maps;
  }

  autorun(action: (context: { firstRun: boolean }) => void, sync: boolean = false): () => void {
    return autorun(action, sync as true);
  }

  purge() {
    // todo:
  }
}
