import { Editor, EngineConfig, engineConfig } from '@ali/lowcode-editor-core';
import { Designer } from '@ali/lowcode-designer';
import { Skeleton as InnerSkeleton } from '@ali/lowcode-editor-skeleton';
import {
  Hotkey,
  Project,
  Skeleton,
  Setters,
  Material,
  Event,
  editorSymbol,
  designerSymbol,
  skeletonSymbol,
} from '@ali/lowcode-shell';
import { getLogger, Logger } from '@ali/lowcode-utils';
import { ILowCodePluginContext, PluginContextOptions } from './plugin-types';

export default class PluginContext implements ILowCodePluginContext {
  private readonly [editorSymbol]: Editor;
  private readonly [designerSymbol]: Designer;
  private readonly [skeletonSymbol]: InnerSkeleton;
  public hotkey: Hotkey;
  public project: Project;
  public skeleton: Skeleton;
  public logger: Logger;
  public setters: Setters;
  public material: Material;
  public config: EngineConfig;
  public event: Event;

  constructor(editor: Editor, options: PluginContextOptions) {
    this[editorSymbol] = editor;
    const designer = this[designerSymbol] = editor.get('designer')!;
    const skeleton = this[skeletonSymbol] = editor.get('skeleton')!;

    const { pluginName = 'anonymous' } = options;
    const project = designer.project;
    this.hotkey = new Hotkey();
    this.project = new Project(project);
    this.skeleton = new Skeleton(skeleton);
    this.setters = new Setters();
    this.material = new Material(editor);
    this.config = engineConfig;
    this.event = new Event(editor, { prefix: `plugin:${pluginName}` });
    this.logger = getLogger({ level: 'warn', bizName: `designer:plugin:${pluginName}` });
  }
}
