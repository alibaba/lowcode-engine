import { Editor } from '@ali/lowcode-editor-core';
import {
  Designer,
  registerMetadataTransducer,
  MetadataTransducer,
  getRegisteredMetadataTransducers,
  addBuiltinComponentAction,
  removeBuiltinComponentAction,
  modifyBuiltinComponentAction,
} from '@ali/lowcode-designer';
import { AssetsJson } from '@ali/lowcode-utils';
import { ComponentAction } from '@ali/lowcode-types';
import { editorSymbol, designerSymbol } from './symbols';
import ComponentMeta from './component-meta';

export default class Material {
  private readonly [editorSymbol]: Editor;
  private readonly [designerSymbol]: Designer;

  constructor(editor: Editor) {
    this[editorSymbol] = editor;
    this[designerSymbol] = editor.get('designer')!;
  }

  get componentsMap() {
    return this[designerSymbol].componentsMap;
  }

  setAssets(assets: AssetsJson) {
    return this[editorSymbol].setAssets(assets);
  }

  getAssets() {
    return this[editorSymbol].get('assets');
  }

  loadIncrementalAssets(incrementalAssets: AssetsJson) {
    return this[designerSymbol].loadIncrementalAssets(incrementalAssets);
  }

  registerMetadataTransducer(
    transducer: MetadataTransducer,
    level?: number,
    id?: string | undefined,
  ) {
    registerMetadataTransducer(transducer, level, id);
  }

  getRegisteredMetadataTransducers() {
    return getRegisteredMetadataTransducers();
  }

  getComponentMeta(componentName: string) {
    return ComponentMeta.create(this[designerSymbol].getComponentMeta(componentName));
  }

  getComponentMetasMap() {
    const map = new Map<string, ComponentMeta>();
    const originalMap = this[designerSymbol].getComponentMetasMap();
    for (let componentName in originalMap.keys()) {
      map.set(componentName, this.getComponentMeta(componentName)!);
    }
    return map;
  }

  addBuiltinComponentAction(action: ComponentAction) {
    addBuiltinComponentAction(action);
  }

  removeBuiltinComponentAction(name: string) {
    removeBuiltinComponentAction(name);
  }

  modifyBuiltinComponentAction(actionName: string, handle: (action: ComponentAction) => void) {
    modifyBuiltinComponentAction(actionName, handle);
  }
}
