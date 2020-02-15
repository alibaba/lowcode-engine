import { EventEmitter } from 'events';
import { obx } from '@recore/obx';
import Location from './document/location';
import Project from './project';
import DocumentContext from './document/document-context';
import { NodeData } from './schema';
import { SimulatorInterface } from './simulator-interface';
import Node from './document/node/node';

export interface LocateEvent {
  readonly type: 'LocateEvent';
  /**
   * 浏览器窗口坐标系
   */
  readonly globalX: number;
  readonly globalY: number;
  /**
   * 原始事件
   */
  readonly originalEvent: MouseEvent;
  /**
   * 拖拽对象
   */
  readonly dragObject: DragObject;
  /**
   * 浏览器事件响应目标
   */
  target: Element | null;
  /**
   * 当前激活文档画布坐标系
   */
  canvasX?: number;
  canvasY?: number;
  /**
   * 激活或目标文档
   */
  document?: DocumentContext;
  /**
   * 事件订正标识，初始构造时，从发起端构造，缺少 canvasX,canvasY, 需要经过订正才有
   */
  fixed?: true;
}

/**
 * 拖拽敏感板
 */
export interface SensorInterface {
  /**
   * 是否可响应，比如面板被隐藏，可设置该值 false
   */
  readonly sensorAvailable: boolean;
  /**
   * 给事件打补丁
   */
  fixEvent(e: LocateEvent): LocateEvent;
  /**
   * 定位并激活
   */
  locate(e: LocateEvent): Location | undefined;
  /**
   * 是否进入敏感板区域
   */
  isEnter(e: LocateEvent): boolean;
  /**
   * 取消激活
   */
  deactiveSensor(): void;
}

export type DragObject = DragNodeObject | DragNodeDataObject | DragAnyObject;

export enum DragObjectType {
  Node = 'node',
  NodeData = 'nodedata',
}

export interface DragNodeObject {
  type: DragObjectType.Node;
  node: Node | Node[];
}
export interface DragNodeDataObject {
  type: DragObjectType.NodeData;
  data: NodeData | NodeData[];
  maps?: { [tagName: string]: string };
  thumbnail?: string;
  description?: string;
  [extra: string]: any;
}

export interface DragAnyObject {
  type: string;
  [key: string]: any;
}

export function isDragNodeObject(obj: any): obj is DragNodeObject {
  return obj && obj.type === DragObjectType.Node;
}

export function isDragNodeDataObject(obj: any): obj is DragNodeDataObject {
  return obj && obj.type === DragObjectType.NodeData;
}

export function isDragAnyObject(obj: any): obj is DragAnyObject {
  return obj && obj.type !== DragObjectType.NodeData && obj.type !== DragObjectType.Node;
}

export function isLocateEvent(e: any): e is LocateEvent {
  return e && e.type === 'LocateEvent';
}

const SHAKE_DISTANCE = 4;
/**
 * mouse shake check
 */
export function isShaken(e1: MouseEvent, e2: MouseEvent): boolean {
  if ((e1 as any).shaken) {
    return true;
  }
  if (e1.target !== e2.target) {
    return true;
  }
  return Math.pow(e1.clientY - e2.clientY, 2) + Math.pow(e1.clientX - e2.clientX, 2) > SHAKE_DISTANCE;
}

export function setShaken(e: any) {
  e.shaken = true;
}

function getTopDocument(e: MouseEvent, local: Document) {
  return e.view!.document === local ? null : document;
}

export default class Dragon {
  private sensors: ISenseAble[] = [];

  /**
   * current actived sensor
   */
  private _activeSensor: ISenseAble | undefined;
  get activeSensor(): ISenseAble | undefined {
    return this._activeSensor;
  }

  @obx.ref dragging = false;
  private emitter = new EventEmitter();
  private get master(): MasterBoard | undefined {
    const doc = getCurrentDocument();
    if (!doc) {
      return undefined;
    }
    return doc.masterBoard;
  }

  constructor(readonly project: Project) {}

  from(shell: Element, boost: (e: MouseEvent) => DragObject | null) {
    const mousedown = (e: MouseEvent) => {
      // ESC or RightClick
      if (e.which === 3 || e.button === 2) {
        return;
      }

      // Get a new node to be dragged
      const dragTarget = boost(e);
      if (!dragTarget) {
        return;
      }

      this.boost(dragTarget, e);
    };
    shell.addEventListener('mousedown', mousedown as any);
    return () => {
      shell.removeEventListener('mousedown', mousedown as any);
    };
  }

  /**
   * dragTarget should be a INode | INode[] | NodeData | NodeData[]
   */
  boost(dragObject: DragObject, boostEvent: MouseEvent) {
    if (!this.master) {
      return;
    }
    const master = this.master;
    const doc = master.contentDocument;
    const viewport = master.document.viewport;
    const topDoc = getTopDocument(boostEvent, doc);
    const newBie = dragObject.type !== DragTargetType.Nodes;
    let lastLocation: any = null;
    let lastSensor: ISenseAble | undefined;
    this.dragging = false;
    master.setNativeSelection(false);

    const checkesc = (e: KeyboardEvent) => {
      if (e.keyCode === 27) {
        lastLocation = null;
        master.document.clearLocation();
        over();
      }
    };

    const checkcopy = (e: MouseEvent) => {
      if (newBie || e.altKey || e.ctrlKey) {
        master.setCopy(true);
      } else {
        master.setCopy(false);
      }
    };

    const drag = (e: MouseEvent) => {
      checkcopy(e);

      const locateEvent = fixEvent(e);
      const sensor = chooseSensor(locateEvent);
      if (sensor) {
        sensor.fixEvent(locateEvent);
        lastLocation = sensor.locate(locateEvent);
      } else {
        master.document.clearLocation();
        lastLocation = null;
      }
      this.emitter.emit('drag', locateEvent, lastLocation);
    };

    const dragstart = () => {
      const locateEvent = fixEvent(boostEvent);
      if (!newBie) {
        chooseSensor(locateEvent);
      }
      master.setDragging(true);
      // ESC cancel drag
      doc.addEventListener('keydown', checkesc, false);
      if (topDoc) {
        topDoc.addEventListener('keydown', checkesc, false);
      }
      this.emitter.emit('dragstart', locateEvent);
    };

    const move = (e: MouseEvent) => {
      if (this.dragging) {
        drag(e);
        return;
      }

      if (isShaken(boostEvent, e)) {
        this.dragging = true;

        setShaken(boostEvent);
        dragstart();
        drag(e);
      }
    };

    const over = (e?: any) => {
      if (lastSensor) {
        lastSensor.deactive();
      }
      master.setNativeSelection(true);

      let exception;
      if (this.dragging) {
        this.dragging = false;
        try {
          this.emitter.emit('dragend', { dragTarget: dragObject, copy: master.isCopy() }, lastLocation);
        } catch (ex) {
          exception = ex;
        }
      }

      master.releaseCursor();

      doc.removeEventListener('mousemove', move, true);
      doc.removeEventListener('mouseup', over, true);
      doc.removeEventListener('mousedown', over, true);
      doc.removeEventListener('keydown', checkesc, false);
      doc.removeEventListener('keydown', checkcopy as any, false);
      doc.removeEventListener('keyup', checkcopy as any, false);
      if (topDoc) {
        topDoc.removeEventListener('mousemove', move, true);
        topDoc.removeEventListener('mouseup', over, true);
        topDoc.removeEventListener('mousedown', over, true);
        topDoc.removeEventListener('keydown', checkesc, false);
        topDoc.removeEventListener('keydown', checkcopy as any, false);
        topDoc.removeEventListener('keyup', checkcopy as any, false);
      }
      if (exception) {
        throw exception;
      }
    };

    const fixEvent = (e: MouseEvent): LocateEvent => {
      if (isLocateEvent(e)) {
        return e;
      }
      const evt: any = {
        type: 'LocateEvent',
        target: e.target,
        dragTarget: dragObject,
        originalEvent: e,
      };
      if (e.view!.document === document) {
        const l = viewport.toLocalPoint(e);
        evt.clientX = l.clientX;
        evt.clientY = l.clientY;
        evt.globalX = e.clientX;
        evt.globalY = e.clientY;
      } else {
        const g = viewport.toGlobalPoint(e);
        evt.clientX = e.clientX;
        evt.clientY = e.clientY;
        evt.globalX = g.clientX;
        evt.globalY = g.clientY;
      }
      return evt;
    };

    function getSourceSensor(dragObject: DragObject): SimulatorInterface | null {
      if (!isDragNodeObject(dragObject)) {
        return null;
      }
      return (Array.isArray(dragObject.node) ? dragObject.node[0] : dragObject.node)?.document.simulator || null;
    }

    const simSensors = this.project.documents.map(doc => (doc.actived && doc.simulator) || null).filter(Boolean);
    const sourceSensor = getSourceSensor(dragObject);
    // check simulator is empty
    const sensors: SensorInterface[] = simSensors.concat(this.sensors);
    const chooseSensor = (e: LocateEvent) => {
      let sensor = sensors.find(s => s.sensorAvailable && s.isEnter(e));
      if (!sensor) {
        if (lastSensor) {
          sensor = lastSensor;
        } else if (sourceSensor) {
          sensor = sourceSensor;
        }
      }
      if (sensor !== lastSensor) {
        if (lastSensor) {
          lastSensor.deactiveSensor();
        }
        lastSensor = sensor;
      }
      if (sensor) {
        sensor.fixEvent(e);
      }
      this._activeSensor = sensor;
      return sensor;
    };

    doc.addEventListener('mousemove', move, true);
    doc.addEventListener('mouseup', over, true);
    doc.addEventListener('mousedown', over, true);
    if (topDoc) {
      topDoc.addEventListener('mousemove', move, true);
      topDoc.addEventListener('mouseup', over, true);
      topDoc.addEventListener('mousedown', over, true);
    }
    if (!newBie) {
      doc.addEventListener('keydown', checkcopy as any, false);
      doc.addEventListener('keyup', checkcopy as any, false);
      if (topDoc) {
        topDoc.addEventListener('keydown', checkcopy as any, false);
        topDoc.addEventListener('keyup', checkcopy as any, false);
      }
    }
  }

  addSensor(sensor: any) {
    this.sensors.push(sensor);
  }

  removeSensor(sensor: any) {
    const i = this.sensors.indexOf(sensor);
    if (i > -1) {
      this.sensors.splice(i, 1);
    }
  }

  onDragstart(func: (e: LocateEvent) => any) {
    this.emitter.on('dragstart', func);
    return () => {
      this.emitter.removeListener('dragstart', func);
    };
  }

  onDrag(func: (e: LocateEvent, location: Location) => any) {
    this.emitter.on('drag', func);
    return () => {
      this.emitter.removeListener('drag', func);
    };
  }

  onDragend(func: (x: { dragTarget: DragObject; copy: boolean }, location: Location) => any) {
    this.emitter.on('dragend', func);
    return () => {
      this.emitter.removeListener('dragend', func);
    };
  }
}
