import {
  createDecorator,
  Provide,
  Intl,
  type IntlApi,
  type Locale,
  type Translations,
  Platform,
} from '@alilc/lowcode-shared';
import { ILifeCycleService, LifecyclePhase } from './lifeCycleService';
import { ICodeRuntimeService } from './code-runtime';
import { ISchemaService } from './schema';

export interface MessageDescriptor {
  key: string;
  params?: Record<string, string>;
  fallback?: string;
}

export interface IRuntimeIntlService {
  locale: string;

  localize(descriptor: MessageDescriptor): string;

  setLocale(locale: Locale): void;

  getLocale(): Locale;

  addTranslations(locale: Locale, translations: Translations): void;
}

export const IRuntimeIntlService = createDecorator<IRuntimeIntlService>('IRuntimeIntlService');

@Provide(IRuntimeIntlService)
export class RuntimeIntlService implements IRuntimeIntlService {
  private intl: Intl = new Intl();

  public locale: string = Platform.platformLocale;

  constructor(
    @ILifeCycleService private lifeCycleService: ILifeCycleService,
    @ICodeRuntimeService private codeRuntimeService: ICodeRuntimeService,
    @ISchemaService private schemaService: ISchemaService,
  ) {
    this.lifeCycleService.when(LifecyclePhase.OptionsResolved, () => {
      const config = this.schemaService.get('config');
      const i18nTranslations = this.schemaService.get('i18n');

      if (config?.defaultLocale) {
        this.setLocale(config.defaultLocale);
      }
      if (i18nTranslations) {
        Object.keys(i18nTranslations).forEach((key) => {
          this.addTranslations(key, i18nTranslations[key]);
        });
      }

      this.injectScope();
    });
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

  private injectScope(): void {
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
