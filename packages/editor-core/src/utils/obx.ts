import { observer } from 'mobx-react';
import { configure } from 'mobx';

configure({ enforceActions: 'never' });

// 常用的直接导出，其他的以 mobx 命名空间导出
export {
  observable as obx,
  observable,
  observe,
  autorun,
  makeObservable,
  makeAutoObservable,
  reaction,
  computed,
  action,
  runInAction,
  untracked,
  IReactionDisposer,
  IReactionPublic,
  IReactionOptions,
} from 'mobx';
export * as mobx from 'mobx';
export { observer };