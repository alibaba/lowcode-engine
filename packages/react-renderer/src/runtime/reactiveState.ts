import { signal, type StringDictionary, type InstanceStateApi } from '@alilc/lowcode-shared';
import { isPlainObject } from 'lodash-es';

export function reactiveStateFactory(initState: StringDictionary): InstanceStateApi {
  const proxyState = signal(initState);

  return {
    get state() {
      return proxyState.value;
    },
    setState(newState) {
      if (!isPlainObject(newState)) {
        throw Error('newState mush be a object');
      }

      Object.keys(newState as StringDictionary).forEach((key) => {
        proxyState.value[key] = (newState as StringDictionary)[key];
      });
    },
  };
}
