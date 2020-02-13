import { EventEmitter } from 'events';
import MasterBoard from '../document/master-board';
import Location from '../document/location';
import { INode } from '../document/node';
import { NodeData } from '../document/document-data';
import { getCurrentDocument } from './current';
import { obx } from '@ali/recore';

export interface LocateEvent {
  readonly type: 'LocateEvent';
  readonly clientX: number;
  readonly clientY: number;
  readonly globalX: number;
  readonly globalY: number;
  readonly originalEvent: MouseEvent;
  readonly dragTarget: DragTarget;
  target: Element | null;
  fixed?: true;
}

export type DragTarget = NodesDragTarget | NodeDatasDragTarget | AnyDragTarget;

export enum DragTargetType {
  Nodes = 'nodes',
  NodeDatas = 'nodedatas',
}

export interface NodesDragTarget {
  type: DragTargetType.Nodes;
  nodes: INode[];
}

export function isNodesDragTarget(obj: any): obj is NodesDragTarget {
  return obj && obj.type === DragTargetType.Nodes;
}

export interface NodeDatasDragTarget {
  type: DragTargetType.NodeDatas;
  data: NodeData[];
  maps?: { [tagName: string]: string };
  thumbnail?: string;
  description?: string;
  [extra: string]: any;
}

export function isNodeDatasDragTarget(obj: any): obj is NodeDatasDragTarget {
  return obj && obj.type === DragTargetType.NodeDatas;
}

export interface AnyDragTarget {
  type: string;
  [key: string]: any;
}

export function isAnyDragTarget(obj: any): obj is AnyDragTarget {
  return obj && obj.type !== DragTargetType.NodeDatas && obj.type !== DragTargetType.Nodes;
}

export interface ISenseAble {
  id: string;
  sensitive: boolean;
  fixEvent(e: LocateEvent): LocateEvent;
  locate(e: LocateEvent): Location | undefined;
  isEnter(e: LocateEvent): boolean;
  inRange(e: LocateEvent): boolean;
  deactive(): void;
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

class Dragon {
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

  from(shell: Element, boost: (e: MouseEvent) => DragTarget | null) {
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
  boost(dragTarget: DragTarget, boostEvent: MouseEvent) {
    if (!this.master) {
      return;
    }
    const master = this.master;
    const doc = master.contentDocument;
    const viewport = master.document.viewport;
    const topDoc = getTopDocument(boostEvent, doc);
    const newBie = dragTarget.type !== DragTargetType.Nodes;
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
          this.emitter.emit('dragend', { dragTarget, copy: master.isCopy() }, lastLocation);
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
        dragTarget,
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

    const sensors: ISenseAble[] = ([master] as any).concat(this.sensors);
    const chooseSensor = (e: LocateEvent) => {
      let sensor;
      if (newBie && !lastLocation) {
        sensor = sensors.find(s => s.sensitive && s.isEnter(e));
      } else {
        sensor = sensors.find(s => s.sensitive && s.inRange(e)) || lastSensor;
      }
      if (sensor !== lastSensor) {
        if (lastSensor) {
          lastSensor.deactive();
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

  onDragend(func: (x: { dragTarget: DragTarget; copy: boolean }, location: Location) => any) {
    this.emitter.on('dragend', func);
    return () => {
      this.emitter.removeListener('dragend', func);
    };
  }
}

export const dragon = new Dragon();
