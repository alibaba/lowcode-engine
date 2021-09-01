import { EventEmitter } from 'events';
import { ISimulatorHost } from '../../simulator';
import { Designer, Point } from '../../designer';
import { cursor } from '@ali/lowcode-utils';
// import Cursor from './cursor';
// import Pages from './pages';

function makeEventsHandler(
  boostEvent: MouseEvent | DragEvent,
  sensors: ISimulatorHost[],
): (fn: (sdoc: Document) => void) => void {
  const topDoc = window.document;
  const sourceDoc = boostEvent.view?.document || topDoc;
  // TODO: optimize this logic, reduce listener
  // const boostPrevented = boostEvent.defaultPrevented;
  const docs = new Set<Document>();
  // if (boostPrevented || isDragEvent(boostEvent)) {
  docs.add(topDoc);
  // }
  docs.add(sourceDoc);
  // if (sourceDoc !== topDoc || isDragEvent(boostEvent)) {
  sensors.forEach(sim => {
    const sdoc = sim.contentDocument;
    if (sdoc) {
      docs.add(sdoc);
    }
  });
  // }

  return (handle: (sdoc: Document) => void) => {
    docs.forEach(doc => handle(doc));
  };
}

// 拖动缩放
export default class DragResizeEngine {
  private emitter: EventEmitter;

  private dragResizing = false;

  private designer: Designer;

  constructor(designer: Designer) {
    this.designer = designer;
    this.emitter = new EventEmitter();
  }

  isDragResizing() {
    return this.dragResizing;
  }

  /**
   * drag reszie from
   * @param shell
   * @param direction n/s/e/w
   * @param boost (e: MouseEvent) => VE.Node
   */
  from(shell: Element, direction: string, boost: (e: MouseEvent) => any) {
    let node: any;
    let startEvent: Point;

    if (!shell) {
      return () => {};
    }

    const move = (e: MouseEvent) => {
      const x = createResizeEvent(e);
      const moveX = x.clientX - startEvent.clientX;
      const moveY = x.clientY - startEvent.clientY;

      this.emitter.emit('resize', e, direction, node, moveX, moveY);
    };

    const masterSensors = this.getMasterSensors();

    const createResizeEvent = (e: MouseEvent | DragEvent): Point => {
      const sourceDocument = e.view?.document;

      if (!sourceDocument || sourceDocument === document) {
        return e;
      }
      const srcSim = masterSensors.find(sim => sim.contentDocument === sourceDocument);
      if (srcSim) {
        return srcSim.viewport.toGlobalPoint(e);
      }
      return e;
    };

    const over = (e: MouseEvent) => {
      const handleEvents = makeEventsHandler(e, masterSensors);
      handleEvents(doc => {
        doc.removeEventListener('mousemove', move, true);
        doc.removeEventListener('mouseup', over, true);
      });

      this.dragResizing = false;
      this.designer.detecting.enable = true;
      cursor.release();

      this.emitter.emit('resizeEnd', e, direction, node);
    };

    const mousedown = (e: MouseEvent) => {
      node = boost(e);
      startEvent = createResizeEvent(e);
      const handleEvents = makeEventsHandler(e, masterSensors);
      handleEvents(doc => {
        doc.addEventListener('mousemove', move, true);
        doc.addEventListener('mouseup', over, true);
      });

      this.emitter.emit('resizestart', e, direction, node);
      this.dragResizing = true;
      this.designer.detecting.enable = false;
      cursor.addState('ew-resize');
    };
    shell.addEventListener('mousedown', mousedown);
    return () => {
      shell.removeEventListener('mousedown', mousedown);
    };
  }

  onResizeStart(func: (e: MouseEvent, direction: string, node: any) => any) {
    this.emitter.on('resizestart', func);
    return () => {
      this.emitter.removeListener('resizestart', func);
    };
  }

  onResize(
    func: (e: MouseEvent, direction: string, node: any, moveX: number, moveY: number) => any,
  ) {
    this.emitter.on('resize', func);
    return () => {
      this.emitter.removeListener('resize', func);
    };
  }

  onResizeEnd(func: (e: MouseEvent, direction: string, node: any) => any) {
    this.emitter.on('resizeEnd', func);
    return () => {
      this.emitter.removeListener('resizeEnd', func);
    };
  }

  private getMasterSensors(): ISimulatorHost[] {
    return this.designer.project.documents
      .map(doc => {
        if (doc.active && doc.simulator?.sensorAvailable) {
          return doc.simulator;
        }
        return null;
      })
      .filter(Boolean) as any;
  }
}

// new DragResizeEngine();
