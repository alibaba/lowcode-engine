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
} from '@alilc/lowcode-designer';
import { Editor } from '@alilc/lowcode-editor-core';
import { designerCabinSymbol, Dragon } from '@alilc/lowcode-shell';

export default function getDesignerCabin(editor: Editor) {
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
}