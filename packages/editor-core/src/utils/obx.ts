import { observer } from 'mobx-react';
import { configure } from 'mobx';

configure({ enforceActions: 'never' });

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
  flow
} from 'mobx';
export type { IReactionDisposer, IReactionPublic, IReactionOptions } from 'mobx';

export { observer };
