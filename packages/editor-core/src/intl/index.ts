import { ReactNode, Component, createElement } from 'react';
import { IntlMessageFormat } from 'intl-messageformat';
import { globalLocale } from './global-locale';
import { isI18nData } from '@alilc/lowcode-utils';
import { observer } from '../utils';
import { IPublicTypeI18nData } from '@alilc/lowcode-types';

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

function injectVars(msg: string, params: any, locale: string): string {
  if (!msg || !params) {
    return msg;
  }
  const formater = new IntlMessageFormat(msg, locale);
  return formater.format(params as any) as string;
}

export function intl(data: IPublicTypeI18nData | string, params?: object): ReactNode {
  if (!isI18nData(data)) {
    return data;
  }
  if (data.intl) {
    return data.intl;
  }
  const locale = globalLocale.getLocale();
  const tries = generateTryLocales(locale);
  let msg: string | undefined;
  for (const lan of tries) {
    msg = data[lan];
    if (msg != null) {
      break;
    }
  }
  if (msg == null) {
    return `##intl@${locale}##`;
  }
  return injectVars(msg, params, locale);
}

export function shallowIntl(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }
  const maps: any = {};
  Object.keys(data).forEach(key => {
    maps[key] = intl(data[key]);
  });
  return maps;
}

export function intlNode(data: any, params?: object): ReactNode {
  if (isI18nData(data)) {
    if (data.intlNode) {
      return data.intlNode;
    }

    return createElement(IntlElement, { data, params });
  }
  return data;
}

@observer
class IntlElement extends Component<{ data: any; params?: object }> {
  render() {
    const { data, params } = this.props;
    return intl(data, params);
  }
}

export function createIntl(
  instance: string | object,
): {
    intlNode(id: string, params?: object): ReactNode;
    intl(id: string, params?: object): string;
    getLocale(): string;
    setLocale(locale: string): void;
  } {
  // TODO: make reactive
  const data = (() => {
    const locale = globalLocale.getLocale();
    if (typeof instance === 'string') {
      if ((window as any)[instance]) {
        return (window as any)[instance][locale] || {};
      }
      const key = `${instance}_${locale.toLocaleLowerCase()}`;
      return (window as any)[key] || {};
    }
    if (instance && typeof instance === 'object') {
      return (instance as any)[locale] || {};
    }
    return {};
  })();

  function intl(key: string, params?: object): string {
    // TODO: tries lost language
    const str = data[key];

    if (str == null) {
      return `##intl@${key}##`;
    }

    return injectVars(str, params, globalLocale.getLocale());
  }

  @observer
  class IntlElement extends Component<{ id: string; params?: object }> {
    render() {
      const { id, params } = this.props;
      return intl(id, params);
    }
  }

  return {
    intlNode(id: string, params?: object) {
      return createElement(IntlElement, { id, params });
    },
    intl,
    getLocale() {
      return globalLocale.getLocale();
    },
    setLocale(locale: string) {
      globalLocale.setLocale(locale);
    },
  };
}

export { globalLocale };
