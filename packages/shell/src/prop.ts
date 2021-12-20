import { Prop as InnerProp } from '@ali/lowcode-designer';
import { CompositeValue, TransformStage } from '@ali/lowcode-types';
import { propSymbol } from './symbols';
import Node from './node';

export default class Prop {
  private readonly [propSymbol]: InnerProp;

  constructor(prop: InnerProp) {
    this[propSymbol] = prop;
  }

  static create(prop: InnerProp | undefined | null) {
    if (!prop) return null;
    return new Prop(prop);
  }

  getId() {
    return this[propSymbol].id;
  }

  getKey() {
    return this[propSymbol].key;
  }

  getNode() {
    return Node.create(this[propSymbol].getNode());
  }

  setValue(val: CompositeValue) {
    this[propSymbol].setValue(val);
  }

  getValue() {
    return this[propSymbol].getValue();
  }

  exportSchema(stage: TransformStage) {
    return this[propSymbol].export(stage);
  }
}