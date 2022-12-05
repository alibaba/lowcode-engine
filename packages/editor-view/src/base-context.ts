import { globalContext, Editor, engineConfig, Setters as InnerSetters, EngineOptions } from '@alilc/lowcode-editor-core';
import {
  Designer,
  LowCodePluginManager,
  TransformStage,
} from '@alilc/lowcode-designer';
import {
  Skeleton as InnerSkeleton,
} from '@alilc/lowcode-editor-skeleton';
import {
  WorkSpace,
} from '@alilc/lowcode-workspace';

import { Hotkey, Project, Skeleton, Setters, Material, Event } from '@alilc/lowcode-shell';
import { getLogger } from '@alilc/lowcode-utils';

export class BasicContext {
  skeleton;
  plugins;
  project;
  setters;
  material;
  config;
  event;
  logger;
  hotkey;

  constructor() {
    const editor = new Editor();
    // globalContext.register(editor, Editor);
    // globalContext.register(editor, 'editor');

    const innerSkeleton = new InnerSkeleton(editor);
    editor.set('skeleton' as any, innerSkeleton);

    const designer = new Designer({ editor });
    editor.set('designer' as any, designer);

    const plugins = new LowCodePluginManager(editor).toProxy();
    editor.set('plugins' as any, plugins);

    const { project: innerProject } = designer;
    // const skeletonCabin = getSkeletonCabin(innerSkeleton);
    // const { Workbench } = skeletonCabin;

    const hotkey = new Hotkey();
    const project = new Project(innerProject);
    const skeleton = new Skeleton(innerSkeleton);
    const innerSetters = new InnerSetters();
    const setters = new Setters(innerSetters);
    const material = new Material(editor);
    const config = engineConfig;
    const event = new Event(editor, { prefix: 'common' });
    const logger = getLogger({ level: 'warn', bizName: 'common' });
    // const designerCabin = getDesignerCabin(editor);
    const objects = {
      TransformStage,
    };
    const workSpace = new WorkSpace();
    this.skeleton = skeleton;
    this.plugins = plugins;
    this.project = project;
    this.setters = setters;
    this.material = material;
    this.config = config;
    this.event = event;
    this.logger = logger;
    this.hotkey = hotkey;
  }
}