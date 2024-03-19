import { type ReactNode, createElement } from 'react';
import { someValue } from '@alilc/runtime-core';
import { isJsExpression } from '@alilc/runtime-shared';
import { definePlugin } from '../../renderer';
import { PAGE_EVENTS } from '../../events';
import { reactive } from '../../utils/reactive';
import { createIntl } from './intl';

export { createIntl };

declare module '@alilc/renderer-core' {
  interface AppBoosts {
    intl: ReturnType<typeof createIntl>;
  }
}

export const intlPlugin = definePlugin({
  name: 'intl',
  setup({ schema, appScope, boosts }) {
    const i18nMessages = schema.getByKey('i18n') ?? {};
    const defaultLocale = schema.getByPath('config.defaultLocale') ?? 'zh-CN';
    const intl = createIntl(i18nMessages, defaultLocale);

    appScope.setValue(intl);
    boosts.add('intl', intl);

    boosts.hooks.hook(PAGE_EVENTS.COMPONENT_BEFORE_NODE_CREATE, (node) => {
      if (node.type === 'i18n') {
        const { key, params } = node.raw.data;

        let element: ReactNode;

        if (someValue(params, isJsExpression)) {
          function IntlText(props: any) {
            return intl.i18n(key, props.params);
          }
          IntlText.displayName = 'IntlText';

          const Reactived = reactive(IntlText, {
            target: {
              params,
            },
            valueGetter(expr) {
              return node.context.codeRuntime.parseExprOrFn(expr);
            },
          });

          element = createElement(Reactived, { key });
        } else {
          element = intl.i18n(key, params ?? {});
        }

        node.setReactNode(element);
      }
    });
  },
});
