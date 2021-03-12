import { createElement } from 'react';
import { render } from 'react-dom';
import { globalContext, Editor } from '@ali/lowcode-editor-core';
import * as editorCabin from '@ali/lowcode-editor-core';
import {
  Designer,
  LowCodePluginManager,
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

const { project, currentSelection: selection } = designer;
const { Workbench } = skeletonCabin;
const setters = {
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

export async function init(container?: Element) {
  // 因为这里的 setter 可能已经用到了 VisualEngine 的 API，所以延迟到此加载，而不是一开始就加载
  const builtinSetters = require('@ali/lowcode-editor-setters').default;
  registerSetter(builtinSetters as any);
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
