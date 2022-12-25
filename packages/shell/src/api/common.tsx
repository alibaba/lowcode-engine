import { editorSymbol, skeletonSymbol, designerCabinSymbol, designerSymbol } from '../symbols';
import {
  isFormEvent as innerIsFormEvent,
  compatibleLegaoSchema as innerCompatibleLegaoSchema,
  getNodeSchemaById as innerGetNodeSchemaById,
  transactionManager,
  isNodeSchema as innerIsNodeSchema,
  isDragNodeDataObject as innerIsDragNodeDataObject,
  isDragNodeObject as innerIsDragNodeObject,
  isDragAnyObject as innerIsDragAnyObject,
  isLocationChildrenDetail as innerIsLocationChildrenDetail,
  isNode as innerIsNode,
  isSettingField,
  isSettingField as innerIsSettingField,
} from '@alilc/lowcode-utils';
import {
  IPublicTypeNodeSchema,
  IPublicEnumTransitionType,
  IPublicEnumTransformStage as InnerTransitionStage,
  IPublicApiCommonDesignerCabin,
  IPublicApiCommonSkeletonCabin,
  IPublicApiCommonUtils,
  IPublicApiCommon,
  IPublicEnumDragObjectType as InnerDragObjectType,
  IPublicTypeLocationDetailType as InnerLocationDetailType,
  IPublicApiCommonEditorCabin,
  IPublicModelDragon,
  IDesigner,
} from '@alilc/lowcode-types';
import {
  SettingField as InnerSettingField,
  LiveEditing as InnerLiveEditing,
  isShaken as innerIsShaken,
  contains as innerContains,
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
import {
  Editor,
  Title as InnerTitle,
  Tip as InnerTip,
  shallowIntl as innerShallowIntl,
  createIntl as innerCreateIntl,
  intl as innerIntl,
  globalLocale as innerGlobalLocale,
  obx as innerObx,
  observable as innerObservable,
  makeObservable as innerMakeObservable,
  untracked as innerUntracked,
  computed as innerComputed,
  observer as innerObserver,
} from '@alilc/lowcode-editor-core';
import { Dragon } from '../model';
import { ReactNode, Component } from 'react';

class DesignerCabin implements IPublicApiCommonDesignerCabin {
  private readonly [editorSymbol]: Editor;
  /**
   * @deprecated
   */
  readonly [designerCabinSymbol]: any;

  private get [designerSymbol](): IDesigner {
    return this[editorSymbol].get('designer') as IDesigner;
  }

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
   * @deprecated use same function from @alilc/lowcode-utils directly
   */
  isSettingField(obj: any): boolean {
    return isSettingField(obj);
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

  /**
   * @deprecated please use canvas.dragon
   */
  get dragon(): IPublicModelDragon | null {
    return Dragon.create(this[designerSymbol].dragon);
  }
}

class SkeletonCabin implements IPublicApiCommonSkeletonCabin {
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

class Utils implements IPublicApiCommonUtils {
  isNodeSchema(data: any): data is IPublicTypeNodeSchema {
    return innerIsNodeSchema(data);
  }

  isFormEvent(e: KeyboardEvent | MouseEvent): boolean {
    return innerIsFormEvent(e);
  }

  /**
   * @deprecated this is a legacy api, do not use this if not using is already
   */
  compatibleLegaoSchema(props: any): any {
    return innerCompatibleLegaoSchema(props);
  }

  getNodeSchemaById(
      schema: IPublicTypeNodeSchema,
      nodeId: string,
    ): IPublicTypeNodeSchema | undefined {
    return innerGetNodeSchemaById(schema, nodeId);
  }

  getConvertedExtraKey(key: string): string {
    return innerGetConvertedExtraKey(key);
  }

  getOriginalExtraKey(key: string): string {
    return innerGetOriginalExtraKey(key);
  }

  executeTransaction(
      fn: () => void,
      type: IPublicEnumTransitionType = IPublicEnumTransitionType.REPAINT,
    ): void {
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

class EditorCabin implements IPublicApiCommonEditorCabin {
  private readonly [editorSymbol]: Editor;

  constructor(editor: Editor) {
    this[editorSymbol] = editor;
  }
  /**
   * Title 组件
   * @experimental unstable API, pay extra caution when trying to use this
   */
  get Title(): Component {
    return InnerTitle;
  }

  /**
   * Tip 组件
   * @experimental unstable API, pay extra caution when trying to use this
   */
  get Tip(): Component {
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
   * @deprecated use common.utils.createIntl instead
   */
  get globalLocale(): any {
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


export class Common implements IPublicApiCommon {
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

  /**
   * 历史原因导致此处设计不合理，慎用。
   * this load of crap will be removed in some future versions, don`t use it.
   * @deprecated use canvas api instead
   */
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