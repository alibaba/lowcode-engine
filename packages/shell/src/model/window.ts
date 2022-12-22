import { windowSymbol } from '../symbols';
import { IPublicModelWindow } from '@alilc/lowcode-types';
import { EditorWindow } from '@alilc/lowcode-workspace';

export class Window implements IPublicModelWindow {
  private readonly [windowSymbol]: EditorWindow;

  constructor(editorWindow: EditorWindow) {
    this[windowSymbol] = editorWindow;
  }

  importSchema(schema: any): any {
    this[windowSymbol].importSchema(schema);
  }

  changeViewType(viewName: string) {
    this[windowSymbol].changeViewType(viewName);
  }

  save() {
    return this[windowSymbol].save();
  }
}
