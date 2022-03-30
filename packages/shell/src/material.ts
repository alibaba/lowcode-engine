import { Editor } from '@alilc/lowcode-editor-core';
import {
  Designer,
  registerMetadataTransducer,
  MetadataTransducer,
  getRegisteredMetadataTransducers,
  addBuiltinComponentAction,
  removeBuiltinComponentAction,
  modifyBuiltinComponentAction,
  isComponentMeta,
} from '@alilc/lowcode-designer';
import { AssetsJson } from '@alilc/lowcode-utils';
import { ComponentAction, ComponentMetadata } from '@alilc/lowcode-types';
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
   * create an instance of ComponentMeta by given metadata
   * @param metadata
   * @returns
   */
  createComponentMeta(metadata: ComponentMetadata) {
    return ComponentMeta.create(this[designerSymbol].createComponentMeta(metadata));
  }

  /**
   * test if the given object is a ComponentMeta instance or not
   * @param obj
   * @returns
   */
  isComponentMeta(obj: any) {
    return isComponentMeta(obj);
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

  /**
   * 监听 assets 变化的事件
   * @param fn
   */
  onChangeAssets(fn: () => void) {
    // 设置 assets，经过 setAssets 赋值
    this[editorSymbol].onGot('assets', fn);
    // 增量设置 assets，经过 loadIncrementalAssets 赋值
    this[editorSymbol].on('designer.incrementalAssetsReady', fn);
  }
}
