import { editorSymbol, skeletonSymbol, designerCabinSymbol } from './symbols';
import {
  isFormEvent as innerIsFormEvent,
  compatibleLegaoSchema as innerCompatibleLegaoSchema,
  getNodeSchemaById as innerGetNodeSchemaById,
} from '@alilc/lowcode-utils';
import {
  isNodeSchema as innerIsNodeSchema,
  NodeSchema,
  TransitionType,
} from '@alilc/lowcode-types';
import {
  SettingField,
  isSettingField,
  Designer,
  TransformStage,
  LiveEditing,
  isDragNodeDataObject,
  isDragNodeObject,
  isDragAnyObject,
  DragObjectType,
  isNode,
  isShaken,
  contains,
  LocationDetailType,
  isLocationChildrenDetail,
  ScrollTarget,
  getConvertedExtraKey as innerGetConvertedExtraKey,
  getOriginalExtraKey as innerGetOriginalExtraKey,
} from '@alilc/lowcode-designer';
import {
  Skeleton as InnerSkeleton,
  createSettingFieldView,
  PopupContext,
  PopupPipe,
  Workbench as InnerWorkbench,
} from '@alilc/lowcode-editor-skeleton';
import Dragon from './dragon';
import {
  Editor,
  Title as InnerTitle,
  Tip as InnerTip,
  shallowIntl,
  createIntl as innerCreateIntl,
  intl,
  // createSetterContent,
  obx,
  observable,
  makeObservable,
  untracked,
  computed,
  observer,
  globalLocale,
} from '@alilc/lowcode-editor-core';
import { ReactNode } from 'react';
import { transactionManager } from 'utils/src/transaction-manager';

const getDesignerCabin = (editor: Editor) => {
  const designer = editor.get('designer') as Designer;

  return {
    SettingField,
    isSettingField,
    dragon: Dragon.create(designer.dragon),
    TransformStage,
    LiveEditing,
    DragObjectType,
    isDragNodeDataObject,
    isNode,
    [designerCabinSymbol]: {
      isDragNodeObject,
      isDragAnyObject,
      isShaken,
      contains,
      LocationDetailType,
      isLocationChildrenDetail,
      ScrollTarget,
      isSettingField,
      TransformStage,
      SettingField,
      LiveEditing,
      DragObjectType,
      isDragNodeDataObject,
      isNode,
    },
  };
};

const getSkeletonCabin = (skeleton: InnerSkeleton) => {
  return {
    createSettingFieldView,
    PopupContext,
    PopupPipe,
    Workbench: (props: any) => <InnerWorkbench {...props} skeleton={skeleton} />, // hijack skeleton
  };
};

class Utils {
  readonly [editorSymbol]: Editor;

  constructor(editor: Editor) {
    this[editorSymbol] = editor;
  }

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

export default class Common {
  private readonly [editorSymbol]: Editor;
  private readonly [skeletonSymbol]: InnerSkeleton;
  private readonly __designerCabin: any;
  private readonly __skeletonCabin: any;
  private readonly __editorCabin: any;
  private readonly __utils: Utils;

  constructor(editor: Editor, skeleton: InnerSkeleton) {
    this[editorSymbol] = editor;
    this[skeletonSymbol] = skeleton;
    this.__designerCabin = getDesignerCabin(this[editorSymbol]);
    this.__skeletonCabin = getSkeletonCabin(this[skeletonSymbol]);
    this.__utils = new Utils(this[editorSymbol]);
  }

  objects = {
    TransformStage,
  };

  get utils(): any {
    return this.__utils;
  }

  get editorCabin(): any {
    const Setters = this[editorSymbol].get('setters');
    return {
      Title: InnerTitle,
      Tip: InnerTip,
      shallowIntl,
      createIntl: innerCreateIntl,
      intl,
      createSetterContent: Setters.createSetterContent,
      obx,
      observable,
      makeObservable,
      untracked,
      computed,
      observer,
      globalLocale,
    };
  }

  get designerCabin(): any {
    return this.__designerCabin;
  }

  get skeletonCabin(): any {
    return this.__skeletonCabin;
  }
}