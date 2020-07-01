import Pagination from 'rc-pagination/lib/locale/nb_NO';
import DatePicker from '../date-picker/locale/nb_NO';
import TimePicker from '../time-picker/locale/nb_NO';
import Calendar from '../calendar/locale/nb_NO';
import { Locale } from '../locale-provider';

const localeValues: Locale = {
  locale: 'nb',
  DatePicker,
  TimePicker,
  Calendar,
  Pagination,
  Table: {
    filterTitle: 'Filtermeny',
    filterConfirm: 'OK',
    filterReset: 'Nullstill',
    selectAll: 'Velg alle',
    selectInvert: 'Inverter valg',
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Avbryt',
    justOkText: 'OK',
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Avbryt',
  },
  Transfer: {
    searchPlaceholder: 'Søk her',
    itemUnit: 'element',
    itemsUnit: 'elementer',
  },
  Upload: {
    uploading: 'Laster opp...',
    removeFile: 'Fjern fil',
    uploadError: 'Feil ved opplastning',
    previewFile: 'Forhåndsvisning',
    downloadFile: 'Last ned fil',
  },
  Empty: {
    description: 'Ingen data',
  },
};

export default localeValues;
