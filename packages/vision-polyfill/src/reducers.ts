import { isJSBlock, isJSExpression, isJSSlot } from '@ali/lowcode-types';
import { isPlainObject, hasOwnProperty, cloneDeep, isI18NObject, isUseI18NSetter, convertToI18NObject, isString } from '@ali/lowcode-utils';
import { editor, designer, designerHelper } from '@ali/lowcode-engine';
import bus from './bus';
import { VE_EVENTS } from './base/const';

import { deepValueParser } from './deep-value-parser';
import { liveEditingRule, liveEditingSaveHander } from './vc-live-editing';
import {
  compatibleReducer,
  upgradePageLifeCyclesReducer,
  stylePropsReducer,
  upgradePropsReducer,
  filterReducer,
  removeEmptyPropsReducer,
  initNodeReducer,
  liveLifecycleReducer,
  nodeTopFixedReducer,
} from './props-reducers';

const { LiveEditing, TransformStage } = designerHelper;

LiveEditing.addLiveEditingSpecificRule(liveEditingRule);
LiveEditing.addLiveEditingSaveHandler(liveEditingSaveHander);

designer.project.onCurrentDocumentChange((doc) => {
  bus.emit(VE_EVENTS.VE_PAGE_PAGE_READY);
  editor.set('currentDocument', doc);
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
designer.addPropsReducer(upgradePageLifeCyclesReducer, TransformStage.Save);

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
