import { ISimulatorHost } from '../../simulator';
import { Designer, Point } from '../../designer';
import { cursor } from '@alilc/lowcode-utils';
import { makeEventsHandler } from '../../utils/misc';
import { createModuleEventBus, IEventBus } from '@alilc/lowcode-editor-core';

// 拖动缩放
export default class DragResizeEngine {
  private emitter: IEventBus;

  private dragResizing = false;

  private designer: Designer;

  constructor(designer: Designer) {
    this.designer = designer;
    this.emitter = createModuleEventBus('DragResizeEngine');
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

    /* istanbul ignore next */
    const createResizeEvent = (e: MouseEvent | DragEvent): Point => {
      const sourceDocument = e.view?.document;

      if (!sourceDocument || sourceDocument === document) {
        return e;
      }
      const srcSim = masterSensors.find((sim) => sim.contentDocument === sourceDocument);
      if (srcSim) {
        return srcSim.viewport.toGlobalPoint(e);
      }
      return e;
    };

    const over = (e: MouseEvent) => {
      const handleEvents = makeEventsHandler(e, masterSensors);
      handleEvents((doc) => {
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
      handleEvents((doc) => {
        doc.addEventListener('mousemove', move, true);
        doc.addEventListener('mouseup', over, true);
      });

      this.emitter.emit('resizeStart', e, direction, node);
      this.dragResizing = true;
      this.designer.detecting.enable = false;
      cursor.addState('ew-resize');
    };
    shell.addEventListener('mousedown', mousedown as any);
    return () => {
      shell.removeEventListener('mousedown', mousedown as any);
    };
  }

  onResizeStart(func: (e: MouseEvent, direction: string, node: any) => any) {
    this.emitter.on('resizeStart', func);
    return () => {
      this.emitter.removeListener('resizeStart', func);
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
      .map((doc) => {
        if (doc.active && doc.simulator?.sensorAvailable) {
          return doc.simulator;
        }
        return null;
      })
      .filter(Boolean) as any;
  }
}

// new DragResizeEngine();
