import Pagination from 'rc-pagination/lib/locale/pt_BR';
import DatePicker from '../date-picker/locale/pt_BR';
import TimePicker from '../time-picker/locale/pt_BR';
import Calendar from '../calendar/locale/pt_BR';
import { Locale } from '../locale-provider';

const localeValues: Locale = {
  locale: 'pt-br',
  Pagination,
  DatePicker,
  TimePicker,
  Calendar,
  Table: {
    filterTitle: 'Filtro',
    filterConfirm: 'OK',
    filterReset: 'Resetar',
    selectAll: 'Selecionar página atual',
    selectInvert: 'Inverter seleção',
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Cancelar',
    justOkText: 'OK',
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Cancelar',
  },
  Transfer: {
    searchPlaceholder: 'Procurar',
    itemUnit: 'item',
    itemsUnit: 'items',
  },
  Upload: {
    uploading: 'Enviando...',
    removeFile: 'Remover arquivo',
    uploadError: 'Erro no envio',
    previewFile: 'Visualizar arquivo',
    downloadFile: 'Baixar arquivo',
  },
  Empty: {
    description: 'Não há dados',
  },
  Text: {
    edit: 'editar',
    copy: 'copiar',
    copied: 'copiado',
    expand: 'expandir',
  },
};

export default localeValues;
