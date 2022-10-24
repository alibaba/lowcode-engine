import {
  SettingField,
  isSettingField,
  Designer,
  TransformStage,
  LiveEditing,
  isDragNodeDataObject,
  isDragNodeObject,
  DragObjectType,
  isDragAnyObject,
  isNode,
  isShaken,
  contains,
  LocationDetailType,
  isLocationChildrenDetail,
  ScrollTarget,
} from '@alilc/lowcode-designer';
import { Editor } from '@alilc/lowcode-editor-core';
import { Dragon, ActiveTracker, createLocation, createScroller } from '@alilc/lowcode-shell';

export default function getDesignerCabin(editor: Editor) {
  const designer = editor.get('designer') as Designer;

  return {
    SettingField,
    isSettingField,
    dragon: Dragon.create(designer.dragon),
    activeTracker: ActiveTracker.create(designer.activeTracker),
    createLocation,
    createScroller,
    TransformStage,
    LiveEditing,
    DragObjectType,
    isDragNodeDataObject,
    isDragNodeObject,
    isDragAnyObject,
    isNode,
    isShaken,
    contains,
    LocationDetailType,
    isLocationChildrenDetail,
    ScrollTarget,
  };
}