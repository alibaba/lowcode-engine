import { Editor, engineConfig, Setters as InnerSetters } from '@alilc/lowcode-editor-core';
import {
  Designer,
  LowCodePluginManager,
  TransformStage,
} from '@alilc/lowcode-designer';
import {
  Skeleton as InnerSkeleton,
} from '@alilc/lowcode-editor-skeleton';
import {
  // EditorWindow,
  WorkSpace,
} from '@alilc/lowcode-workspace';

import { Hotkey, Project, Skeleton, Setters, Material, Event } from '@alilc/lowcode-shell';
import { getLogger } from '@alilc/lowcode-utils';
import { setterRegistry } from 'engine/src/inner-plugins/setter-registry';
import { componentMetaParser } from 'engine/src/inner-plugins/component-meta-parser';
import defaultPanelRegistry from 'engine/src/inner-plugins/default-panel-registry';
import { EditorWindow } from './editor-window/context';

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
  innerProject;
  editor: Editor;
  designer;
  registerInnerPlugins: any;
  innerSetters: any;
  innerSkeleton: any;

  constructor(workSpace: WorkSpace, name: string, public editorWindow?: EditorWindow) {
    const editor = new Editor(name, true);

    // globalContext.register(editor, Editor);
    // globalContext.register(editor, 'editor');
    // if (editorWindow) {
    // }
    // const project = editorWindow ? editorWindow.project : new Project(innerProject);
    // if (editorWindow) {
    // }

    const innerSkeleton = new InnerSkeleton(editor, name);
    editor.set('skeleton' as any, innerSkeleton);

    const designer: Designer = new Designer({
      editor,
      name,
    });
    editor.set('designer' as any, designer);

    const plugins = new LowCodePluginManager(editor).toProxy();
    editor.set('plugins' as any, plugins);

    const { project: innerProject } = designer;
    const hotkey = new Hotkey(name);
    const innerSetters = new InnerSetters(name);
    const setters = new Setters(innerSetters, true);
    const material = new Material(editor, true, name);
    const project = new Project(innerProject, true);
    const config = engineConfig;
    const event = new Event(editor, { prefix: 'common' });
    const logger = getLogger({ level: 'warn', bizName: 'common' });
    const skeleton = new Skeleton(innerSkeleton, true);
    editor.set('setters', setters);
    editor.set('project', project);
    editor.set('material', material);
    this.innerSetters = innerSetters;
    this.innerSkeleton = innerSkeleton;
    this.skeleton = skeleton;
    this.plugins = plugins;
    this.innerProject = innerProject;
    this.project = project;
    this.setters = setters;
    this.material = material;
    this.config = config;
    this.event = event;
    this.logger = logger;
    this.hotkey = hotkey;
    this.editor = editor;
    this.designer = designer;

    // 注册一批内置插件
    this.registerInnerPlugins = async function registerPlugins() {
      // console.log('ctx', ctx);
      await plugins.register(componentMetaParser(designer));
      await plugins.register(setterRegistry);
      await plugins.register(defaultPanelRegistry(editor, designer));
    };
  }

  // get project() {
  //   return this.editorWindow ? this.editorWindow.project : this._project;
  // }
}