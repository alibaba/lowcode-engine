import { globalContext, Editor } from '@ali/lowcode-editor-core';

interface Variable {
  type: 'variable';
  variable: string;
  value: any;
}

export function isVariable(obj: any): obj is Variable {
  return obj && obj.type === 'variable';
}

export function getCurrentFieldIds() {
  const editor = globalContext.get(Editor);
  const designer = editor.get('designer');
  const fieldIds: any = [];
  const nodesMap = designer?.currentDocument?.nodesMap || new Map();
  nodesMap.forEach((curNode: any) => {
    const fieldId = nodesMap?.get(curNode.id)?.getPropValue('fieldId');
    if (fieldId) {
      fieldIds.push(fieldId);
    }
  });
  return fieldIds;
}
