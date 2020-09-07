import { Message } from '@alifd/next';
import moment from 'moment';

export default {
  Message,
  moment,
  test: function(msg) {
    this.Message.notice(msg);
  }
};
