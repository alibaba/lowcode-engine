import Detecting from './detecting';
// import Dragon from './dragon';
import DocumentModel from './document-model';
import Event, { getEvent } from './event';
import History from './history';
import Material from './material';
import Node from './node';
import NodeChildren from './node-children';
import Project from './project';
import Prop from './prop';
import Selection from './selection';
import Setters from './setters';
import Hotkey from './hotkey';
import Skeleton from './skeleton';
import Dragon from './dragon';
import SettingPropEntry from './setting-prop-entry';
import SettingTopEntry from './setting-top-entry';
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
  // Dragon,
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
  Skeleton,
  SettingPropEntry,
  SettingTopEntry,
  Dragon,
  getEvent,
};