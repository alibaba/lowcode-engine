import { Editor, engineConfig, Setters as InnerSetters, Hotkey as InnerHotkey } from '@alilc/lowcode-editor-core';
import {
  Designer,
  ILowCodePluginContextApiAssembler,
  LowCodePluginManager,
  ILowCodePluginContextPrivate,
  Project as InnerProject,
} from '@alilc/lowcode-designer';
import {
  Skeleton as InnerSkeleton,
} from '@alilc/lowcode-editor-skeleton';
import {
  // EditorWindow,
  WorkSpace,
} from '@alilc/lowcode-workspace';

import {
  Hotkey,
  Plugins,
  Project,
  Skeleton,
  Setters,
  Material,
  Event,
  Common,
} from '@alilc/lowcode-shell';
import { getLogger } from '@alilc/lowcode-utils';
import { setterRegistry } from 'engine/src/inner-plugins/setter-registry';
import { componentMetaParser } from 'engine/src/inner-plugins/component-meta-parser';
import defaultPanelRegistry from 'engine/src/inner-plugins/default-panel-registry';
import { builtinHotkey } from 'engine/src/inner-plugins/builtin-hotkey';
import { EditorWindow } from './editor-window/context';
import { shellModelFactory } from './shell-model-factory';

export class BasicContext {
  skeleton: Skeleton;
  plugins: Plugins;
  project: Project;
  setters: Setters;
  material: Material;
  config;
  event;
  logger;
  hotkey: Hotkey;
  innerProject: InnerProject;
  editor: Editor;
  designer: Designer;
  registerInnerPlugins: () => Promise<void>;
  innerSetters: InnerSetters;
  innerSkeleton: any;
  innerHotkey: InnerHotkey;
  innerPlugins: LowCodePluginManager;

  constructor(workSpace: WorkSpace, name: string, public editorWindow?: EditorWindow) {
    const editor = new Editor(name, true);

    const innerSkeleton = new InnerSkeleton(editor, name);
    editor.set('skeleton' as any, innerSkeleton);

    const designer: Designer = new Designer({
      editor,
      name,
      shellModelFactory,
    });
    editor.set('designer' as any, designer);

    const { project: innerProject } = designer;
    const innerHotkey = new InnerHotkey(name);
    const hotkey = new Hotkey(innerHotkey, name, true);
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
    editor.set('hotkey', hotkey);
    editor.set('innerHotkey', innerHotkey);
    this.innerSetters = innerSetters;
    this.innerSkeleton = innerSkeleton;
    this.skeleton = skeleton;
    this.innerProject = innerProject;
    this.project = project;
    this.setters = setters;
    this.material = material;
    this.config = config;
    this.event = event;
    this.logger = logger;
    this.hotkey = hotkey;
    this.innerHotkey = innerHotkey;
    this.editor = editor;
    this.designer = designer;
    const common = new Common(editor, innerSkeleton);
    let plugins: any;

    const pluginContextApiAssembler: ILowCodePluginContextApiAssembler = {
      assembleApis: (context: ILowCodePluginContextPrivate) => {
        context.hotkey = hotkey;
        context.project = project;
        context.skeleton = skeleton;
        context.setters = setters;
        context.material = material;
        context.event = event;
        context.config = config;
        context.common = common;
        context.plugins = plugins;
      },
    };

    const innerPlugins = new LowCodePluginManager(pluginContextApiAssembler, name);
    this.innerPlugins = innerPlugins;
    plugins = new Plugins(innerPlugins, true).toProxy();
    editor.set('plugins' as any, plugins);
    editor.set('innerPlugins' as any, innerPlugins);
    this.plugins = plugins;

    // 注册一批内置插件
    this.registerInnerPlugins = async function registerPlugins() {
      await plugins.register(componentMetaParser(designer));
      await plugins.register(setterRegistry);
      await plugins.register(defaultPanelRegistry(editor, designer));
      await plugins.register(builtinHotkey);
    };
  }

  // get project() {
  //   return this.editorWindow ? this.editorWindow.project : this._project;
  // }
}