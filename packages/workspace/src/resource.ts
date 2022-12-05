import { EditorViewOptions, ResourceOptions } from '.';

export class Resource {
  constructor(options: ResourceOptions) {
    if (options.editorViews) {
      options.editorViews.forEach((d: any) => {
        this.editorViewMap.set(d.name, d);
      });
    }

    this.options = options;
  }

  options: ResourceOptions;

  editorViewMap: Map<string, EditorViewOptions> = new Map<string, EditorViewOptions>();

  init(ctx: any) {
    this.options.init(ctx);
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
}