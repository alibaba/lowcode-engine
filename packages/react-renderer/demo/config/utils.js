import { Message, Dialog } from '@alifd/next';
import moment from 'moment';

export default {
  Message,
  Dialog,
  moment,
  test: function(msg) {
    this.Message.notice(msg);
  }
};
