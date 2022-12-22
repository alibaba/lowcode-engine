import { Editor, globalContext } from '@alilc/lowcode-editor-core';
import {
  Designer,
  registerMetadataTransducer,
  getRegisteredMetadataTransducers,
  addBuiltinComponentAction,
  removeBuiltinComponentAction,
  modifyBuiltinComponentAction,
  isComponentMeta,
} from '@alilc/lowcode-designer';
import { IPublicTypeAssetsJson } from '@alilc/lowcode-utils';
import {
  IPublicTypeComponentAction,
  IPublicTypeComponentMetadata,
  IPublicApiMaterial,
  IPublicTypeMetadataTransducer,
  IPublicModelComponentMeta,
} from '@alilc/lowcode-types';
import { Workspace } from '@alilc/lowcode-workspace';
import { editorSymbol, designerSymbol } from '../symbols';
import { ComponentMeta } from '../model/component-meta';

const innerEditorSymbol = Symbol('editor');
export class Material implements IPublicApiMaterial {
  private readonly [innerEditorSymbol]: Editor;

  get [editorSymbol](): Editor {
    if (this.workspaceMode) {
      return this[innerEditorSymbol];
    }
    const workspace: Workspace = globalContext.get('workspace');
    if (workspace.isActive) {
      return workspace.window.editor;
    }

    return this[innerEditorSymbol];
  }

  get [designerSymbol](): Designer {
    return this[editorSymbol].get('designer')!;
  }

  constructor(editor: Editor, readonly workspaceMode: boolean = false) {
    this[innerEditorSymbol] = editor;
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
  async setAssets(assets: IPublicTypeAssetsJson) {
    return await this[editorSymbol].setAssets(assets);
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
  loadIncrementalAssets(incrementalAssets: IPublicTypeAssetsJson) {
    return this[designerSymbol].loadIncrementalAssets(incrementalAssets);
  }

  /**
   * 注册物料元数据管道函数
   * @param transducer
   * @param level
   * @param id
   */
  registerMetadataTransducer(
    transducer: IPublicTypeMetadataTransducer,
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
  getComponentMeta(componentName: string): IPublicModelComponentMeta | null {
    const innerMeta = this[designerSymbol].getComponentMeta(componentName);
    return ComponentMeta.create(innerMeta);
  }

  /**
   * create an instance of ComponentMeta by given metadata
   * @param metadata
   * @returns
   */
  createComponentMeta(metadata: IPublicTypeComponentMetadata) {
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
  getComponentMetasMap(): Map<string, IPublicModelComponentMeta> {
    const map = new Map<string, IPublicModelComponentMeta>();
    const originalMap = this[designerSymbol].getComponentMetasMap();
    for (let componentName of originalMap.keys()) {
      map.set(componentName, this.getComponentMeta(componentName)!);
    }
    return map;
  }

  /**
   * 在设计器辅助层增加一个扩展 action
   * @param action
   */
  addBuiltinComponentAction(action: IPublicTypeComponentAction) {
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
  modifyBuiltinComponentAction(actionName: string, handle: (action: IPublicTypeComponentAction) => void) {
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
