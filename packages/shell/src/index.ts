import {
  Detecting,
  DocumentModel,
  History,
  Node,
  NodeChildren,
  Prop,
  Selection,
  Dragon,
  SettingTopEntry,
  Clipboard,
  SettingField,
  Window,
  SkeletonItem,
} from './model';
import {
  Project,
  Material,
  Logger,
  Plugins,
  Skeleton,
  Setters,
  Hotkey,
  Common,
  getEvent,
  Event,
  Canvas,
  Workspace,
  SimulatorHost,
  Config,
} from './api';

export * from './symbols';

/**
 * 所有 shell 层模型的 API 设计约定：
 *  1. 所有 API 命名空间都按照 variables / functions / events 来组织
 *  2. 事件（events）的命名格式为：on[Will|Did]VerbNoun?，参考 https://code.visualstudio.com/api/references/vscode-api#events
 *  3. 基于 Disposable 模式，对于事件的绑定、快捷键的绑定函数，返回值则是解绑函数
 *  4. 对于属性的导出，统一用 .xxx 的 getter 模式，不能使用 .getXxx()
 */
export {
  DocumentModel,
  Detecting,
  Event,
  History,
  Material,
  Node,
  NodeChildren,
  Project,
  Prop,
  Selection,
  Setters,
  Hotkey,
  Window,
  Skeleton,
  SettingField as SettingPropEntry,
  SettingTopEntry,
  Dragon,
  Common,
  getEvent,
  Plugins,
  Logger,
  Canvas,
  Workspace,
  Clipboard,
  SimulatorHost,
  Config,
  SettingField,
  SkeletonItem,
};
