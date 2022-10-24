import { globalContext } from '@alilc/lowcode-editor-core';
import { nodeSymbol } from '../symbols';

export function createLocation(locationData: any) {
  const editor = globalContext.get('editor');
  const designer = editor.get('designer')!;
  // make sure target is InnerNode instance, or the inner createLocation will break.
  locationData.target = locationData.target[nodeSymbol] || locationData.target;
  return designer.createLocation(locationData);
}
