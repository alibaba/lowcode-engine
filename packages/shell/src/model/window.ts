import { windowSymbol } from '../symbols';
import { IPublicModelResource, IPublicModelWindow, IPublicTypeDisposable } from '@alilc/lowcode-types';
import { IEditorWindow } from '@alilc/lowcode-workspace';
import { Resource as ShellResource } from './resource';
import { EditorView } from './editor-view';

export class Window implements IPublicModelWindow {
  private readonly [windowSymbol]: IEditorWindow;

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

  constructor(editorWindow: IEditorWindow) {
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

  get currentEditorView() {
    if (this[windowSymbol].editorView) {
      return new EditorView(this[windowSymbol].editorView).toProxy() as any;
    }
    return null;
  }

  get editorViews() {
    return Array.from(this[windowSymbol].editorViews.values()).map(d => new EditorView(d).toProxy() as any);
  }
}
