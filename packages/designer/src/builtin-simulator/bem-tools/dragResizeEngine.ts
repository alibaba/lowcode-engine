import * as EventEmitter from 'events';
import { setNativeSelection, cursor } from '@ali/lowcode-utils';
// import Cursor from './cursor';
// import Pages from './pages';

// 拖动缩放
class DragResizeEngine {
  private emitter: EventEmitter;
  private dragResizing = false;

  constructor() {
    this.emitter = new EventEmitter();
  }

  isDragResizing() {
    console.log('is drag resizign');
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
    let startEvent: MouseEvent;

    if (!shell) {
      return () => {};
    }

    const move = (e: MouseEvent) => {
      console.log('move');
      const moveX = e.clientX - startEvent.clientX;
      const moveY = e.clientY - startEvent.clientY;

      this.emitter.emit('resize', e, direction, node, moveX, moveY);
    };

    const over = (e: MouseEvent) => {
      console.log('over');
      document.removeEventListener('mousemove', move, true);
      document.removeEventListener('mouseup', over, true);

      this.dragResizing = false;
      cursor.release();

      this.emitter.emit('resizeEnd', e, direction, node);
    };

    const mousedown = (e: MouseEvent) => {
      node = boost(e);
      startEvent = e;

      this.emitter.emit('resizestart', e, direction, node);

      document.addEventListener('mousemove', move, true);
      document.addEventListener('mouseup', over, true);

      this.dragResizing = true;
      cursor.addState('ew-resize');
    };
    shell.addEventListener('mousedown', mousedown);
    shell.addEventListener('mouseup', over);
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

  onResize(func: (e: MouseEvent, direction: string, node: any, moveX: number, moveY: number) => any) {
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
}

export default new DragResizeEngine();
