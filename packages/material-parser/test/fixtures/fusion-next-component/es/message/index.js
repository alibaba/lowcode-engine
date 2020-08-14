import ConfigProvider from '../config-provider';
import Message from './message';
import toast from './toast';

Message.show = toast.show;
Message.success = toast.success;
Message.warning = toast.warning;
Message.error = toast.error;
Message.notice = toast.notice;
Message.help = toast.help;
Message.loading = toast.loading;
Message.hide = toast.hide;

export default ConfigProvider.config(Message, {
    componentName: 'Message'
});