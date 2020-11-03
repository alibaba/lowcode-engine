import { Message } from '@alifd/next';
import moment from 'moment';

export default {
  Message,
  moment,
  test(msg) {
    this.Message.notice(msg);
  },
};
