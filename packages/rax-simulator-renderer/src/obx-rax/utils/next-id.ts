import { globalState } from '../ global-state';
export function nextId() {
  return (++globalState.guid).toString(36).toLocaleLowerCase();
}
