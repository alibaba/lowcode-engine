import { Editor } from '@ali/lowcode-editor-core';
import {
  DocumentModel as InnerDocumentModel,
  Node as InnerNode,
  ParentalNode,
  IOnChangeOptions as InnerIOnChangeOptions,
  PropChangeOptions as InnerPropChangeOptions,
  ComponentMeta as InnerComponentMeta,
} from '@ali/lowcode-designer';
import { TransformStage, RootSchema, NodeSchema, NodeData, GlobalEvent } from '@ali/lowcode-types';
import Node from './node';
import Selection from './selection';
import Detecting from './detecting';
import History from './history';
import Project from './project';
import Prop from './prop';
import { componentMetaSymbol } from './symbols';


export default class ComponentMeta {
  private readonly [componentMetaSymbol]: InnerComponentMeta;

  constructor(componentMeta: InnerComponentMeta) {
    this[componentMetaSymbol] = componentMeta;
  }

  static create(componentMeta: InnerComponentMeta | null) {
    if (!componentMeta) return null;
    return new ComponentMeta(componentMeta);
  }

  get componentName(): string {
    return this[componentMetaSymbol].componentName;
  }

  get isContainer(): boolean {
    return this[componentMetaSymbol].isContainer;
  }

  get isMinimalRenderUnit(): boolean {
    return this[componentMetaSymbol].isMinimalRenderUnit;
  }

  get isModal(): boolean {
    return this[componentMetaSymbol].isModal;
  }

  get configure() {
    return this[componentMetaSymbol].configure;
  }

  get title() {
    return this[componentMetaSymbol].title;
  }

  get icon() {
    return this[componentMetaSymbol].icon;
  }

  get npm() {
    return this[componentMetaSymbol].npm;
  }

  get acceptable(): boolean {
    return this[componentMetaSymbol].acceptable;
  }

  setNpm(npm: any) {
    this[componentMetaSymbol].setNpm(npm);
  }

  getMetadata() {
    return this[componentMetaSymbol].getMetadata();
  }
}
