import { createElement } from 'react';
import { render } from 'react-dom';
import { globalContext, Editor } from '@ali/lowcode-editor-core';
import * as editorCabin from '@ali/lowcode-editor-core';
import {
  Designer,
  LowCodePluginManager,
  ILowCodePluginContext,
  Setters,
} from '@ali/lowcode-designer';
import * as designerCabin from '@ali/lowcode-designer';
import { Skeleton, SettingsPrimaryPane, registerDefaults } from '@ali/lowcode-editor-skeleton';
import * as skeletonCabin from '@ali/lowcode-editor-skeleton';
import Outline, { OutlineBackupPane, getTreeMaster } from '@ali/lowcode-plugin-outline-pane';
import DesignerPlugin from '@ali/lowcode-plugin-designer';
import './modules/live-editing';

export * from './modules/editor-types';
export * from './modules/skeleton-types';
export * from './modules/designer-types';
// export * from './modules/lowcode-types';

const { hotkey, monitor, getSetter, registerSetter, getSettersMap } = editorCabin;
registerDefaults();

const editor = new Editor();
globalContext.register(editor, Editor);
globalContext.register(editor, 'editor');

const skeleton = new Skeleton(editor);
editor.set(Skeleton, skeleton);
editor.set('skeleton' as any, skeleton);

const designer = new Designer({ editor });
editor.set(Designer, designer);
editor.set('designer' as any, designer);

const plugins = new LowCodePluginManager(editor).toProxy();
editor.set('plugins' as any, plugins);

const { project, currentSelection: selection } = designer;
const { Workbench } = skeletonCabin;
const setters: Setters = {
  getSetter,
  registerSetter,
  getSettersMap,
};

export {
  editor,
  editorCabin,
  skeleton,
  skeletonCabin,
  designer,
  designerCabin,
  plugins,
  setters,
  project,
  selection,
  /**
   * 注册一些全局的切面
   */
  // hooks,
  /**
   * 全局的一些数据存储
   */
  // store,
  hotkey,
  monitor,
};

const getSelection = () => designer.currentDocument?.selection;
// TODO: build-plugin-component 的 umd 开发态没有导出 AliLowCodeEngine，这里先简单绕过
(window as any).AliLowCodeEngine = {
  editor,
  editorCabin,
  skeleton,
  skeletonCabin,
  designer,
  designerCabin,
  plugins,
  setters,
  project,
  get selection() {
    return getSelection();
  },
  /**
   * 注册一些全局的切面
   */
  // hooks,
  /**
   * 全局的一些数据存储
   */
  // store,
  hotkey,
  monitor,
  init,
};

// 注册默认的 setters
plugins.register((ctx: ILowCodePluginContext) => {
  return {
    name: '___setter_registry___',
    init() {
      const builtinSetters = require('@ali/lowcode-engine-ext')?.setters;
      if (builtinSetters) {
        ctx.setters.registerSetter(builtinSetters);
      }
    },
  };
});

// 注册默认的面板
plugins.register((ctx: ILowCodePluginContext) => {
  return {
    name: '___default_panel___',
    init() {
      skeleton.add({
        area: 'mainArea',
        name: 'designer',
        type: 'Widget',
        content: DesignerPlugin,
      });
      skeleton.add({
        area: 'rightArea',
        name: 'settingsPane',
        type: 'Panel',
        content: SettingsPrimaryPane,
        props: {
          ignoreRoot: true,
        },
      });
      skeleton.add({
        area: 'leftArea',
        name: 'outlinePane',
        type: 'PanelDock',
        content: Outline,
        panelProps: {
          area: 'leftFixedArea',
        },
      });
      skeleton.add({
        area: 'rightArea',
        name: 'backupOutline',
        type: 'Panel',
        props: {
          condition: () => {
            return designer.dragon.dragging && !getTreeMaster(designer).hasVisibleTreeBoard();
          },
        },
        content: OutlineBackupPane,
      });
    },
  };
});

export async function init(container?: Element) {
  let engineContainer = container;
  if (!engineContainer) {
    engineContainer = document.createElement('div');
    document.body.appendChild(engineContainer);
  }
  engineContainer.id = 'engine';

  await plugins.init();
  render(
    createElement(Workbench, {
      skeleton,
      className: 'engine-main',
      topAreaItemClassName: 'engine-actionitem',
    }),
    engineContainer,
  );
}
