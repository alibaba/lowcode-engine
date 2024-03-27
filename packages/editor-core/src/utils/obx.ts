import { observer } from 'mobx-react';
import { configure } from 'mobx';
import * as mobx from 'mobx';

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
} from 'mobx';
export type { IReactionDisposer, IReactionPublic, IReactionOptions } from 'mobx';

export { observer, mobx };
