import { IPublicEnumDragObjectType } from '@alilc/lowcode-types';

export function isDragNodeObject(obj: any): boolean {
  return obj && obj.type === IPublicEnumDragObjectType.Node;
}