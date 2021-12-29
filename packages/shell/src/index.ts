import Detecting from './detecting';
// import Dragon from './dragon';
import DocumentModel from './document-model';
import Event from './event';
import History from './history';
import Material from './material';
import Node from './node';
import Project from './project';
import Prop from './prop';
import Selection from './selection';
import Setters from './setters';
import Hotkey from './hotkey';
import Skeleton from './skeleton';
import SettingPropEntry from './setting-prop-entry';
export * from './symbols';

/**
 * 所有 shell 层模型的 API 设计约定：
 *  1. 事件的命名格式为：on[Will|Did]VerbNoun?，参考 https://code.visualstudio.com/api/references/vscode-api#events
 *  2. 基于 Disposable 模式，对于事件的绑定、快捷键的绑定函数，返回值则是解绑函数
 *  3. 对于属性的导出，统一用 .xxx 的 getter 模式，不能使用 .getXxx()
 */
export {
  DocumentModel,
  Detecting,
  // Dragon,
  Event,
  History,
  Material,
  Node,
  Project,
  Prop,
  Selection,
  Setters,
  Hotkey,
  Skeleton,
  SettingPropEntry,
};