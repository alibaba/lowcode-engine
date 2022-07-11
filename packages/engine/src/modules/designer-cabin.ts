import {
  SettingField,
  isSettingField,
  Designer,
  TransformStage,
  LiveEditing,
  isDragNodeDataObject,
  DragObjectType,
  isNode,
} from '@alilc/lowcode-designer';
import { Editor } from '@alilc/lowcode-editor-core';
import { Dragon } from '@alilc/lowcode-shell';

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
  };
}