import { EventEmitter } from 'events';
import DropLocation from './location';
import DocumentModel from '../document/document-model';
import { ISimulator, isSimulator, ComponentInstance } from '../simulator';
import Node from '../document/node/node';
import Designer from '../designer';
import { setNativeSelection } from './navtive-selection';
import cursor from './cursor';
import { NodeSchema, obx } from '../../../../globals';

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
  readonly originalEvent: MouseEvent | DragEvent;
  /**
   * 拖拽对象
   */
  readonly dragObject: DragObject;

  /**
   * 激活的感应器
   */
  sensor?: ISensor;

  // ======= 以下是 激活的 sensor 将填充的值 ========
  /**
   * 浏览器事件响应目标
   */
  target?: Element | null;
  /**
   * 当前激活文档画布坐标系
   */
  canvasX?: number;
  canvasY?: number;
  /**
   * 激活或目标文档
   */
  documentModel?: DocumentModel;
  /**
   * 事件订正标识，初始构造时，从发起端构造，缺少 canvasX,canvasY, 需要经过订正才有
   */
  fixed?: true;
}

/**
 * 拖拽敏感板
 */
export interface ISensor {
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
  locate(e: LocateEvent): DropLocation | undefined | null;
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
  nodes: Node[];
}
export interface DragNodeDataObject {
  type: DragObjectType.NodeData;
  data: NodeSchema | NodeSchema[];
  maps?: { [componentName: string]: string };
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
export function isShaken(e1: MouseEvent | DragEvent, e2: MouseEvent | DragEvent): boolean {
  if ((e1 as any).shaken) {
    return true;
  }
  if (e1.target !== e2.target) {
    return true;
  }
  return Math.pow(e1.clientY - e2.clientY, 2) + Math.pow(e1.clientX - e2.clientX, 2) > SHAKE_DISTANCE;
}

function isInvalidPoint(e: any, last: any): boolean {
  return (
    e.clientX === 0 &&
    e.clientY === 0 &&
    last &&
    (Math.abs(last.clientX - e.clientX) > 5 || Math.abs(last.clientY - e.clientY) > 5)
  );
}

function isSameAs(e1: MouseEvent | DragEvent, e2: MouseEvent | DragEvent): boolean {
  return e1.clientY === e2.clientY && e1.clientX === e2.clientX;
}

export function setShaken(e: any) {
  e.shaken = true;
}

function getSourceSensor(dragObject: DragObject): ISimulator | null {
  if (!isDragNodeObject(dragObject)) {
    return null;
  }
  return dragObject.nodes[0]?.document.simulator || null;
}

function makeEventsHandler(
  boostEvent: MouseEvent | DragEvent,
  sensors: ISimulator[],
): (fn: (sdoc: Document) => void) => void {
  const topDoc = window.top.document;
  const sourceDoc = boostEvent.view?.document || topDoc;
  const boostPrevented = boostEvent.defaultPrevented;
  const docs = new Set<Document>();
  if (boostPrevented || isDragEvent(boostEvent)) {
    docs.add(topDoc);
  }
  docs.add(sourceDoc);
  if (sourceDoc !== topDoc || isDragEvent(boostEvent)) {
    sensors.forEach(sim => {
      const sdoc = sim.contentDocument;
      if (sdoc) {
        docs.add(sdoc);
      }
    });
  }

  return (handle: (sdoc: Document) => void) => {
    docs.forEach(doc => handle(doc));
  };
}

function isDragEvent(e: any): e is DragEvent {
  return e?.type?.substr(0, 4) === 'drag';
}

export default class Dragon {
  private sensors: ISensor[] = [];

  /**
   * current actived sensor, 可用于感应区高亮
   */
  @obx.ref private _activeSensor: ISensor | undefined;
  get activeSensor(): ISensor | undefined {
    return this._activeSensor;
  }

  @obx.ref private _dragging = false;
  get dragging(): boolean {
    return this._dragging;
  }

  private emitter = new EventEmitter();
  // private emptyImage: HTMLImageElement = new Image();

  constructor(readonly designer: Designer) {
    // this.emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  }

  from(shell: Element, boost: (e: MouseEvent) => DragObject | null) {
    const mousedown = (e: MouseEvent) => {
      // ESC or RightClick
      if (e.which === 3 || e.button === 2) {
        return;
      }

      // Get a new node to be dragged
      const dragObject = boost(e);
      if (!dragObject) {
        return;
      }

      this.boost(dragObject, e);
    };
    shell.addEventListener('mousedown', mousedown as any);
    return () => {
      shell.removeEventListener('mousedown', mousedown as any);
    };
  }

  boost(dragObject: DragObject, boostEvent: MouseEvent | DragEvent) {
    const designer = this.designer;
    const masterSensors = this.getMasterSensors();
    const handleEvents = makeEventsHandler(boostEvent, masterSensors);
    const newBie = !isDragNodeObject(dragObject);
    const forceCopyState = isDragNodeObject(dragObject) && dragObject.nodes.some(node => node.isSlotRoot);
    const isBoostFromDragAPI = boostEvent.type.substr(0, 4) === 'drag';
    let lastSensor: ISensor | undefined;

    this._dragging = false;

    const checkesc = (e: KeyboardEvent) => {
      if (e.keyCode === 27) {
        designer.clearLocation();
        over();
      }
    };

    let copy = false;
    const checkcopy = (e: MouseEvent | DragEvent | KeyboardEvent) => {
      if (isDragEvent(e) && e.dataTransfer) {
        if (newBie || forceCopyState) {
          e.dataTransfer.dropEffect = 'copy';
        }
        return;
      }
      if (newBie) {
        return;
      }

      if (e.altKey || e.ctrlKey) {
        copy = true;
        this.setCopyState(true);
        if (isDragEvent(e) && e.dataTransfer) {
          e.dataTransfer.dropEffect = 'copy';
        }
      } else {
        copy = false;
        if (!forceCopyState) {
          this.setCopyState(false);
          if (isDragEvent(e) && e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move';
          }
        }
      }
    };

    let lastArrive: any;
    const drag = (e: MouseEvent | DragEvent) => {
      // FIXME: donot setcopy when: newbie & no location
      checkcopy(e);

      if (isInvalidPoint(e, lastArrive)) return;

      if (lastArrive && isSameAs(e, lastArrive)) {
        lastArrive = e;
        return;
      }
      lastArrive = e;

      const locateEvent = createLocateEvent(e);
      const sensor = chooseSensor(locateEvent);
      if (sensor) {
        sensor.fixEvent(locateEvent);
        sensor.locate(locateEvent);
      } else {
        designer.clearLocation();
      }
      this.emitter.emit('drag', locateEvent);
    };

    const dragstart = () => {
      this._dragging = true;
      setShaken(boostEvent);
      const locateEvent = createLocateEvent(boostEvent);
      if (newBie || forceCopyState) {
        this.setCopyState(true);
      } else {
        chooseSensor(locateEvent);
      }
      this.setDraggingState(true);
      // ESC cancel drag
      if (!isBoostFromDragAPI) {
        handleEvents(doc => {
          doc.addEventListener('keydown', checkesc, false);
        });
      }

      this.emitter.emit('dragstart', locateEvent);
    };

    const move = (e: MouseEvent | DragEvent) => {
      if (isBoostFromDragAPI) {
        e.preventDefault();
      }
      if (this._dragging) {
        drag(e);
        return;
      }

      if (isShaken(boostEvent, e)) {
        dragstart();
        drag(e);
      }
    };

    let didDrop = true;
    const drop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      didDrop = true;
    };

    const over = (e?: any) => {
      if (e && isDragEvent(e)) {
        e.preventDefault();
      }
      if (lastSensor) {
        lastSensor.deactiveSensor();
      }
      if (isBoostFromDragAPI) {
        if (!didDrop) {
          designer.clearLocation();
        }
      } else {
        this.setNativeSelection(true);
      }
      this.clearState();

      let exception;
      if (this._dragging) {
        this._dragging = false;
        try {
          this.emitter.emit('dragend', { dragObject, copy });
        } catch (ex) {
          exception = ex;
        }
      }

      handleEvents(doc => {
        if (isBoostFromDragAPI) {
          doc.removeEventListener('dragover', move, true);
          doc.removeEventListener('dragend', over, true);
          doc.removeEventListener('drop', drop, true);
        } else {
          doc.removeEventListener('mousemove', move, true);
          doc.removeEventListener('mouseup', over, true);
        }
        doc.removeEventListener('mousedown', over, true);
        doc.removeEventListener('keydown', checkesc, false);
        doc.removeEventListener('keydown', checkcopy, false);
        doc.removeEventListener('keyup', checkcopy, false);
      });
      if (exception) {
        throw exception;
      }
    };

    const createLocateEvent = (e: MouseEvent | DragEvent): LocateEvent => {
      const evt: any = {
        type: 'LocateEvent',
        dragObject,
        target: e.target,
        originalEvent: e,
      };

      const sourceDocument = e.view?.document;

      if (!sourceDocument || sourceDocument === document) {
        evt.globalX = e.clientX;
        evt.globalY = e.clientY;
      } else {
        let srcSim: ISimulator | undefined;
        const lastSim = lastSensor && isSimulator(lastSensor) ? lastSensor : null;
        if (lastSim && lastSim.contentDocument === sourceDocument) {
          srcSim = lastSim;
        } else {
          srcSim = masterSensors.find(sim => sim.contentDocument === sourceDocument);
          if (!srcSim && lastSim) {
            srcSim = lastSim;
          }
        }
        if (srcSim) {
          const g = srcSim.viewport.toGlobalPoint(e);
          evt.globalX = g.clientX;
          evt.globalY = g.clientY;
          evt.canvasX = e.clientX;
          evt.canvasY = e.clientY;
          evt.sensor = srcSim;
        } else {
          // this condition will not happen, just make sure ts ok
          evt.globalX = e.clientX;
          evt.globalY = e.clientY;
        }
      }
      return evt;
    };

    const sourceSensor = getSourceSensor(dragObject);
    const sensors: ISensor[] = (masterSensors as ISensor[]).concat(this.sensors);
    const chooseSensor = (e: LocateEvent) => {
      let sensor = e.sensor && e.sensor.isEnter(e) ? e.sensor : sensors.find(s => s.sensorAvailable && s.isEnter(e));
      if (!sensor) {
        // TODO: enter some area like componentspanel cancel
        if (lastSensor) {
          sensor = lastSensor;
        } else if (e.sensor) {
          sensor = e.sensor;
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
        e.sensor = sensor;
        sensor.fixEvent(e);
      }
      this._activeSensor = sensor;
      return sensor;
    };

    if (isDragEvent(boostEvent)) {
      const { dataTransfer } = boostEvent;

      if (dataTransfer) {
        // dataTransfer.setDragImage(this.emptyImage, 0, 0);
        dataTransfer.effectAllowed = 'all';
        // dataTransfer.dropEffect = newBie || forceCopyState ? 'copy' : 'move';

        try {
          dataTransfer.setData('application/json', '{}');
        } catch (ex) {
          // ignore
        }
      }

      dragstart();
    } else {
      this.setNativeSelection(false);
    }

    handleEvents(doc => {
      if (isBoostFromDragAPI) {
        doc.addEventListener('dragover', move, true);
        // dragexit
        didDrop = false;
        doc.addEventListener('drop', drop, true);
        doc.addEventListener('dragend', over, true);
      } else {
        doc.addEventListener('mousemove', move, true);
        doc.addEventListener('mouseup', over, true);
      }
      doc.addEventListener('mousedown', over, true);
    });

    // future think: drag things from browser-out or a iframe-pane

    if (!newBie && !isBoostFromDragAPI) {
      handleEvents(doc => {
        doc.addEventListener('keydown', checkcopy, false);
        doc.addEventListener('keyup', checkcopy, false);
      });
    }
  }

  private getMasterSensors(): ISimulator[] {
    return this.designer.project.documents
      .map(doc => {
        // TODO: not use actived,
        if (doc.actived && doc.simulator?.sensorAvailable) {
          return doc.simulator;
        }
        return null;
      })
      .filter(Boolean) as any;
  }

  // #region ======== drag and drop helpers ============
  private setNativeSelection(enableFlag: boolean) {
    setNativeSelection(enableFlag);
    this.designer.project.documents.forEach(doc => {
      doc.simulator?.setNativeSelection(enableFlag);
    });
  }

  /**
   * 设置拖拽态
   */
  private setDraggingState(state: boolean) {
    cursor.setDragging(state);
    this.designer.project.documents.forEach(doc => {
      doc.simulator?.setDraggingState(state);
    });
  }

  /**
   * 设置拷贝态
   */
  private setCopyState(state: boolean) {
    cursor.setCopy(state);
    this.designer.project.documents.forEach(doc => {
      doc.simulator?.setCopyState(state);
    });
  }

  /**
   * 清除所有态：拖拽态、拷贝态
   */
  private clearState() {
    cursor.release();
    this.designer.project.documents.forEach(doc => {
      doc.simulator?.clearState();
    });
  }
  // #endregion

  /**
   * 添加投放感应区
   */
  addSensor(sensor: any) {
    this.sensors.push(sensor);
  }

  /**
   * 移除投放感应
   */
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

  onDrag(func: (e: LocateEvent) => any) {
    this.emitter.on('drag', func);
    return () => {
      this.emitter.removeListener('drag', func);
    };
  }

  onDragend(func: (x: { dragObject: DragObject; copy: boolean }) => any) {
    this.emitter.on('dragend', func);
    return () => {
      this.emitter.removeListener('dragend', func);
    };
  }
}
