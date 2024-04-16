import {
  Editor,
  engineConfig,
  Setters as InnerSetters,
  Hotkey as InnerHotkey,
  commonEvent,
  IEngineConfig,
  IHotKey,
  Command as InnerCommand,
} from '@alilc/lowcode-editor-core';
import {
  Designer,
  ILowCodePluginContextApiAssembler,
  LowCodePluginManager,
  ILowCodePluginContextPrivate,
  IProject,
  IDesigner,
  ILowCodePluginManager,
} from '@alilc/lowcode-designer';
import { ISkeleton, Skeleton as InnerSkeleton } from '@alilc/lowcode-editor-skeleton';
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
  Window,
  Canvas,
  CommonUI,
  Command,
} from '../../shell';
import {
  IPluginPreferenceMananger,
  IPublicApiCanvas,
  IPublicApiCommon,
  IPublicApiEvent,
  IPublicApiHotkey,
  IPublicApiMaterial,
  IPublicApiPlugins,
  IPublicApiProject,
  IPublicApiSetters,
  IPublicApiSkeleton,
  IPublicEnumPluginRegisterLevel,
  IPublicModelPluginContext,
  IPublicTypePluginMeta,
} from '@alilc/lowcode-types';
import { createLogger, Logger as InnerLogger } from '@alilc/lowcode-utils';
import { IWorkspace } from '../workspace';
import { IEditorWindow } from '../window';

export interface IBasicContext extends BasicContext {}

export class BasicContext
implements
    Omit<
      IPublicModelPluginContext,
      'workspace' | 'commonUI' | 'command' | 'isPluginRegisteredInWorkspace' | 'editorWindow'
    >
{
  skeleton: IPublicApiSkeleton;
  plugins: IPublicApiPlugins;
  project: IPublicApiProject;
  setters: IPublicApiSetters;
  material: IPublicApiMaterial;
  common: IPublicApiCommon;
  config: IEngineConfig;
  event: IPublicApiEvent;
  logger: InnerLogger;
  hotkey: IPublicApiHotkey;
  innerProject: IProject;
  editor: Editor;
  designer: IDesigner;
  registerInnerPlugins: () => Promise<void>;
  innerSetters: InnerSetters;
  innerSkeleton: ISkeleton;
  innerHotkey: IHotKey;
  innerPlugins: ILowCodePluginManager;
  canvas: IPublicApiCanvas;
  pluginEvent: IPublicApiEvent;
  preference: IPluginPreferenceMananger;
  workspace: IWorkspace;

  constructor(
    innerWorkspace: IWorkspace,
    viewName: string,
    readonly registerLevel: IPublicEnumPluginRegisterLevel,
    public editorWindow?: IEditorWindow,
  ) {
    const editor = new Editor(viewName, true);

    const innerSkeleton = new InnerSkeleton(editor, viewName);
    editor.set('skeleton' as any, innerSkeleton);

    const designer: Designer = new Designer({
      editor,
      viewName,
      shellModelFactory: innerWorkspace?.shellModelFactory,
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
    const logger = createLogger({ level: 'warn', bizName: 'common' });
    const skeleton = new Skeleton(innerSkeleton, 'any', true);
    const canvas = new Canvas(editor, true);
    const commonUI = new CommonUI(editor);
    const innerCommand = new InnerCommand();
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
    this.canvas = canvas;
    const common = new Common(editor, innerSkeleton);
    this.common = common;
    let plugins: IPublicApiPlugins;

    const pluginContextApiAssembler: ILowCodePluginContextApiAssembler = {
      assembleApis: (
        context: ILowCodePluginContextPrivate,
        pluginName: string,
        meta: IPublicTypePluginMeta,
      ) => {
        context.workspace = workspace;
        context.hotkey = hotkey;
        context.project = project;
        context.skeleton = new Skeleton(innerSkeleton, pluginName, true);
        context.setters = setters;
        context.material = material;
        const eventPrefix = meta?.eventPrefix || 'common';
        const commandScope = meta?.commandScope;
        context.event = new Event(commonEvent, { prefix: eventPrefix });
        context.config = config;
        context.common = common;
        context.plugins = plugins;
        context.logger = new Logger({ level: 'warn', bizName: `plugin:${pluginName}` });
        context.canvas = canvas;
        context.commonUI = commonUI;
        if (editorWindow) {
          context.editorWindow = new Window(editorWindow);
        }
        context.command = new Command(innerCommand, context as IPublicModelPluginContext, {
          commandScope,
        });
        context.registerLevel = registerLevel;
        context.isPluginRegisteredInWorkspace =
          registerLevel === IPublicEnumPluginRegisterLevel.Workspace;
        editor.set('pluginContext', context);
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
      await innerWorkspace?.registryInnerPlugin(designer, editor, plugins);
    };
  }
}
