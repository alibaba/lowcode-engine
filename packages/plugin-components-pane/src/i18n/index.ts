const { provideIntl, destroyIntl } = require('@ali/intl-universal');
const strings = require('./strings');

let intl;
const MEDUSA_APP_NAME = 'legao-designer';
const PSEUDO_LANGUAGE_TAG = 'pd-KV';
const CURRENT_LANGUAGE = (window.locale || '').replace(/_/, '-') || 'zh-CN';

function update(language) {
  destroyIntl();
  intl = provideIntl({
    locale: language,
    messagesAIO: strings,
  });
}

function get(id, variable) {
  if (!intl) update();
  let string = '';
  let key = '';
  if (typeof id === 'string') {
    key = id;
    string = intl.formatMessage({ id }, variable);
  }
  if (typeof id === 'object' && id.dm) {
    id.defaultMessage = id.dm;
  }
  key = id.id;
  string = intl.formatMessage(id, variable);
  if (CURRENT_LANGUAGE === PSEUDO_LANGUAGE_TAG) {
    return `##@@@${key}##${MEDUSA_APP_NAME}@@@##${string}`;
  }
  return string;
}

if (PSEUDO_LANGUAGE_TAG === CURRENT_LANGUAGE) {
  update('en-US');
} else {
  update(CURRENT_LANGUAGE);
}

module.exports = {
  get,
  update,
};
