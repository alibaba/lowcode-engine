import { globalContext } from '@alilc/lowcode-editor-core';
import {
  IDesigner,
  isComponentMeta,
} from '@alilc/lowcode-designer';
import { IPublicTypeAssetsJson } from '@alilc/lowcode-utils';
import {
  IPublicTypeComponentAction,
  IPublicTypeComponentMetadata,
  IPublicApiMaterial,
  IPublicTypeMetadataTransducer,
  IPublicModelComponentMeta,
  IPublicTypeNpmInfo,
  IPublicModelEditor,
  IPublicTypeDisposable,
} from '@alilc/lowcode-types';
import { Workspace as InnerWorkspace } from '@alilc/lowcode-workspace';
import { editorSymbol, designerSymbol } from '../symbols';
import { ComponentMeta as ShellComponentMeta } from '../model';
import { ComponentType } from 'react';

const innerEditorSymbol = Symbol('editor');
export class Material implements IPublicApiMaterial {
  private readonly [innerEditorSymbol]: IPublicModelEditor;

  get [editorSymbol](): IPublicModelEditor {
    if (this.workspaceMode) {
      return this[innerEditorSymbol];
    }
    const workspace: InnerWorkspace = globalContext.get('workspace');
    if (workspace.isActive) {
      return workspace.window.editor;
    }

    return this[innerEditorSymbol];
  }

  get [designerSymbol](): IDesigner {
    return this[editorSymbol].get('designer')!;
  }

  constructor(editor: IPublicModelEditor, readonly workspaceMode: boolean = false) {
    this[innerEditorSymbol] = editor;
  }

  /**
   * 获取组件 map 结构
   */
  get componentsMap(): { [key: string]: IPublicTypeNpmInfo | ComponentType<any> | object } {
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
  getAssets(): IPublicTypeAssetsJson | undefined {
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
  registerMetadataTransducer = (
    transducer: IPublicTypeMetadataTransducer,
    level?: number,
    id?: string | undefined,
  ) => {
    this[designerSymbol].componentActions.registerMetadataTransducer(transducer, level, id);
  };

  /**
   * 获取所有物料元数据管道函数
   * @returns
   */
  getRegisteredMetadataTransducers() {
    return this[designerSymbol].componentActions.getRegisteredMetadataTransducers();
  }

  /**
   * 获取指定名称的物料元数据
   * @param componentName
   * @returns
   */
  getComponentMeta(componentName: string): IPublicModelComponentMeta | null {
    const innerMeta = this[designerSymbol].getComponentMeta(componentName);
    return ShellComponentMeta.create(innerMeta);
  }

  /**
   * create an instance of ComponentMeta by given metadata
   * @param metadata
   * @returns
   */
  createComponentMeta(metadata: IPublicTypeComponentMetadata) {
    return ShellComponentMeta.create(this[designerSymbol].createComponentMeta(metadata));
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
  addBuiltinComponentAction = (action: IPublicTypeComponentAction) => {
    this[designerSymbol].componentActions.addBuiltinComponentAction(action);
  };

  /**
   * 刷新 componentMetasMap，可触发模拟器里的 components 重新构建
   */
  refreshComponentMetasMap = () => {
    this[designerSymbol].refreshComponentMetasMap();
  };

  /**
   * 移除设计器辅助层的指定 action
   * @param name
   */
  removeBuiltinComponentAction(name: string) {
    this[designerSymbol].componentActions.removeBuiltinComponentAction(name);
  }

  /**
   * 修改已有的设计器辅助层的指定 action
   * @param actionName
   * @param handle
   */
  modifyBuiltinComponentAction(
      actionName: string,
      handle: (action: IPublicTypeComponentAction) => void,
    ) {
    this[designerSymbol].componentActions.modifyBuiltinComponentAction(actionName, handle);
  }

  /**
   * 监听 assets 变化的事件
   * @param fn
   */
  onChangeAssets(fn: () => void): IPublicTypeDisposable {
    const dispose = [
      // 设置 assets，经过 setAssets 赋值
      this[editorSymbol].onChange('assets', fn),
      // 增量设置 assets，经过 loadIncrementalAssets 赋值
      this[editorSymbol].eventBus.on('designer.incrementalAssetsReady', fn),
    ];

    return () => {
      dispose.forEach(d => d && d());
    };
  }
}
