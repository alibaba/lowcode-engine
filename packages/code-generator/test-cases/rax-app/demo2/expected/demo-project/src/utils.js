import moment from 'moment';

import clone from 'lodash/clone';

const formatPrice = function formatPrice(price, unit) {
  return Number(price).toFixed(2) + unit;
};

export default {
  formatPrice,

  moment,

  clone,
};
