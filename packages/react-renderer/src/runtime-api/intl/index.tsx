import { parse, compile } from './parser';
import { signal, computed } from '../../signals';

export function createIntl(
  messages: Record<string, Record<string, string>>,
  defaultLocale: string,
) {
  const allMessages = signal(messages);
  const currentLocale = signal(defaultLocale);
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
