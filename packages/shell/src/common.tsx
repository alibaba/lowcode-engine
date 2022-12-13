import { editorSymbol, skeletonSymbol, designerCabinSymbol } from './symbols';
import {
  isFormEvent as innerIsFormEvent,
  compatibleLegaoSchema as innerCompatibleLegaoSchema,
  getNodeSchemaById as innerGetNodeSchemaById,
  transactionManager,
  isNodeSchema as innerIsNodeSchema,
} from '@alilc/lowcode-utils';
import {
  NodeSchema,
  TransitionType,
  TransformStage as InnerTransitionStage,
  IPublicCommonDesignerCabin,
  IPublicCommonSkeletonCabin,
  IPublicCommonUtils,
  IPublicApiCommon,
  DragObjectType as InnerDragObjectType,
} from '@alilc/lowcode-types';
import {
  SettingField as InnerSettingField,
  isSettingField as innerIsSettingField,
  Designer,
  LiveEditing as InnerLiveEditing,
  isDragNodeDataObject as innerIsDragNodeDataObject,
  isDragNodeObject as innerIsDragNodeObject,
  isDragAnyObject as innerIsDragAnyObject,
  isNode as innerIsNode,
  isShaken as innerIsShaken,
  contains as innerContains,
  LocationDetailType as InnerLocationDetailType,
  isLocationChildrenDetail as innerIsLocationChildrenDetail,
  ScrollTarget as InnerScrollTarget,
  getConvertedExtraKey as innerGetConvertedExtraKey,
  getOriginalExtraKey as innerGetOriginalExtraKey,
} from '@alilc/lowcode-designer';
import {
  Skeleton as InnerSkeleton,
  createSettingFieldView as innerCreateSettingFieldView,
  PopupContext as InnerPopupContext,
  PopupPipe as InnerPopupPipe,
  Workbench as InnerWorkbench,
} from '@alilc/lowcode-editor-skeleton';
import Dragon from './dragon';
import {
  Editor,
  Title as InnerTitle,
  Tip as InnerTip,
  shallowIntl as innerShallowIntl,
  createIntl as innerCreateIntl,
  intl as innerIntl,
  // createSetterContent as innerCreateSetterContent,
  globalLocale as innerGlobalLocale,
  obx as innerObx,
  observable as innerObservable,
  makeObservable as innerMakeObservable,
  untracked as innerUntracked,
  computed as innerComputed,
  observer as innerObserver,
} from '@alilc/lowcode-editor-core';
import { ReactNode } from 'react';

class DesignerCabin implements IPublicCommonDesignerCabin {
  private readonly [editorSymbol]: Editor;
  /**
   * @deprecated
   */
  readonly [designerCabinSymbol]: any;

  constructor(editor: Editor) {
    this[editorSymbol] = editor;
    this[designerCabinSymbol] = {
      isDragNodeObject: innerIsDragNodeObject,
      isDragAnyObject: innerIsDragAnyObject,
      isShaken: innerIsShaken,
      contains: innerContains,
      LocationDetailType: InnerLocationDetailType,
      isLocationChildrenDetail: innerIsLocationChildrenDetail,
      ScrollTarget: InnerScrollTarget,
      isSettingField: innerIsSettingField,
      TransformStage: InnerTransitionStage,
      SettingField: InnerSettingField,
      LiveEditing: InnerLiveEditing,
      DragObjectType: InnerDragObjectType,
      isDragNodeDataObject: innerIsDragNodeDataObject,
      isNode: innerIsNode,
    };
  }

  /**
   * 是否是 SettingField 实例
   *
   * @param {*} obj
   * @returns {obj is SettingField}
   * @memberof DesignerCabin
   */
  isSettingField(obj: any): obj is InnerSettingField {
    return innerIsSettingField(obj);
  }

  /**
   * 转换类型枚举对象，包含 init / upgrade / render 等类型
   * [参考](https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/transform-stage.ts)
   * @deprecated use { TransformStage } from '@alilc/lowcode-types' instead
   */
  get TransformStage() {
    return InnerTransitionStage;
  }

  /**
   * @deprecated
   */
  get SettingField() {
    return InnerSettingField;
  }

  /**
   * @deprecated
   */
  get dragon() {
    const designer = this[editorSymbol].get('designer') as Designer;
    return Dragon.create(designer.dragon);
  }

  /**
   * @deprecated
   */
  get LiveEditing() {
    return InnerLiveEditing;
  }

  /**
   * @deprecated
   */
  get DragObjectType() {
    return InnerDragObjectType;
  }

  /**
   * @deprecated
   */
  isDragNodeDataObject(obj: any): boolean {
    return innerIsDragNodeDataObject(obj);
  }

  /**
   * @deprecated
   */
  isNode(node: any): boolean {
    return innerIsNode(node);
  }
}

class SkeletonCabin implements IPublicCommonSkeletonCabin {
  private readonly [skeletonSymbol]: InnerSkeleton;

  constructor(skeleton: InnerSkeleton) {
    this[skeletonSymbol] = skeleton;
  }

  get Workbench(): any {
    const innerSkeleton = this[skeletonSymbol];
    return (props: any) => <InnerWorkbench {...props} skeleton={innerSkeleton} />;
  }

  /**
   * @deprecated
   */
  createSettingFieldView(item: any, field: any) {
    return innerCreateSettingFieldView(item, field);
  }

  /**
   * @deprecated
   */
  get PopupContext(): any {
    return InnerPopupContext;
  }

  /**
   * @deprecated
   */
   get PopupPipe(): any {
    return InnerPopupPipe;
  }
}

class Utils implements IPublicCommonUtils {
  isNodeSchema(data: any): data is NodeSchema {
    return innerIsNodeSchema(data);
  }

  isFormEvent(e: KeyboardEvent | MouseEvent): boolean {
    return innerIsFormEvent(e);
  }

  compatibleLegaoSchema(props: any): any {
    return innerCompatibleLegaoSchema(props);
  }

  getNodeSchemaById(schema: NodeSchema, nodeId: string): NodeSchema | undefined {
    return innerGetNodeSchemaById(schema, nodeId);
  }

  getConvertedExtraKey(key: string): string {
    return innerGetConvertedExtraKey(key);
  }

  getOriginalExtraKey(key: string): string {
    return innerGetOriginalExtraKey(key);
  }

  executeTransaction(fn: () => void, type: TransitionType = TransitionType.REPAINT): void {
    transactionManager.executeTransaction(fn, type);
  }

  createIntl(instance: string | object): {
      intlNode(id: string, params?: object): ReactNode;
      intl(id: string, params?: object): string;
      getLocale(): string;
      setLocale(locale: string): void;
    } {
    return innerCreateIntl(instance);
  }
}

class EditorCabin {
  private readonly [editorSymbol]: Editor;

  constructor(editor: Editor) {
    this[editorSymbol] = editor;
  }
  /**
   * @deprecated
   */
  get Title() {
    return InnerTitle;
  }

  /**
   * @deprecated
   */
  get Tip() {
    return InnerTip;
  }

  /**
   * @deprecated
   */
  shallowIntl(data: any): any {
    return innerShallowIntl(data);
  }

  /**
   * @deprecated use common.utils.createIntl instead
   */
  createIntl(instance: any): any {
    return innerCreateIntl(instance);
  }

  /**
   * @deprecated
   */
  intl(data: any, params?: object): any {
    return innerIntl(data, params);
  }

  /**
   * @deprecated
   */
  createSetterContent = (setter: any, props: Record<string, any>): ReactNode => {
    const setters = this[editorSymbol].get('setters');
    return setters.createSetterContent(setter, props);
  };

  /**
   * @deprecated
   */
  get globalLocale() {
    return innerGlobalLocale;
  }

  /**
   * @deprecated
   */
  get obx() {
    return innerObx;
  }

  /**
   * @deprecated
   */
  get observable() {
    return innerObservable;
  }

  /**
   * @deprecated
   */
  makeObservable(target: any, annotations: any, options: any) {
    return innerMakeObservable(target, annotations, options);
  }

  /**
   * @deprecated
   */
  untracked(action: any) {
    return innerUntracked(action);
  }

  /**
   * @deprecated
   */
  get computed() {
    return innerComputed;
  }

  /**
   * @deprecated
   */
  observer(component: any) {
    return innerObserver(component);
  }
}


export default class Common implements IPublicApiCommon {
  private readonly __designerCabin: any;
  private readonly __skeletonCabin: any;
  private readonly __editorCabin: any;
  private readonly __utils: Utils;

  constructor(editor: Editor, skeleton: InnerSkeleton) {
    this.__designerCabin = new DesignerCabin(editor);
    this.__skeletonCabin = new SkeletonCabin(skeleton);
    this.__editorCabin = new EditorCabin(editor);
    this.__utils = new Utils();
  }

  get utils(): any {
    return this.__utils;
  }

  /**
   * 历史原因导致此处设计不合理，慎用。
   * this load of crap will be removed in some future versions, don`t use it.
   * @deprecated
   */
  get editorCabin(): any {
    return this.__editorCabin;
  }

  get designerCabin(): any {
    return this.__designerCabin;
  }

  get skeletonCabin(): any {
    return this.__skeletonCabin;
  }

  /**
   * 历史原因导致此处设计不合理，慎用。
   * this load of crap will be removed in some future versions, don`t use it.
   * @deprecated use { TransformStage } from '@alilc/lowcode-types' instead
   */
  get objects(): any {
    return {
      TransformStage: InnerTransitionStage,
    };
  }
}