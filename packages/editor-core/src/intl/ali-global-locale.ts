import { EventEmitter } from 'events';
import { obx, computed } from '../utils/obx';

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
  private emitter = new EventEmitter();

  @obx.ref private _locale?: string;

  @computed get locale() {
    if (this._locale != null) {
      return this._locale;
    }

    // TODO: store 1 & store 2 abstract out as custom implements

    // store 1: config from window
    let locale: string = getConfig('locale');
    if (locale) {
      return languageMap[locale] || locale.replace('_', '-');
    }

    // store 2: config from storage
    if (hasLocalStorage(window)) {
      const store = window.localStorage;
      let config: any;
      try {
        config = JSON.parse(store.getItem(LowcodeConfigKey) || '');
      } catch (e) {
        // ignore;
      }
      if (config?.locale) {
        return (config.locale || '').replace('_', '-');
      }
    }

    // store 2: config from system
    const { navigator } = window as any;
    if (navigator.language) {
      const lang = (navigator.language as string);
      return languageMap[lang] || lang.replace('_', '-');
    } else if (navigator.browserLanguage) {
      const it = navigator.browserLanguage.split('-');
      locale = it[0];
      if (it[1]) {
        locale += `-${ it[1].toUpperCase()}`;
      }
    }

    if (!locale) {
      locale = 'zh-CN';
    }

    return locale;
  }

  constructor() {
    this.emitter.setMaxListeners(0);
  }

  setLocale(locale: string) {
    if (locale === this.locale) {
      return;
    }
    this._locale = locale;
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
    return this.locale;
  }

  onLocaleChange(fn: (locale: string) => void): () => void {
    this.emitter.on('localechange', fn);
    return () => {
      this.emitter.removeListener('localechange', fn);
    };
  }
}

function getConfig(name: string) {
  const win: any = window;
  return (
    win[name]
    || (win.g_config || {})[name]
    || (win.pageConfig || {})[name]
  );
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
