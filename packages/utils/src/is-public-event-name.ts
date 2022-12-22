import { IPublicEnumEventNames } from '@alilc/lowcode-types';

export function isPublicEventName(eventName: string): boolean {
  for (const publicEvent in IPublicEnumEventNames) {
    if (eventName === (IPublicEnumEventNames as any)[publicEvent]) {
      return true;
    }
  }
  return false;
}