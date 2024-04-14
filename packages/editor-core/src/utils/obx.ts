import { observer } from 'mobx-react';
import * as mobx from 'mobx';

mobx.configure({ enforceActions: 'never' });

export {
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

export { observer, mobx };
