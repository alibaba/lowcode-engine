import { EventEmitter } from 'events';
import { obx } from '@recore/obx';
import Location from './location';
import DocumentModel from '../document/document-model';
import { NodeData } from '../schema';
import { ISimulator, isSimulator } from '../simulator';
import Node from '../document/node/node';
import Designer from '../designer';
import { setNativeSelection } from '../../utils/navtive-selection';
import cursor from './cursor';

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
  document?: DocumentModel;
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
  nodes: Node[];
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

function isFromTopDocument(e: MouseEvent) {
  return e.view!.document === document;
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

  @obx.ref private _dragging: boolean = false;
  get dragging(): boolean {
    return this._dragging;
  }

  private emitter = new EventEmitter();

  constructor(readonly designer: Designer) {}

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

  getMasterSensors(): ISimulator[] {
    return this.designer.project.documents.map(doc => {
      if (doc.actived && doc.simulator?.sensorAvailable) {
        return doc.simulator;
      }
      return null;
    }).filter(Boolean) as any;
  }

  boost(dragObject: DragObject, boostEvent: MouseEvent) {
    const doc = document;
    const isFromTop = isFromTopDocument(boostEvent);
    const masterSensors = this.getMasterSensors();
    const designer = this.designer;
    const newBie = dragObject.type !== DragObjectType.Node;
    let lastSensor: ISensor | undefined;

    this._dragging = false;
    // 禁用默认的文稿拖选
    this.setNativeSelection(false);

    const checkesc = (e: KeyboardEvent) => {
      if (e.keyCode === 27) {
        designer.clearLocation();
        over();
      }
    };

    const checkcopy = (e: MouseEvent) => {
      if (newBie || e.altKey || e.ctrlKey) {
        this.setCopyState(true);
      } else {
        this.setCopyState(false);
      }
    };

    // period one fix:
    // get evt source-sensor
    // get globalX and globalY source-sensor

    const drag = (e: MouseEvent) => {
      checkcopy(e);

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
      const locateEvent = createLocateEvent(boostEvent);
      if (!newBie) {
        chooseSensor(locateEvent);
      }
      this.setDraggingState(true);
      // ESC cancel drag
      doc.addEventListener('keydown', checkesc, false);
      if (isFromTop) {
        // topDoc.addEventListener('keydown', checkesc, false);
      }
      this.emitter.emit('dragstart', locateEvent);
    };

    const move = (e: MouseEvent) => {
      if (this.dragging) {
        drag(e);
        return;
      }

      if (isShaken(boostEvent, e)) {
        this._dragging = true;

        setShaken(boostEvent);
        dragstart();
        drag(e);
      }
    };

    const over = (e?: any) => {
      if (lastSensor) {
        lastSensor.deactiveSensor();
      }
      this.setNativeSelection(true);

      let exception;
      if (this._dragging) {
        this._dragging = false;
        try {
          this.emitter.emit('dragend', { dragTarget: dragObject, copy: this.isCopyState() });
        } catch (ex) {
          exception = ex;
        }
      }

      this.clearState();

      if (isFromTop) {
        doc.removeEventListener('mousemove', move, true);
        doc.removeEventListener('mouseup', over, true);
        doc.removeEventListener('mousedown', over, true);
        doc.removeEventListener('keydown', checkesc, false);
        doc.removeEventListener('keydown', checkcopy as any, false);
        doc.removeEventListener('keyup', checkcopy as any, false);
      } else {
        masterSensors.forEach(item => {
          const odoc = item.contentDocument;
          if (odoc) {
            odoc.removeEventListener('mousemove', move, true);
            odoc.removeEventListener('mouseup', over, true);
            odoc.removeEventListener('mousedown', over, true);
            odoc.removeEventListener('keydown', checkesc, false);
            odoc.removeEventListener('keydown', checkcopy as any, false);
            odoc.removeEventListener('keyup', checkcopy as any, false);
          }
        });
      }
      if (exception) {
        throw exception;
      }
    };

    const createLocateEvent = (e: MouseEvent): LocateEvent => {
      if (isLocateEvent(e)) {
        return e;
      }

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
        let lastSim = lastSensor && isSimulator(lastSensor) ? lastSensor : null;
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
          evt.sensor = srcSim;
        } else {
          // this condition will not happen, just make sure ts ok
          evt.globalX = e.clientX;
          evt.globalY = e.clientY;
        }
      }
      return evt;
    };

    function getSourceSensor(dragObject: DragObject): ISimulator | null {
      if (!isDragNodeObject(dragObject)) {
        return null;
      }
      return dragObject.nodes[0]?.document.simulator || null;
    }

    const sourceSensor = getSourceSensor(dragObject);
    const sensors: ISensor[] = (masterSensors as ISensor[]).concat(this.sensors);
    const chooseSensor = (e: LocateEvent) => {
      let sensor = e.sensor || sensors.find(s => s.sensorAvailable && s.isEnter(e));
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
        e.sensor = sensor;
        sensor.fixEvent(e);
      }
      this._activeSensor = sensor;
      return sensor;
    };

    doc.addEventListener('mousemove', move, true);
    doc.addEventListener('mouseup', over, true);
    doc.addEventListener('mousedown', over, true);
    if (isFromTop) {/*
      topDoc.addEventListener('mousemove', move, true);
      topDoc.addEventListener('mouseup', over, true);
      topDoc.addEventListener('mousedown', over, true);
      */
    }

    if (!newBie) {
      doc.addEventListener('keydown', checkcopy as any, false);
      doc.addEventListener('keyup', checkcopy as any, false);
      if (isFromTop) {/*
        topDoc.addEventListener('keydown', checkcopy as any, false);
        topDoc.addEventListener('keyup', checkcopy as any, false);
        */
      }
    }
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
   * 是否拷贝态
   */
  private isCopyState(): boolean {
    return cursor.isCopy();
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
