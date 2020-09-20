import moment from 'moment';

import clone from 'lodash/clone';

import Toast from 'universal-toast';

const formatPrice = function formatPrice(price, unit) {
  return Number(price).toFixed(2) + unit;
};

const recordEvent = function recordEvent(eventName, eventDetail) {
  this.utils.Toast.show(`[EVENT]: ${eventName} ${eventDetail}`);
  console.log(`[EVENT]: ${eventName} (detail: %o) (user: %o)`, eventDetail, this.state.user);
};

export default {
  formatPrice,

  recordEvent,

  moment,

  clone,

  Toast,
};
