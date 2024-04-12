import { observable, makeObservable, IEventBus, createModuleEventBus, action, autorun } from '@alilc/lowcode-editor-core';
import {
  IPublicModelDragObject,
  IPublicModelNode,
  IPublicModelDragon,
  IPublicModelLocateEvent,
  IPublicModelSensor,
} from '@alilc/lowcode-types';
import { setNativeSelection, cursor, isDragNodeObject } from '@alilc/lowcode-utils';
import { INode, Node } from '../document';
import { ISimulatorHost, isSimulatorHost } from '../simulator';
import { IDesigner } from './designer';
import { makeEventsHandler } from '../utils/misc';

export interface ILocateEvent extends IPublicModelLocateEvent {
  readonly type: 'LocateEvent';

  /**
   * 激活的感应器
   */
  sensor?: IPublicModelSensor;
}

export function isLocateEvent(e: any): e is ILocateEvent {
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
  return (
    Math.pow(e1.clientY - e2.clientY, 2) + Math.pow(e1.clientX - e2.clientX, 2) > SHAKE_DISTANCE
  );
}

export function isInvalidPoint(e: any, last: any): boolean {
  return (
    e.clientX === 0 &&
    e.clientY === 0 &&
    last &&
    (Math.abs(last.clientX - e.clientX) > 5 || Math.abs(last.clientY - e.clientY) > 5)
  );
}

export function isSameAs(e1: MouseEvent | DragEvent, e2: MouseEvent | DragEvent): boolean {
  return e1.clientY === e2.clientY && e1.clientX === e2.clientX;
}

export function setShaken(e: any) {
  e.shaken = true;
}

function getSourceSensor(dragObject: IPublicModelDragObject): ISimulatorHost | null {
  if (!isDragNodeObject(dragObject)) {
    return null;
  }
  return (dragObject.nodes[0]?.document as any)?.simulator || null;
}

function isDragEvent(e: any): e is DragEvent {
  return e?.type?.startsWith('drag');
}

/**
 * Drag-on 拖拽引擎
 */
export class Dragon implements IPublicModelDragon<INode, ILocateEvent> {
  private sensors: IPublicModelSensor[] = [];

  private nodeInstPointerEvents: boolean;

  key = Math.random();

  /**
   * current active sensor, 可用于感应区高亮
   */
  @observable.ref private _activeSensor: IPublicModelSensor | undefined;

  get activeSensor(): IPublicModelSensor | undefined {
    return this._activeSensor;
  }

  @observable.ref private _dragging = false;

  @observable.ref private _canDrop = false;

  get dragging(): boolean {
    return this._dragging;
  }

  viewName: string | undefined;

  emitter: IEventBus = createModuleEventBus('Dragon');

  constructor(readonly designer: IDesigner) {
    makeObservable(this);
    this.viewName = designer.viewName;
  }

  /**
   * Quick listen a shell(container element) drag behavior
   * @param shell container element
   * @param boost boost got a drag object
   */
  from(shell: Element, boost: (e: MouseEvent) => IPublicModelDragObject | null) {
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

  /**
   * boost your dragObject for dragging(flying) 发射拖拽对象
   *
   * @param dragObject 拖拽对象
   * @param boostEvent 拖拽初始时事件
   */
  @action
  boost(
    dragObject: IPublicModelDragObject,
    boostEvent: MouseEvent | DragEvent,
    fromRglNode?: INode | IPublicModelNode,
  ) {
    const { designer } = this;
    const masterSensors = this.getMasterSensors();
    const handleEvents = makeEventsHandler(boostEvent, masterSensors);
    const newBie = !isDragNodeObject(dragObject);
    const forceCopyState =
      isDragNodeObject(dragObject) &&
      dragObject.nodes.some((node: Node | IPublicModelNode) =>
        typeof node.isSlot === 'function' ? node.isSlot() : node.isSlot,
      );
    const isBoostFromDragAPI = isDragEvent(boostEvent);
    let lastSensor: IPublicModelSensor | undefined;

    this._dragging = false;

    const getRGL = (e: MouseEvent | DragEvent) => {
      const locateEvent = createLocateEvent(e);
      const sensor = chooseSensor(locateEvent);
      if (!sensor || !sensor.getNodeInstanceFromElement) return {};
      const nodeInst = sensor.getNodeInstanceFromElement(e.target as Element);
      return nodeInst?.node?.getRGL() || {};
    };

    const checkesc = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
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
        /* istanbul ignore next */
        if (isDragEvent(e) && e.dataTransfer) {
          e.dataTransfer.dropEffect = 'copy';
        }
      } else {
        copy = false;
        if (!forceCopyState) {
          this.setCopyState(false);
          /* istanbul ignore next */
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

      const { isRGL, rglNode } = getRGL(e) as any;
      const locateEvent = createLocateEvent(e);
      const sensor = chooseSensor(locateEvent);

      if (isRGL) {
        // 禁止被拖拽元素的阻断
        const nodeInst = dragObject?.nodes?.[0]?.getDOMNode();
        if (nodeInst && nodeInst.style) {
          this.nodeInstPointerEvents = true;
          nodeInst.style.pointerEvents = 'none';
        }
        // 原生拖拽
        this.emitter.emit('rgl.sleeping', false);
        if (fromRglNode && fromRglNode.id === rglNode.id) {
          designer.clearLocation();
          this.clearState();
          this.emitter.emit('drag', locateEvent);
          return;
        }
        this._canDrop = !!sensor?.locate(locateEvent);
        if (this._canDrop) {
          this.emitter.emit('rgl.add.placeholder', {
            rglNode,
            fromRglNode,
            node: locateEvent.dragObject?.nodes?.[0],
            event: e,
          });
          designer.clearLocation();
          this.clearState();
          this.emitter.emit('drag', locateEvent);
          return;
        }
      } else {
        this._canDrop = false;
        this.emitter.emit('rgl.remove.placeholder');
        this.emitter.emit('rgl.sleeping', true);
      }
      if (sensor) {
        sensor.fixEvent(locateEvent);
        sensor.locate(locateEvent);
      } else {
        designer.clearLocation();
      }
      this.emitter.emit('drag', locateEvent);
    };

    const dragstart = autorun(() => {
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
        handleEvents((doc) => {
          doc.addEventListener('keydown', checkesc, false);
        });
      }

      this.emitter.emit('dragstart', locateEvent);
    });

    // route: drag-move
    const move = (e: MouseEvent | DragEvent) => {
      /* istanbul ignore next */
      if (isBoostFromDragAPI) {
        e.preventDefault();
      }
      if (this._dragging) {
        // process dragging
        drag(e);
        return;
      }

      // first move check is shaken
      if (isShaken(boostEvent, e)) {
        // is shaken dragstart
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

    // end-tail drag process
    const over = (e?: any) => {
      // 禁止被拖拽元素的阻断
      if (this.nodeInstPointerEvents) {
        const nodeInst = dragObject?.nodes?.[0]?.getDOMNode();
        if (nodeInst && nodeInst.style) {
          nodeInst.style.pointerEvents = '';
        }
        this.nodeInstPointerEvents = false;
      }

      // 发送drop事件
      if (e) {
        const { isRGL, rglNode } = getRGL(e) as any;
        /* istanbul ignore next */
        if (isRGL && this._canDrop && this._dragging) {
          const tarNode = dragObject?.nodes?.[0];
          if (rglNode.id !== tarNode?.id) {
            // 避免死循环
            this.emitter.emit('rgl.drop', {
              rglNode,
              node: tarNode,
            });
            const selection = designer.project.currentDocument?.selection;
            selection?.select(tarNode!.id);
          }
        }
      }

      // 移除磁帖占位消息
      this.emitter.emit('rgl.remove.placeholder');

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
        } catch (ex) /* istanbul ignore next */ {
          exception = ex;
        }
      }
      designer.clearLocation();

      handleEvents((doc) => {
        /* istanbul ignore next */
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
      /* istanbul ignore next */
      if (exception) {
        throw exception;
      }
    };

    // create drag locate event
    const createLocateEvent = (e: MouseEvent | DragEvent): ILocateEvent => {
      const evt: any = {
        type: 'LocateEvent',
        dragObject,
        target: e.target,
        originalEvent: e,
      };

      const sourceDocument = e.view?.document;

      // event from current document
      if (!sourceDocument || sourceDocument === document) {
        evt.globalX = e.clientX;
        evt.globalY = e.clientY;
      } /* istanbul ignore next */ else {
        // event from simulator sandbox
        let srcSim: ISimulatorHost | undefined;
        const lastSim = lastSensor && isSimulatorHost(lastSensor) ? lastSensor : null;
        // check source simulator
        if (lastSim && lastSim.contentDocument === sourceDocument) {
          srcSim = lastSim;
        } else {
          srcSim = masterSensors.find((sim) => sim.contentDocument === sourceDocument);
          if (!srcSim && lastSim) {
            srcSim = lastSim;
          }
        }
        if (srcSim) {
          // transform point by simulator
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
    /* istanbul ignore next */
    const chooseSensor = (e: ILocateEvent) => {
      // this.sensors will change on dragstart
      const sensors: IPublicModelSensor[] = this.sensors.concat(
        masterSensors as IPublicModelSensor[],
      );
      let sensor =
        e.sensor && e.sensor.isEnter(e)
          ? e.sensor
          : sensors.find((s) => s.sensorAvailable && s.isEnter(e));
      if (!sensor) {
        // TODO: enter some area like componentspanel cancel
        if (lastSensor) {
          sensor = lastSensor;
        } else if (e.sensor) {
          sensor = e.sensor;
        } else if (sourceSensor) {
          sensor = sourceSensor as any;
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

    /* istanbul ignore next */
    if (isDragEvent(boostEvent)) {
      const { dataTransfer } = boostEvent;

      if (dataTransfer) {
        dataTransfer.effectAllowed = 'all';

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

    handleEvents((doc) => {
      /* istanbul ignore next */
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
      handleEvents((doc) => {
        doc.addEventListener('keydown', checkcopy, false);
        doc.addEventListener('keyup', checkcopy, false);
      });
    }
  }

  /* istanbul ignore next */
  private getMasterSensors(): ISimulatorHost[] {
    return Array.from(
      new Set(
        this.designer.project.documents
          .map((doc) => {
            if (doc.active && doc.simulator?.sensorAvailable) {
              return doc.simulator;
            }
            return null;
          })
          .filter(Boolean) as any,
      ),
    );
  }

  private getSimulators() {
    return new Set(this.designer.project.documents.map((doc) => doc.simulator));
  }

  // #region ======== drag and drop helpers ============
  private setNativeSelection(enableFlag: boolean) {
    setNativeSelection(enableFlag);
    this.getSimulators().forEach((sim) => {
      sim?.setNativeSelection(enableFlag);
    });
  }

  /**
   * 设置拖拽态
   */
  private setDraggingState(state: boolean) {
    cursor.setDragging(state);
    this.getSimulators().forEach((sim) => {
      sim?.setDraggingState(state);
    });
  }

  /**
   * 设置拷贝态
   */
  private setCopyState(state: boolean) {
    cursor.setCopy(state);
    this.getSimulators().forEach((sim) => {
      sim?.setCopyState(state);
    });
  }

  /**
   * 清除所有态：拖拽态、拷贝态
   */
  private clearState() {
    cursor.release();
    this.getSimulators().forEach((sim) => {
      sim?.clearState();
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

  onDragstart(func: (e: ILocateEvent) => any) {
    this.emitter.on('dragstart', func);
    return () => {
      this.emitter.removeListener('dragstart', func);
    };
  }

  onDrag(func: (e: ILocateEvent) => any) {
    this.emitter.on('drag', func);
    return () => {
      this.emitter.removeListener('drag', func);
    };
  }

  onDragend(func: (x: { dragObject: IPublicModelDragObject; copy: boolean }) => any) {
    this.emitter.on('dragend', func);
    return () => {
      this.emitter.removeListener('dragend', func);
    };
  }
}

export interface IDragon extends Dragon {}
