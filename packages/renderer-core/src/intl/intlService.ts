import {
  createDecorator,
  Intl,
  type IntlApi,
  type Locale,
  type Translations,
  type LocaleTranslationsMap,
  Disposable,
} from '@alilc/lowcode-shared';

export interface MessageDescriptor {
  key: string;
  params?: Record<string, string>;
  fallback?: string;
}

export interface IRuntimeIntlService {
  initialize(locale: string | undefined, i18nTranslations: LocaleTranslationsMap): IntlApi;

  localize(descriptor: MessageDescriptor): string;

  setLocale(locale: Locale): void;

  getLocale(): Locale;

  addTranslations(locale: Locale, translations: Translations): void;
}

export const IRuntimeIntlService = createDecorator<IRuntimeIntlService>('IRuntimeIntlService');

export class RuntimeIntlService extends Disposable implements IRuntimeIntlService {
  private _intl: Intl = this._addDispose(new Intl());

  constructor() {
    super();
  }

  initialize(locale: string | undefined, i18nTranslations: LocaleTranslationsMap): IntlApi {
    if (locale) this._intl.setLocale(locale);
    for (const key of Object.keys(i18nTranslations)) {
      this._intl.addTranslations(key, i18nTranslations[key]);
    }

    const exposed: IntlApi = {
      i18n: (key, params) => {
        return this.localize({ key, params });
      },
      getLocale: () => {
        return this.getLocale();
      },
      setLocale: (locale) => {
        this.setLocale(locale);
      },
    };

    return exposed;
  }

  localize(descriptor: MessageDescriptor): string {
    return this._intl.getFormatter().$t(
      {
        id: descriptor.key,
        defaultMessage: descriptor.fallback,
      },
      descriptor.params,
    );
  }

  setLocale(locale: string): void {
    this._intl.setLocale(locale);
  }

  getLocale(): string {
    return this._intl.getLocale();
  }

  addTranslations(locale: Locale, translations: Translations) {
    this._intl.addTranslations(locale, translations);
  }
}
