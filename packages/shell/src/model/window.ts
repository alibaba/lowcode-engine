import { windowSymbol } from '../symbols';
import { IPublicModelResource, IPublicModelWindow, IPublicTypeDisposable } from '@alilc/lowcode-types';
import { EditorWindow } from '@alilc/lowcode-workspace';
import { Resource as ShellResource } from './resource';

export class Window implements IPublicModelWindow {
  private readonly [windowSymbol]: EditorWindow;

  get id() {
    return this[windowSymbol]?.id;
  }

  get title() {
    return this[windowSymbol].title;
  }

  get icon() {
    return this[windowSymbol].icon;
  }

  get resource(): IPublicModelResource {
    return new ShellResource(this[windowSymbol].resource);
  }

  constructor(editorWindow: EditorWindow) {
    this[windowSymbol] = editorWindow;
  }

  importSchema(schema: any): any {
    this[windowSymbol].importSchema(schema);
  }

  changeViewType(viewName: string) {
    this[windowSymbol].changeViewType(viewName, false);
  }

  onChangeViewType(fun: (viewName: string) => void): IPublicTypeDisposable {
    return this[windowSymbol].onChangeViewType(fun);
  }

  async save() {
    return await this[windowSymbol].save();
  }
}
