import { globalContext } from '@alilc/lowcode-editor-core';

export function createScroller(scroller: any) {
  const editor = globalContext.get('editor');
  const designer = editor.get('designer')!;
  return designer.createScroller(scroller);
}
