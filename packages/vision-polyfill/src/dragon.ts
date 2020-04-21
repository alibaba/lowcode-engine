import { editor, designer } from './editor';

const dragon = designer.dragon;

const dragengine = {
  from (shell: Element, boost: (e: MouseEvent) => any): any {

  },
  onDragstart(func: (e: any, dragment: any) => any) {
    return dragon.onDragstart((evt) => {
      func(evt.originalEvent, evt.dragObject.nodes[0]);
    });
  },
  onDrag (func: (e: any, dragment: any, location: Location) => any) {
    return dragon.onDrag((evt) => {
      const loc = designer.currentDocument?.dropLocation;
      func(evt.originalEvent, evt.dragObject.nodes[0]);
    });
  },
  onDragend (func: (dragment: any, location: Location, copy: any) => any) {

  },
  addSensor (sensor: any) {

  },
  removeSensor (sensor: any) {

  },
  inDragging () {

  }
}

export default dragengine;
