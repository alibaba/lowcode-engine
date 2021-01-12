import { createElement } from 'react';
import { render } from 'react-dom';
import { globalContext, Editor } from '@ali/lowcode-editor-core';
import { Designer, LiveEditing, TransformStage, Node, getConvertedExtraKey, LowCodePluginManager } from '@ali/lowcode-designer';
import Outline, { OutlineBackupPane, getTreeMaster } from '@ali/lowcode-plugin-outline-pane';
import * as editorHelper from '@ali/lowcode-editor-core';
import * as designerHelper from '@ali/lowcode-designer';
import * as skeletonHelper from '@ali/lowcode-editor-skeleton';
import DesignerPlugin from '@ali/lowcode-plugin-designer';
import { Skeleton, SettingsPrimaryPane, registerDefaults } from '@ali/lowcode-editor-skeleton';

const editor = new Editor();
globalContext.register(editor, Editor);

const skeleton = new Skeleton(editor);
editor.set(Skeleton, skeleton);
editor.set('skeleton', skeleton);
registerDefaults();

const designer = new Designer({ editor });
editor.set(Designer, designer);
editor.set('designer', designer);

const plugins = (new LowCodePluginManager(editor)).toProxy();
editor.set('plugins', plugins);

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
const { hotkey, monitor, getSetter, registerSetter } = editorHelper;
const { Workbench } = skeletonHelper;
const setters = {
  getSetter,
  registerSetter,
};

export {
  editor,
  editorHelper,
  skeleton,
  skeletonHelper,
  designer,
  designerHelper,
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

// TODO: build-plugin-component 的 umd 开发态没有导出 AliLowCodeEngine，这里先简单绕过
(window as any).AliLowCodeEngine = {
  editor,
  editorHelper,
  skeleton,
  skeletonHelper,
  designer,
  designerHelper,
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
