/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import {
  Editor,
  engineConfig, Setters as InnerSetters,
  Hotkey as InnerHotkey,
  commonEvent,
} from '@alilc/lowcode-editor-core';
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
  Hotkey,
  Plugins,
  Project,
  Skeleton,
  Setters,
  Material,
  Event,
  Common,
  Logger,
  Workspace,
} from '@alilc/lowcode-shell';
import {
  IPublicTypePluginMeta,
} from '@alilc/lowcode-types';
import { getLogger } from '@alilc/lowcode-utils';
import { setterRegistry } from '../../engine/src/inner-plugins/setter-registry';
import { componentMetaParser } from '../../engine/src/inner-plugins/component-meta-parser';
import defaultPanelRegistry from '../../engine/src/inner-plugins/default-panel-registry';
import { builtinHotkey } from '../../engine/src/inner-plugins/builtin-hotkey';
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

  constructor(innerWorkspace: any, viewName: string, public editorWindow?: EditorWindow) {
    const editor = new Editor(viewName, true);

    const innerSkeleton = new InnerSkeleton(editor, viewName);
    editor.set('skeleton' as any, innerSkeleton);

    const designer: Designer = new Designer({
      editor,
      viewName,
      shellModelFactory,
    });
    editor.set('designer' as any, designer);

    const { project: innerProject } = designer;
    const workspace = new Workspace(innerWorkspace);
    const innerHotkey = new InnerHotkey(viewName);
    const hotkey = new Hotkey(innerHotkey, true);
    const innerSetters = new InnerSetters(viewName);
    const setters = new Setters(innerSetters, true);
    const material = new Material(editor, true);
    const project = new Project(innerProject, true);
    const config = engineConfig;
    const event = new Event(commonEvent, { prefix: 'common' });
    const logger = getLogger({ level: 'warn', bizName: 'common' });
    const skeleton = new Skeleton(innerSkeleton, 'any', true);
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
      assembleApis: (context: ILowCodePluginContextPrivate, pluginName: string, meta: IPublicTypePluginMeta) => {
        context.workspace = workspace;
        context.hotkey = hotkey;
        context.project = project;
        context.skeleton = new Skeleton(innerSkeleton, pluginName, true);
        context.setters = setters;
        context.material = material;
        const eventPrefix = meta?.eventPrefix || 'common';
        context.event = new Event(commonEvent, { prefix: eventPrefix });
        context.config = config;
        context.common = common;
        context.plugins = plugins;
        context.logger = new Logger({ level: 'warn', bizName: `plugin:${pluginName}` });
      },
    };

    const innerPlugins = new LowCodePluginManager(pluginContextApiAssembler, viewName);
    this.innerPlugins = innerPlugins;
    plugins = new Plugins(innerPlugins, true).toProxy();
    editor.set('plugins' as any, plugins);
    editor.set('innerPlugins' as any, innerPlugins);
    this.plugins = plugins;

    // 注册一批内置插件
    this.registerInnerPlugins = async function registerPlugins() {
      await plugins.register(componentMetaParser(designer));
      await plugins.register(setterRegistry, {}, { autoInit: true });
      await plugins.register(defaultPanelRegistry(editor, designer));
      await plugins.register(builtinHotkey);
    };
  }
}