import {
  createDecorator,
  Intl,
  type IntlApi,
  type Locale,
  type Translations,
  type LocaleTranslationsMap,
} from '@alilc/lowcode-shared';
import { ICodeRuntimeService } from './code-runtime';

export interface MessageDescriptor {
  key: string;
  params?: Record<string, string>;
  fallback?: string;
}

export interface IRuntimeIntlService {
  localize(descriptor: MessageDescriptor): string;

  setLocale(locale: Locale): void;

  getLocale(): Locale;

  addTranslations(locale: Locale, translations: Translations): void;
}

export const IRuntimeIntlService = createDecorator<IRuntimeIntlService>('IRuntimeIntlService');

export class RuntimeIntlService implements IRuntimeIntlService {
  private intl: Intl = new Intl();

  constructor(
    defaultLocale: string | undefined,
    i18nTranslations: LocaleTranslationsMap,
    @ICodeRuntimeService private codeRuntimeService: ICodeRuntimeService,
  ) {
    if (defaultLocale) this.setLocale(defaultLocale);

    for (const key of Object.keys(i18nTranslations)) {
      this.addTranslations(key, i18nTranslations[key]);
    }

    this._injectScope();
  }

  localize(descriptor: MessageDescriptor): string {
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

  private _injectScope(): void {
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

    this.codeRuntimeService.rootRuntime.getScope().setValue(exposed);
  }
}
