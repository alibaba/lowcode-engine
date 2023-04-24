/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import {
  globalContext,
  Editor,
  commonEvent,
  engineConfig,
  Setters as InnerSetters,
  Hotkey as InnerHotkey,
  IEditor,
} from '@alilc/lowcode-editor-core';
import {
  IPublicTypeEngineOptions,
  IPublicModelDocumentModel,
  IPublicTypePluginMeta,
  IPublicTypeDisposable,
  IPublicApiPlugins,
  IPublicApiWorkspace,
  IPublicEnumPluginRegisterLevel,
} from '@alilc/lowcode-types';
import {
  Designer,
  LowCodePluginManager,
  ILowCodePluginContextPrivate,
  ILowCodePluginContextApiAssembler,
  PluginPreference,
  IDesigner,
} from '@alilc/lowcode-designer';
import {
  Skeleton as InnerSkeleton,
  registerDefaults,
} from '@alilc/lowcode-editor-skeleton';
import {
  Workspace as InnerWorkspace,
  Workbench as WorkSpaceWorkbench,
  IWorkspace,
} from '@alilc/lowcode-workspace';

import {
  Hotkey,
  Project,
  Skeleton,
  Setters,
  Material,
  Event,
  Plugins,
  Common,
  Logger,
  Canvas,
  Workspace,
  Config,
} from '@alilc/lowcode-shell';
import { isPlainObject } from '@alilc/lowcode-utils';
import './modules/live-editing';
import classes from './modules/classes';
import symbols from './modules/symbols';
import { componentMetaParser } from './inner-plugins/component-meta-parser';
import { setterRegistry } from './inner-plugins/setter-registry';
import { defaultPanelRegistry } from './inner-plugins/default-panel-registry';
import { shellModelFactory } from './modules/shell-model-factory';
import { builtinHotkey } from './inner-plugins/builtin-hotkey';
import { OutlinePlugin } from '@alilc/lowcode-plugin-outline-pane';

export * from './modules/skeleton-types';
export * from './modules/designer-types';
export * from './modules/lowcode-types';

async function registryInnerPlugin(designer: IDesigner, editor: IEditor, plugins: IPublicApiPlugins): Promise<IPublicTypeDisposable> {
  // 注册一批内置插件
  const componentMetaParserPlugin = componentMetaParser(designer);
  const defaultPanelRegistryPlugin = defaultPanelRegistry(editor);
  await plugins.register(OutlinePlugin, {}, { autoInit: true });
  await plugins.register(componentMetaParserPlugin);
  await plugins.register(setterRegistry, {});
  await plugins.register(defaultPanelRegistryPlugin);
  await plugins.register(builtinHotkey);
  await plugins.register(registerDefaults, {}, { autoInit: true });

  return () => {
    plugins.delete(OutlinePlugin.pluginName);
    plugins.delete(componentMetaParserPlugin.pluginName);
    plugins.delete(setterRegistry.pluginName);
    plugins.delete(defaultPanelRegistryPlugin.pluginName);
    plugins.delete(defaultPanelRegistryPlugin.pluginName);
    plugins.delete(builtinHotkey.pluginName);
    plugins.delete(registerDefaults.pluginName);
  };
}

const innerWorkspace: IWorkspace = new InnerWorkspace(registryInnerPlugin, shellModelFactory);
const workspace: IPublicApiWorkspace = new Workspace(innerWorkspace);
const editor = new Editor();
globalContext.register(editor, Editor);
globalContext.register(editor, 'editor');
globalContext.register(innerWorkspace, 'workspace');

const innerSkeleton = new InnerSkeleton(editor);
editor.set('skeleton' as any, innerSkeleton);

const designer = new Designer({ editor, shellModelFactory });
editor.set('designer' as any, designer);

const { project: innerProject } = designer;

const innerHotkey = new InnerHotkey();
const hotkey = new Hotkey(innerHotkey);
const project = new Project(innerProject);
const skeleton = new Skeleton(innerSkeleton, 'any', false);
const innerSetters = new InnerSetters();
const setters = new Setters(innerSetters);

const material = new Material(editor);
editor.set('project', project);
editor.set('setters' as any, setters);
editor.set('material', material);
editor.set('innerHotkey', innerHotkey);
const config = new Config(engineConfig);
const event = new Event(commonEvent, { prefix: 'common' });
const logger = new Logger({ level: 'warn', bizName: 'common' });
const common = new Common(editor, innerSkeleton);
const canvas = new Canvas(editor);
let plugins: Plugins;

const pluginContextApiAssembler: ILowCodePluginContextApiAssembler = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  assembleApis: (context: ILowCodePluginContextPrivate, pluginName: string, meta: IPublicTypePluginMeta) => {
    context.hotkey = hotkey;
    context.project = project;
    context.skeleton = new Skeleton(innerSkeleton, pluginName, false);
    context.setters = setters;
    context.material = material;
    const eventPrefix = meta?.eventPrefix || 'common';
    context.event = new Event(commonEvent, { prefix: eventPrefix });
    context.config = config;
    context.common = common;
    context.canvas = canvas;
    context.plugins = plugins;
    context.logger = new Logger({ level: 'warn', bizName: `plugin:${pluginName}` });
    context.workspace = workspace;
    context.registerLevel = IPublicEnumPluginRegisterLevel.Default;
  },
};

const innerPlugins = new LowCodePluginManager(pluginContextApiAssembler);
plugins = new Plugins(innerPlugins).toProxy();
editor.set('innerPlugins' as any, innerPlugins);
editor.set('plugins' as any, plugins);

export {
  skeleton,
  plugins,
  project,
  setters,
  material,
  config,
  event,
  logger,
  hotkey,
  common,
  workspace,
  canvas,
};
// declare this is open-source version
export const isOpenSource = true;
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  symbols,
  classes,
};
engineConfig.set('isOpenSource', isOpenSource);

// container which will host LowCodeEngine DOM
let engineContainer: HTMLElement;
// @ts-ignore webpack Define variable
export const version = VERSION_PLACEHOLDER;
engineConfig.set('ENGINE_VERSION', version);

const pluginPromise = registryInnerPlugin(designer, editor, plugins);

export async function init(
  container?: HTMLElement,
  options?: IPublicTypeEngineOptions,
  pluginPreference?: PluginPreference,
  ) {
  await destroy();
  let engineOptions = null;
  if (isPlainObject(container)) {
    engineOptions = container;
    engineContainer = document.createElement('div');
    engineContainer.id = 'engine';
    document.body.appendChild(engineContainer);
  } else {
    engineOptions = options;
    engineContainer = container;
    if (!container) {
      engineContainer = document.createElement('div');
      engineContainer.id = 'engine';
      document.body.appendChild(engineContainer);
    }
  }
  engineConfig.setEngineOptions(engineOptions as any);

  const { Workbench } = common.skeletonCabin;
  if (options && options.enableWorkspaceMode) {
    const disposeFun = await pluginPromise;
    disposeFun && disposeFun();
    render(
      createElement(WorkSpaceWorkbench, {
        workspace: innerWorkspace,
        // skeleton: workspace.skeleton,
        className: 'engine-main',
        topAreaItemClassName: 'engine-actionitem',
      }),
      engineContainer,
    );
    innerWorkspace.enableAutoOpenFirstWindow = engineConfig.get('enableAutoOpenFirstWindow', true);
    innerWorkspace.setActive(true);
    innerWorkspace.initWindow();
    innerHotkey.activate(false);
    await innerWorkspace.plugins.init(pluginPreference);
    return;
  }

  await plugins.init(pluginPreference as any);

  render(
    createElement(Workbench, {
      skeleton: innerSkeleton,
      className: 'engine-main',
      topAreaItemClassName: 'engine-actionitem',
    }),
    engineContainer,
  );
}

export async function destroy() {
  // remove all documents
  const { documents } = project;
  if (Array.isArray(documents) && documents.length > 0) {
    documents.forEach(((doc: IPublicModelDocumentModel) => project.removeDocument(doc)));
  }

  // TODO: delete plugins except for core plugins

  // unmount DOM container, this will trigger React componentWillUnmount lifeCycle,
  // so necessary cleanups will be done.
  engineContainer && unmountComponentAtNode(engineContainer);
}
