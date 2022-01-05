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

  /**
   * 获取组件 map 结构
   */
  get componentsMap() {
    return this[designerSymbol].componentsMap;
  }

  /**
   * 设置「资产包」结构
   * @param assets
   * @returns
   */
  setAssets(assets: AssetsJson) {
    return this[editorSymbol].setAssets(assets);
  }

  /**
   * 获取「资产包」结构
   * @returns
   */
  getAssets() {
    return this[editorSymbol].get('assets');
  }

  /**
   * 加载增量的「资产包」结构，该增量包会与原有的合并
   * @param incrementalAssets
   * @returns
   */
  loadIncrementalAssets(incrementalAssets: AssetsJson) {
    return this[designerSymbol].loadIncrementalAssets(incrementalAssets);
  }

  /**
   * 注册物料元数据管道函数
   * @param transducer
   * @param level
   * @param id
   */
  registerMetadataTransducer(
    transducer: MetadataTransducer,
    level?: number,
    id?: string | undefined,
  ) {
    registerMetadataTransducer(transducer, level, id);
  }

  /**
   * 获取所有物料元数据管道函数
   * @returns
   */
  getRegisteredMetadataTransducers() {
    return getRegisteredMetadataTransducers();
  }

  /**
   * 获取指定名称的物料元数据
   * @param componentName
   * @returns
   */
  getComponentMeta(componentName: string) {
    return ComponentMeta.create(this[designerSymbol].getComponentMeta(componentName));
  }

  /**
   * 获取所有已注册的物料元数据
   * @returns
   */
  getComponentMetasMap() {
    const map = new Map<string, ComponentMeta>();
    const originalMap = this[designerSymbol].getComponentMetasMap();
    for (let componentName in originalMap.keys()) {
      map.set(componentName, this.getComponentMeta(componentName)!);
    }
    return map;
  }

  /**
   * 在设计器辅助层增加一个扩展 action
   * @param action
   */
  addBuiltinComponentAction(action: ComponentAction) {
    addBuiltinComponentAction(action);
  }

  /**
   * 移除设计器辅助层的指定 action
   * @param name
   */
  removeBuiltinComponentAction(name: string) {
    removeBuiltinComponentAction(name);
  }

  /**
   * 修改已有的设计器辅助层的指定 action
   * @param actionName
   * @param handle
   */
  modifyBuiltinComponentAction(actionName: string, handle: (action: ComponentAction) => void) {
    modifyBuiltinComponentAction(actionName, handle);
  }
}
