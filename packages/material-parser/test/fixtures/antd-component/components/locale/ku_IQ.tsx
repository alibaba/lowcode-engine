import Pagination from 'rc-pagination/lib/locale/ku_IQ';
import DatePicker from '../date-picker/locale/ku_IQ';
import TimePicker from '../time-picker/locale/ku_IQ';
import Calendar from '../calendar/locale/ku_IQ';
import { Locale } from '../locale-provider';

const localeValues: Locale = {
  locale: 'ku-iq',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  Table: {
    filterTitle: 'Menuê peldanka',
    filterConfirm: 'Temam',
    filterReset: 'Jê bibe',
    selectAll: 'Hemî hilbijêre',
    selectInvert: 'Hilbijartinan veguhere',
  },
  Modal: {
    okText: 'Temam',
    cancelText: 'Betal ke',
    justOkText: 'Temam',
  },
  Popconfirm: {
    okText: 'Temam',
    cancelText: 'Betal ke',
  },
  Transfer: {
    searchPlaceholder: 'Lêgerîn',
    itemUnit: 'tişt',
    itemsUnit: 'tişt',
  },
  Upload: {
    uploading: 'Bardike...',
    removeFile: 'Pelê rabike',
    uploadError: 'Xeta barkirine',
    previewFile: 'Pelê pêşbibîne',
    downloadFile: 'Pelê dakêşin',
  },
  Empty: {
    description: 'Agahî tune',
  },
};

export default localeValues;
