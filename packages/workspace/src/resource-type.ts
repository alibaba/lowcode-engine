import { IPublicEditorView, IPublicModelResourceType, IPublicResourceOptions } from '@alilc/lowcode-types';

export class ResourceType implements IPublicModelResourceType {
  constructor(readonly name: string, readonly type: 'editor' | 'webview', options: IPublicResourceOptions) {
    if (options.editorViews) {
      options.editorViews.forEach((d: any) => {
        this.editorViewMap.set(d.viewName, d);
      });
    }

    this.options = options;
  }

  get description() {
    return this.options.description;
  }

  options: IPublicResourceOptions;

  editorViewMap: Map<string, IPublicEditorView> = new Map<string, IPublicEditorView>();

  init(ctx: any) {
    this.options.init(ctx);
  }

  get icon() {
    return this.options.icon;
  }

  async import(schema: any) {
    return await this.options.import?.(schema);
  }

  getEditorView(name: string) {
    return this.editorViewMap.get(name);
  }

  get defaultViewType() {
    return this.options.defaultViewType || this.editorViewMap.keys().next().value;
  }

  get editorViews() {
    return Array.from(this.editorViewMap.values());
  }

  async save(value: any) {
    return await this.options.save?.(value);
  }

  get title() {
    return this.options.defaultTitle;
  }
}