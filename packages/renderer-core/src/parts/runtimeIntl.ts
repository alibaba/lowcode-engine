import {
  createDecorator,
  Provide,
  Intl,
  type Spec,
  type Locale,
  type LocaleTranslationsRecord,
  type Translations,
} from '@alilc/lowcode-shared';

export interface MessageDescriptor {
  key: string;
  params?: Record<string, string>;
  fallback?: string;
}

export interface IRuntimeIntlService {
  initialize(locale: Locale, messages: LocaleTranslationsRecord): void;

  t(descriptor: MessageDescriptor): string;

  setLocale(locale: Locale): void;

  getLocale(): Locale;

  addTranslations(locale: Locale, translations: Translations): void;

  toExpose(): Spec.IntlApi;
}

export const IRuntimeIntlService = createDecorator<IRuntimeIntlService>('IRuntimeIntlService');

@Provide(IRuntimeIntlService)
export class RuntimeIntlService implements IRuntimeIntlService {
  private intl: Intl;

  private _expose: any;

  initialize(locale: Locale, messages: LocaleTranslationsRecord) {
    this.intl = new Intl(locale, messages);
  }

  t(descriptor: MessageDescriptor): string {
    const formatter = this.intl.getFormatter();

    return formatter.$t(
      {
        id: descriptor.key,
        defaultMessage: descriptor.fallback,
      },
      descriptor.params,
    );
  }

  setLocale(locale: string): void {
    this.intl.setLocale(locale);
  }

  getLocale(): string {
    return this.intl.getLocale();
  }

  addTranslations(locale: Locale, translations: Translations) {
    this.intl.addTranslations(locale, translations);
  }

  toExpose(): Spec.IntlApi {
    if (!this._expose) {
      this._expose = Object.freeze<Spec.IntlApi>({
        i18n: (key, params) => {
          return this.t({ key, params });
        },
        getLocale: () => {
          return this.getLocale();
        },
        setLocale: (locale) => {
          this.setLocale(locale);
        },
      });
    }

    return this._expose;
  }
}
