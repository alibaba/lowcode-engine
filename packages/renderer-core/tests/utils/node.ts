import { PropChangeOptions } from "@alilc/lowcode-designer";
import EventEmitter from "events";

export default class Node {
  private emitter: EventEmitter;
  schema: any = {
    props: {},
  };
  hasLoop = false;

  constructor(schema: any) {
    this.emitter = new EventEmitter();
    this.schema = schema;
  }

  mockLoop() {
    this.hasLoop = true;
  }

  onChildrenChange(fn: any) {
    this.emitter.on('onChildrenChange', fn);
    return () => {
      this.emitter.off('onChildrenChange', fn);
    }
  }

  onPropChange(fn: any) {
    this.emitter.on('onPropChange', fn);
    return () => {
      this.emitter.off('onPropChange', fn);
    }
  }

  emitPropChange(val: PropChangeOptions) {
    this.schema.props = {
      ...this.schema.props,
      [val.key + '']: val.newValue,
    }
    this.emitter?.emit('onPropChange', val);
  }

  onVisibleChange(fn: any) {
    this.emitter.on('onVisibleChange', fn);
    return () => {
      this.emitter.off('onVisibleChange', fn);
    }
  }

  emitVisibleChange(val: boolean) {
    this.emitter?.emit('onVisibleChange', val);
  }
  export() {
    return this.schema;
  }
}