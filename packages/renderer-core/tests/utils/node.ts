import { PropChangeOptions } from "@ali/lowcode-designer";
import EventEmitter from "events";

export default class Node {
  private emitter: EventEmitter;
  schema: any = {
    props: {},
  };

  componentMeta = {};

  parent;

  hasLoop = () => this._hasLoop;

  id;

  _isRoot: false;

  _hasLoop: false;

  constructor(schema: any, info: any = {}) {
    this.emitter = new EventEmitter();
    const {
      componentMeta,
      parent,
      isRoot,
      hasLoop,
    } = info;
    this.schema = {
      props: {},
      ...schema,
    };
    this.componentMeta = componentMeta || {};
    this.parent = parent;
    this.id = schema.id;
    this._isRoot = isRoot;
    this._hasLoop = hasLoop;
  }

  isRoot = () => this._isRoot;

  // componentMeta() {
  //   return this.componentMeta;
  // }

  // mockLoop() {
  //   // this.hasLoop = true;
  // }

  onChildrenChange(fn: any) {
    this.emitter.on('onChildrenChange', fn);
    return () => {
      this.emitter.off('onChildrenChange', fn);
    }
  }

  emitChildrenChange() {
    this.emitter?.emit('onChildrenChange', {});
  }

  onPropChange(fn: any) {
    this.emitter.on('onPropChange', fn);
    return () => {
      this.emitter.off('onPropChange', fn);
    }
  }

  emitPropChange(val: PropChangeOptions, skip?: boolean) {
    if (!skip) {
      this.schema.props = {
        ...this.schema.props,
        [val.key + '']: val.newValue,
      }
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