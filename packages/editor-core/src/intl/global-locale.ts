import { IEventBus, createModuleEventBus } from '../event-bus';
import { observable, computed } from '../obx';
import { createLogger } from '@alilc/lowcode-shared';

const logger = createLogger({ level: 'warn', bizName: 'globalLocale' });

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

class GlobalLocale {
  private emitter: IEventBus = createModuleEventBus('GlobalLocale');

  @observable.ref private _locale?: string;

  @computed get locale() {
    if (this._locale != null) {
      return this._locale;
    }

    // TODO: store 1 & store 2 abstract out as custom implements

    // store 1: config from storage
    let result = null;
    if (hasLocalStorage(window)) {
      const store = window.localStorage;
      let config: any;
      try {
        config = JSON.parse(store.getItem(LowcodeConfigKey) || '');
      } catch (e) {
        // ignore;
      }
      if (config?.locale) {
        result = (config.locale || '').replace('_', '-');
        logger.debug(`getting locale from localStorage: ${result}`);
      }
    }
    if (!result) {
      // store 2: config from window
      const localeFromConfig: string = getConfig('locale');
      if (localeFromConfig) {
        result = languageMap[localeFromConfig] || localeFromConfig.replace('_', '-');
        logger.debug(`getting locale from config: ${result}`);
      }
    }

    if (!result) {
      // store 3: config from system
      const { navigator } = window as any;
      if (navigator.language) {
        const lang = (navigator.language as string);
        return languageMap[lang] || lang.replace('_', '-');
      } else if (navigator.browserLanguage) {
        const it = navigator.browserLanguage.split('-');
        let localeFromSystem = it[0];
        if (it[1]) {
          localeFromSystem += `-${it[1].toUpperCase()}`;
        }
        result = localeFromSystem;
        logger.debug(`getting locale from system: ${result}`);
      }
    }
    if (!result) {
      logger.warn('something when wrong when trying to get locale, use zh-CN as default, please check it out!');
      result = 'zh-CN';
    }
    this._locale = result;
    return result;
  }

  constructor() {
    this.emitter.setMaxListeners(0);
  }

  setLocale(locale: string) {
    logger.info(`setting locale to ${locale}`);
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

  onChangeLocale(fn: (locale: string) => void): () => void {
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

const globalLocale = new GlobalLocale();

export { globalLocale };
