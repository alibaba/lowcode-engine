import { isJSBlock, isJSExpression, isJSSlot } from '@ali/lowcode-types';
import { isPlainObject, hasOwnProperty, cloneDeep, isI18NObject, isUseI18NSetter, convertToI18NObject, isString } from '@ali/lowcode-utils';
import { globalContext, Editor } from '@ali/lowcode-editor-core';
import { Designer, LiveEditing, TransformStage, Node, getConvertedExtraKey } from '@ali/lowcode-designer';
import Outline, { OutlineBackupPane, getTreeMaster } from '@ali/lowcode-plugin-outline-pane';
import bus from './bus';
import { VE_EVENTS } from './base/const';

import DesignerPlugin from '@ali/lowcode-plugin-designer';
import { Skeleton, SettingsPrimaryPane, registerDefaults } from '@ali/lowcode-editor-skeleton';

import { deepValueParser } from './deep-value-parser';
import { liveEditingRule, liveEditingSaveHander } from './vc-live-editing';
import {
  compatibleReducer,
  compatiblePageReducer,
  stylePropsReducer,
  upgradePropsReducer,
  filterReducer,
  removeEmptyPropsReducer,
  initNodeReducer,
  liveLifecycleReducer,
  nodeTopFixedReducer,
} from './props-reducers';

export const editor = new Editor();
globalContext.register(editor, Editor);

export const skeleton = new Skeleton(editor);
editor.set(Skeleton, skeleton);
editor.set('skeleton', skeleton);
registerDefaults();

export const designer = new Designer({ editor });
editor.set(Designer, designer);
editor.set('designer', designer);

designer.project.onCurrentDocumentChange((doc) => {
  bus.emit(VE_EVENTS.VE_PAGE_PAGE_READY);
  editor.set('currentDocuemnt', doc);
});

// 升级 Props
designer.addPropsReducer(upgradePropsReducer, TransformStage.Upgrade);

// 节点 props 初始化
designer.addPropsReducer(initNodeReducer, TransformStage.Init);

designer.addPropsReducer(liveLifecycleReducer, TransformStage.Render);

designer.addPropsReducer(filterReducer, TransformStage.Save);
designer.addPropsReducer(filterReducer, TransformStage.Render);

// FIXME: Dirty fix, will remove this reducer
designer.addPropsReducer(compatibleReducer, TransformStage.Save);
// 兼容历史版本的 Page 组件
designer.addPropsReducer(compatiblePageReducer, TransformStage.Save);

// 设计器组件样式处理
designer.addPropsReducer(stylePropsReducer, TransformStage.Render);
// 国际化 & Expression 渲染时处理
designer.addPropsReducer(deepValueParser, TransformStage.Render);

// Init 的时候没有拿到 dataSource, 只能在 Render 和 Save 的时候都调用一次，理论上执行时机在 Init
// Render 和 Save 都要各调用一次，感觉也是有问题的，是不是应该在 Render 执行一次就行了？见上 filterReducer 也是一样的处理方式。
designer.addPropsReducer(removeEmptyPropsReducer, TransformStage.Render);
designer.addPropsReducer(removeEmptyPropsReducer, TransformStage.Save);

designer.addPropsReducer(nodeTopFixedReducer, TransformStage.Render);
designer.addPropsReducer(nodeTopFixedReducer, TransformStage.Save);

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

LiveEditing.addLiveEditingSpecificRule(liveEditingRule);
LiveEditing.addLiveEditingSaveHandler(liveEditingSaveHander);
