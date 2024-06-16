import { createIntl, createIntlCache, type IntlShape as IntlFormatter } from '@formatjs/intl';
import { mapKeys } from 'lodash-es';
import { signal, computed, effect, type Signal, type ComputedSignal } from '../signals';

export { IntlFormatter };

export type Locale = string;
export type Translations = Record<string, string>;
export type LocaleTranslationsRecord = Record<Locale, Translations>;

export class Intl {
  private locale: Signal<Locale>;
  private messageStore: Signal<LocaleTranslationsRecord>;
  private currentMessage: ComputedSignal<Translations>;
  private intlShape: IntlFormatter;

  constructor(defaultLocale: string = navigator.language, messages: LocaleTranslationsRecord = {}) {
    if (defaultLocale) {
      defaultLocale = nomarlizeLocale(defaultLocale);
    } else {
      defaultLocale = 'zh-CN';
    }

    const messageStore = mapKeys(messages, (_, key) => {
      return nomarlizeLocale(key);
    });

    this.locale = signal(defaultLocale);
    this.messageStore = signal(messageStore);
    this.currentMessage = computed(() => {
      return this.messageStore.value[this.locale.value] ?? {};
    });

    effect(() => {
      const cache = createIntlCache();
      this.intlShape = createIntl(
        {
          locale: this.locale.value,
          messages: this.currentMessage.value,
        },
        cache,
      );
    });
  }

  getLocale() {
    return this.locale.value;
  }

  setLocale(locale: Locale) {
    const nomarlizedLocale = nomarlizeLocale(locale);
    this.locale.value = nomarlizedLocale;
  }

  addTranslations(locale: Locale, messages: Translations) {
    locale = nomarlizeLocale(locale);
    const original = this.messageStore.value[locale];

    this.messageStore.value[locale] = Object.assign(original, messages);
  }

  getFormatter(): IntlFormatter {
    return this.intlShape;
  }
}

const navigatorLanguageMapping: Record<string, string> = {
  en: 'en-US',
  zh: 'zh-CN',
  zt: 'zh-TW',
  es: 'es-ES',
  pt: 'pt-PT',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  ru: 'ru-RU',
  ja: 'ja-JP',
  ko: 'ko-KR',
  ar: 'ar-SA',
  tr: 'tr-TR',
  th: 'th-TH',
  vi: 'vi-VN',
  nl: 'nl-NL',
  he: 'iw-IL',
  id: 'in-ID',
  pl: 'pl-PL',
  hi: 'hi-IN',
  uk: 'uk-UA',
  ms: 'ms-MY',
  tl: 'tl-PH',
};

/**
 * nomarlize navigator.language or user input's locale
 * eg: zh -> zh-CN, zh_CN -> zh-CN, zh-cn -> zh-CN
 * @param target
 */
function nomarlizeLocale(target: Locale) {
  if (navigatorLanguageMapping[target]) {
    return navigatorLanguageMapping[target];
  }

  // const replaced = target.replace('_', '-');
  // const splited = replaced.split('-').slice(0, 2);
  // splited[1] = splited[1].toUpperCase();

  // return splited.join('-');
  return target;
}
