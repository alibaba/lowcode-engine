import { createIntl, createIntlCache, type IntlShape as IntlFormatter } from '@formatjs/intl';
import { mapKeys } from 'lodash-es';
import { signal, computed, effect, type Signal, type ComputedSignal } from './signals';
import { platformLocale } from './platform';
import { Disposable, toDisposable } from './disposable';

export { IntlFormatter };

export type Locale = string;
export type Translations = Record<string, string>;
export type LocaleTranslationsRecord = Record<Locale, Translations>;

export class Intl extends Disposable {
  private _locale: Signal<Locale>;
  private _messageStore: Signal<LocaleTranslationsRecord>;
  private _currentMessage: ComputedSignal<Translations>;
  private _intlShape: IntlFormatter;

  constructor(defaultLocale: string = platformLocale, messages: LocaleTranslationsRecord = {}) {
    super();

    this._locale = signal(defaultLocale ? nomarlizeLocale(defaultLocale) : 'zh-CN');
    this._messageStore = signal(
      mapKeys(messages, (_, key) => {
        return nomarlizeLocale(key);
      }),
    );
    this._currentMessage = computed(() => {
      return this._messageStore.value[this._locale.value] ?? {};
    });

    this._addDispose(
      toDisposable(
        effect(() => {
          const cache = createIntlCache();
          this._intlShape = createIntl(
            {
              locale: this._locale.value,
              messages: this._currentMessage.value,
            },
            cache,
          );
        }),
      ),
    );
  }

  getLocale() {
    return this._locale.value;
  }

  setLocale(locale: Locale) {
    this._throwIfDisposed(`this intl has been disposed`);

    const nomarlizedLocale = nomarlizeLocale(locale);
    this._locale.value = nomarlizedLocale;
  }

  addTranslations(locale: Locale, messages: Translations) {
    this._throwIfDisposed(`this intl has been disposed`);

    locale = nomarlizeLocale(locale);
    const original = this._messageStore.value[locale];

    this._messageStore.value[locale] = Object.assign(original, messages);
  }

  getFormatter(): IntlFormatter {
    this._throwIfDisposed(`this intl has been disposed`);

    return this._intlShape;
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
