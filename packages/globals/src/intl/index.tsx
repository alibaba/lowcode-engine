import { globalLocale } from './ali-global-locale';
import { PureComponent, ReactNode } from 'react';
import { isI18nData } from '../types';

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
function generateTryLocales(locale: string) {
  const tries = [locale, locale.replace('-', '_')];
  if (locale === 'zh-TW' || locale === 'en-US') {
    tries.push('zh-CN');
    tries.push('zh_CN');
  } else {
    tries.push('en-US');
    tries.push('en_US');
    if (locale !== 'zh-CN') {
      tries.push('zh-CN');
      tries.push('zh_CN');
    }
  }
  return tries;
}

export function localeFormat(data: any, params?: object): string {
  if (!isI18nData(data)) {
    return data;
  }
  const locale = globalLocale.getLocale();
  const tries = generateTryLocales(locale);
  let tpl: string | undefined;
  for (const lan of tries) {
    tpl = data[lan];
    if (tpl != null) {
      break;
    }
  }
  if (tpl == null) {
    return `##intl@${locale}##`;
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
    if (data.intl) {
      return data.intl;
    }
    return <Intl data={data} params={params} />;
  }
  return data;
}

export function shallowIntl(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }
  const maps: any = {};
  Object.keys(data).forEach(key => {
    maps[key] = localeFormat(data[key]);
  });
  return maps;
}

export function createIntl(
  instance: string | object,
): {
  intl(id: string, params?: object): ReactNode;
  intlString(id: string, params?: object): string;
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

  function intlString(key: string, params?: object): string {
    // TODO: tries lost language
    const str = data[key];

    if (str == null) {
      return `##intl@${key}##`;
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
      return intlString(id, params);
    }
  }

  return {
    intl(id: string, params?: object) {
      return <Intl id={id} params={params} />;
    },
    intlString,
    getLocale() {
      return globalLocale.getLocale();
    },
    setLocale(locale: string) {
      globalLocale.setLocale(locale);
    },
  };
}

export { globalLocale };
