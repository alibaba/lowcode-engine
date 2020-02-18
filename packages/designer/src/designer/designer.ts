import { ComponentType } from 'react';
import { obx, computed } from '@recore/obx';
import BuiltinSimulatorView from '../builtins/simulator';
import Project from './project';
import { ProjectSchema } from './schema';
import Dragon, { isDragNodeObject, isDragNodeDataObject, LocateEvent, DragObject } from './dragon';
import ActiveTracker from './active-tracker';
import Hovering from './hovering';
import Location, { LocationData, isLocationChildrenDetail } from './location';
import DocumentModel from './document/document-model';
import Node, { insertChildren } from './document/node/node';
import { isRootNode } from './document/node/root-node';
import { ComponentDescriptionSpec, ComponentConfig } from './document/node/component-config';
import Scroller, { IScrollable } from './scroller';
import { INodeInstance } from './simulator';
import OffsetObserver, { createOffsetObserver } from './offset-observer';

export interface DesignerProps {
  className?: string;
  style?: object;
  defaultSchema?: ProjectSchema;
  hotkeys?: object;
  simulatorProps?: object | ((document: DocumentModel) => object);
  simulatorComponent?: ComponentType<any>;
  dragGhostComponent?: ComponentType<any>;
  suspensed?: boolean;
  componentDescriptionSpecs?: ComponentDescriptionSpec[];
  onMount?: (designer: Designer) => void;
  onDragstart?: (e: LocateEvent) => void;
  onDrag?: (e: LocateEvent) => void;
  onDragend?: (e: { dragObject: DragObject; copy: boolean }, loc?: Location) => void;
  // TODO: ...add other events support
  [key: string]: any;
}

export default class Designer {
  // readonly hotkey: Hotkey;
  readonly dragon = new Dragon(this);
  readonly activeTracker = new ActiveTracker();
  readonly hovering = new Hovering();
  readonly project: Project;

  constructor(props: DesignerProps) {
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
    });

    this.dragon.onDrag(e => {
      if (this.props?.onDrag) {
        this.props.onDrag(e);
      }
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
      this.hovering.enable = true;
    });

    this.activeTracker.onChange(({ node, detail }) => {
      node.document.simulator?.scrollToNode(node, detail);
    });

    this.setProps(props);
  }

  private _dropLocation?: Location;
  /**
   * 创建插入位置
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
  private clearLocation() {
    if (this._dropLocation) {
      this._dropLocation.document.internalSetDropLocation(null);
    }
    this._dropLocation = undefined;
  }

  createScroller(scrollable: IScrollable) {
    return new Scroller(scrollable);
  }

  createOffsetObserver(nodeInstance: INodeInstance): OffsetObserver | null {
    return createOffsetObserver(nodeInstance);
  }

  /**
   * 获得合适的插入位置
   */
  getSuitableInsertion() {
    const activedDoc = this.project.activedDocuments[0];
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
      if (props.componentDescriptionSpecs !== this.props.componentDescriptionSpecs && props.componentDescriptionSpecs != null) {
        this.buildComponentConfigsMap(props.componentDescriptionSpecs);
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
      if (props.componentDescriptionSpecs != null) {
        this.buildComponentConfigsMap(props.componentDescriptionSpecs);
      }
    }
    this.props = props;
  }

  get(key: string): any {
    return this.props ? this.props[key] : null;
  }

  @obx.ref private _simulatorComponent?: ComponentType<any>;

  @computed get simulatorComponent(): ComponentType<any> {
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

  @obx.val private _componentConfigsMap = new Map<string, ComponentConfig>();

  private buildComponentConfigsMap(specs: ComponentDescriptionSpec[]) {
    specs.forEach(spec => {
      const key = spec.componentName;
      const had = this._componentConfigsMap.get(key);
      if (had) {
        had.spec = spec;
      } else {
        this._componentConfigsMap.set(key, new ComponentConfig(spec));
      }
    });
  }

  getComponentConfig(componentName: string): ComponentConfig {
    if (this._componentConfigsMap.has(componentName)) {
      return this._componentConfigsMap.get(componentName)!;
    }

    const config = new ComponentConfig({
      componentName,
    });

    this._componentConfigsMap.set(componentName, config);
    return config;
  }

  get componentsMap(): { [key: string]: ComponentDescriptionSpec } {
    const maps: any = {};
    this._componentConfigsMap.forEach((config, key) => {
      maps[key] = config.spec;
    });
    return maps;
  }

  purge() {
    // todo:
  }
}
