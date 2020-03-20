import { globalLocale } from './ali-global-locale';
import { PureComponent, ReactNode } from 'react';

function injectVars(template: string, params: any): string {
  if (!template || !params) {
    return template;
  }
  return template.replace(/({\w+})/g, (_, $1) => {
    const key = (/\d+/.exec($1) || [])[0] as any;
    if (key && params[key] != null) {
      return params[key];
    }
    return $1;
  });
}

export interface I18nData {
  type: 'i18n';
  [key: string]: string;
}

export function isI18nData(obj: any): obj is I18nData {
  return obj && obj.type === 'i18n';
}

export function localeFormat(data: any, params?: object): string {
  if (!isI18nData(data)) {
    return data;
  }
  const locale = globalLocale.getLocale();
  const tpl = data[locale];
  if (tpl == null) {
    return `##intl null@${locale}##`;
  }
  return injectVars(tpl, params);
}

class Intl extends PureComponent<{ data: any; params?: object }> {
  private dispose = globalLocale.onLocaleChange(() => this.forceUpdate());
  componentWillUnmount() {
    this.dispose();
  }
  render() {
    const { data, params } = this.props;
    return localeFormat(data, params);
  }
}

export function intl(data: any, params?: object): ReactNode {
  if (isI18nData(data)) {
    return <Intl data={data} params={params} />;
  }
  return data;
}

export function createIntl(
  instance: string | object,
): {
  intl(id: string, params?: object): ReactNode;
  getIntlString(id: string, params?: object): string;
  getLocale(): string;
  setLocale(locale: string): void;
} {
  let lastLocale: string | undefined;
  let data: any = {};
  function useLocale(locale: string) {
    lastLocale = locale;
    if (typeof instance === 'string') {
      if ((window as any)[instance]) {
        data = (window as any)[instance][locale] || {};
      } else {
        const key = `${instance}_${locale.toLocaleLowerCase()}`;
        data = (window as any)[key] || {};
      }
    } else if (instance && typeof instance === 'object') {
      data = (instance as any)[locale] || {};
    }
  }

  useLocale(globalLocale.getLocale());

  function getIntlString(key: string, params?: object): string {
    const str = data[key];

    if (str == null) {
      return `##intl null@${key}##`;
    }

    return injectVars(str, params);
  }

  class Intl extends PureComponent<{ id: string; params?: object }> {
    private dispose = globalLocale.onLocaleChange(locale => {
      if (lastLocale !== locale) {
        useLocale(locale);
        this.forceUpdate();
      }
    });
    componentWillUnmount() {
      this.dispose();
    }
    render() {
      const { id, params } = this.props;
      return getIntlString(id, params);
    }
  }

  return {
    intl(id: string, params?: object) {
      return <Intl id={id} params={params} />;
    },
    getIntlString,
    getLocale() {
      return globalLocale.getLocale();
    },
    setLocale(locale: string) {
      globalLocale.setLocale(locale);
    },
  };
}

export { globalLocale };
