import { signal, type PlainObject, type Spec } from '@alilc/lowcode-shared';
import { isPlainObject } from 'lodash-es';

export function reactiveStateCreator(initState: PlainObject): Spec.InstanceStateApi {
  const proxyState = signal(initState);

  return {
    get state() {
      return proxyState.value;
    },
    setState(newState) {
      if (!isPlainObject(newState)) {
        throw Error('newState mush be a object');
      }

      proxyState.value = {
        ...proxyState.value,
        ...newState,
      };
    },
  };
}
