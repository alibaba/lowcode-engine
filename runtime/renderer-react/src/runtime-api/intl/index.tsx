import { parse, compile } from './parser';
import { createSignal, computed } from '../../signals';

export function createIntl(
  messages: Record<string, Record<string, string>>,
  defaultLocale: string,
) {
  const allMessages = createSignal(messages);
  const currentLocale = createSignal(defaultLocale);
  const currentMessages = computed(() => allMessages.value[currentLocale.value]);

  return {
    i18n(key: string, params: Record<string, string>) {
      const message = currentMessages.value[key];
      const result = compile(parse(message), params).join('');

      return result;
    },
    getLocale() {
      return currentLocale.value;
    },
    setLocale(locale: string) {
      currentLocale.value = locale;
    },

    addMessages(locale: string, messages: Record<string, string>) {
      allMessages.value[locale] = {
        ...allMessages.value[locale],
        ...messages,
      };
    },
  };
}
