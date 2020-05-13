/**
 * Created by Andrey Gayvoronsky on 13/04/16.
 */

import CalendarLocale from 'rc-picker/lib/locale/ru_RU';
import TimePickerLocale from '../../time-picker/locale/ru_RU';
import { PickerLocale } from '../generatePicker';

// Merge into a locale object
const locale: PickerLocale = {
  lang: {
    placeholder: 'Выберите дату',
    rangePlaceholder: ['Начальная дата', 'Конечная дата'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
};

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale;
