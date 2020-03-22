import { EventEmitter } from 'events';
const languageMap: { [key: string]: string } = {
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

const LowcodeConfigKey = 'ali-lowcode-config';

class AliGlobalLocale {
  private locale: string = '';
  private emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(0);
  }

  setLocale(locale: string) {
    if (locale === this.locale) {
      return;
    }
    this.locale = locale;
    if (hasLocalStorage(window)) {
      const store = window.localStorage;
      let config: any;
      try {
        config = JSON.parse(store.getItem(LowcodeConfigKey) || '');
      } catch (e) {
        // ignore;
      }

      if (config && typeof config === 'object') {
        config.locale = locale;
      } else {
        config = { locale };
      }

      store.setItem(LowcodeConfigKey, JSON.stringify(config));
    }
    this.emitter.emit('localechange', locale);
  }

  getLocale() {
    if (this.locale) {
      return this.locale;
    }

    const { g_config, navigator } = window as any;
    if (hasLocalStorage(window)) {
      const store = window.localStorage;
      let config: any;
      try {
        config = JSON.parse(store.getItem(LowcodeConfigKey) || '');
      } catch (e) {
        // ignore;
      }
      if (config?.locale) {
        this.locale = (config.locale || '').replace('_', '-');
        return this.locale;
      }
    } else if (g_config) {
      if (g_config.locale) {
        this.locale = languageMap[g_config.locale] || (g_config.locale || '').replace('_', '-');
        return this.locale;
      }
    }

    if (navigator.language) {
      this.locale = (navigator.language as string).replace('_', '-');
    }

    // IE10 及更低版本使用 browserLanguage
    if (navigator.browserLanguage) {
      const it = navigator.browserLanguage.split('-');
      this.locale = it[0];
      if (it[1]) {
        this.locale += '-' + it[1].toUpperCase();
      }
    }

    if (!this.locale) {
      this.locale = 'zh-CN';
    }

    return this.locale;
  }

  onLocaleChange(fn: (locale: string) => void): () => void {
    this.emitter.on('localechange', fn);
    return () => {
      this.emitter.removeListener('localechange', fn);
    };
  }
}

function hasLocalStorage(obj: any): obj is WindowLocalStorage {
  return obj.localStorage;
}

let globalLocale: AliGlobalLocale;
if ((window as any).__aliGlobalLocale) {
  globalLocale = (window as any).__aliGlobalLocale as any;
} else {
  globalLocale = new AliGlobalLocale();
  (window as any).__aliGlobalLocale = globalLocale;
}

export { globalLocale };
