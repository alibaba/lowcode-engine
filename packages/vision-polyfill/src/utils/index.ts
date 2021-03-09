import { designer } from '@ali/lowcode-engine';
export { isVariable } from '@ali/lowcode-utils';

export function getCurrentFieldIds() {
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

export function invariant(check: any, message: string, thing?: any) {
  if (!check) {
    throw new Error(`Invariant failed: ${ message }${thing ? ` in '${thing}'` : ''}`);
  }
}

