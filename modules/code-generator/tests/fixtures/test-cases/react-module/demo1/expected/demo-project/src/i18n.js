import IntlMessageFormat from "intl-messageformat";

const i18nConfig = {};

let locale = "en-US";

const getLocale = () => locale;

const setLocale = (target) => {
  locale = target;
};

const i18nFormat = ({ id, defaultMessage }, variables) => {
  const msg =
    (i18nConfig && i18nConfig[locale] && i18nConfig[locale][id]) ||
    defaultMessage;
  if (msg == null) {
    console.warn("[i18n]: unknown message id: %o (locale=%o)", id, locale);
    return `${id}`;
  }

  if (!variables || !variables.length) {
    return msg;
  }

  return new IntlMessageFormat(msg, locale).format(variables);
};

const i18n = (id) => {
  return i18nFormat({ id });
};

export { getLocale, setLocale, i18n, i18nFormat };
