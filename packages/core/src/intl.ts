import {
  signal,
  computed,
  effect,
  createLogger,
  type Signal,
  type I18nMap,
  type ComputedSignal,
  type PlainObject,
} from '@alilc/lowcode-shared';
import { createIntl, createIntlCache, type IntlShape as IntlFormatter } from '@formatjs/intl';
import { mapKeys } from 'lodash-es';

export { IntlFormatter };

const logger = createLogger({ level: 'warn', bizName: 'globalLocale' });

/**
 * todo: key 需要被统一
 */
const STORED_LOCALE_KEY = 'ali-lowcode-config';

export type Locale = string;
export type IntlMessage = I18nMap[Locale];
export type IntlMessageRecord = I18nMap;

export class Intl {
  #locale: Signal<Locale>;
  #messageStore: Signal<IntlMessageRecord>;
  #currentMessage: ComputedSignal<IntlMessage>;
  #intlShape: IntlFormatter;

  constructor(defaultLocale?: string, messages: IntlMessageRecord = {}) {
    if (defaultLocale) {
      defaultLocale = nomarlizeLocale(defaultLocale);
    } else {
      defaultLocale = initializeLocale();
    }

    const messageStore = mapKeys(messages, (_, key) => {
      return nomarlizeLocale(key);
    });

    this.#locale = signal(defaultLocale);
    this.#messageStore = signal(messageStore);
    this.#currentMessage = computed(() => {
      return this.#messageStore.value[this.#locale.value] ?? {};
    });

    effect(() => {
      const cache = createIntlCache();
      this.#intlShape = createIntl(
        {
          locale: this.#locale.value,
          messages: this.#currentMessage.value,
        },
        cache,
      );
    });
  }

  getLocale() {
    return this.#locale.value;
  }

  setLocale(locale: Locale) {
    const nomarlizedLocale = nomarlizeLocale(locale);

    try {
      // store storage
      let config = JSON.parse(localStorage.getItem(STORED_LOCALE_KEY) || '');

      if (config && typeof config === 'object') {
        config.locale = locale;
      } else {
        config = { locale };
      }

      localStorage.setItem(STORED_LOCALE_KEY, JSON.stringify(config));
    } catch {
      // ignore;
    }

    this.#locale.value = nomarlizedLocale;
  }

  addMessages(locale: Locale, messages: IntlMessage) {
    locale = nomarlizeLocale(locale);
    const original = this.#messageStore.value[locale];

    this.#messageStore.value[locale] = Object.assign(original, messages);
  }

  getFormatter(): IntlFormatter {
    return this.#intlShape;
  }
}

function initializeLocale() {
  let result: Locale | undefined;

  let config: PlainObject = {};
  try {
    // store 1: config from storage
    config = JSON.parse(localStorage.getItem(STORED_LOCALE_KEY) || '');
  } catch {
    // ignore;
  }
  if (config?.locale) {
    result = (config.locale || '').replace('_', '-');
    logger.debug(`getting locale from localStorage: ${result}`);
  }

  if (!result && navigator.language) {
    // store 2: config from system
    result = nomarlizeLocale(navigator.language);
  }

  if (!result) {
    logger.warn(
      'something when wrong when trying to get locale, use zh-CN as default, please check it out!',
    );
    result = 'zh-CN';
  }

  return result;
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

  const replaced = target.replace('_', '-');
  const splited = replaced.split('-').slice(0, 2);
  splited[1] = splited[1].toUpperCase();

  return splited.join('-');
}
