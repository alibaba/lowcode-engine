import moment from 'moment';

import clone from 'lodash/clone';

import Toast from 'universal-toast';

import { createRef } from 'rax';

const formatPrice = function formatPrice(price, unit) {
  return Number(price).toFixed(2) + unit;
};

const recordEvent = function recordEvent(eventName, eventDetail) {
  this.utils.Toast.show(`[EVENT]: ${eventName} ${eventDetail}`);
  console.log(`[EVENT]: ${eventName} (detail: %o) (user: %o)`, eventDetail, this.state.user);
};

export class RefsManager {
  constructor() {
    this.refInsStore = {};
  }

  clearNullRefs() {
    Object.keys(this.refInsStore).forEach((refName) => {
      const filteredInsList = this.refInsStore[refName].filter((insRef) => !!insRef.current);
      if (filteredInsList.length > 0) {
        this.refInsStore[refName] = filteredInsList;
      } else {
        delete this.refInsStore[refName];
      }
    });
  }

  get(refName) {
    this.clearNullRefs();
    if (this.refInsStore[refName] && this.refInsStore[refName].length > 0) {
      return this.refInsStore[refName][0].current;
    }

    return null;
  }

  getAll(refName) {
    this.clearNullRefs();
    if (this.refInsStore[refName] && this.refInsStore[refName].length > 0) {
      return this.refInsStore[refName].map((i) => i.current);
    }

    return [];
  }

  linkRef(refName) {
    const refIns = createRef();
    this.refInsStore[refName] = this.refInsStore[refName] || [];
    this.refInsStore[refName].push(refIns);
    return refIns;
  }
}

export default {
  formatPrice,

  recordEvent,

  moment,

  clone,

  Toast,
};
