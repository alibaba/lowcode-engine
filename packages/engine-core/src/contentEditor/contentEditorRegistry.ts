import { toDisposable, type IDisposable } from '@alilc/lowcode-shared';
import { IContentEditor } from './contentEditor';
import { Registry, Extensions } from '../extension/registry';

export interface IContentEditorRegistry {
  registerContentEditor(contentType: string, windowContent: IContentEditor, options?: IRegisterOptions): IDisposable;

  getContentEditor(contentType: string): IContentEditor | undefined;

  getContentTypeByExt(ext: string): string | undefined;
}

export interface IRegisterOptions {
  ext?: string;
}

class ContentEditorRegistryImpl implements IContentEditorRegistry {
  private readonly _contentEditors = new Map<string, IContentEditor>();
  private readonly _mapExtToType = new Map<string, string>();

  registerContentEditor(
    contentType: string,
    contentEditor: IContentEditor,
    options: IRegisterOptions = {},
  ): IDisposable {
    const { ext = contentType } = options;

    this._contentEditors.set(contentType, contentEditor);
    this._mapExtToType.set(ext, contentType);

    return toDisposable(() => {
      this._contentEditors.delete(contentType);
      this._mapExtToType.delete(contentType);
    });
  }

  getContentEditor(contentType: string): IContentEditor | undefined {
    return this._contentEditors.get(contentType);
  }

  getContentTypeByExt(ext: string): string | undefined {
    return this._mapExtToType.get(ext);
  }
}

export const ContentEditorRegistry = new ContentEditorRegistryImpl();

Registry.add(Extensions.ContentEditor, ContentEditorRegistry);
