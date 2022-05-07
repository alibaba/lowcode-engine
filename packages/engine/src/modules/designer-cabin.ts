import {
  SettingField,
  isSettingField,
  Designer,
  TransformStage,
  LiveEditing,
  DragObjectType,
  isNode,
  isDragNodeObject,
  isDragNodeDataObject,
  isSimulatorHost,
} from '@alilc/lowcode-designer';
import { Editor } from '@alilc/lowcode-editor-core';
import { Dragon, DesignerView } from '@alilc/lowcode-shell';

export default function getDesignerCabin(editor: Editor) {
  const designer = editor.get('designer') as Designer;

  return {
    SettingField,
    isSettingField,
    dragon: Dragon.create(designer.dragon),
    isDragNodeObject,
    isDragNodeDataObject,
    DesignerView,
    TransformStage,
    LiveEditing,
    DragObjectType,
    isNode,
    isSimulatorHost,
  };
}