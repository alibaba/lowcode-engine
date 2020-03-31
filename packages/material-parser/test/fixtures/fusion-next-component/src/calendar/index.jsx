import ConfigProvider from '../config-provider';
import { preFormatDateValue } from './utils';
import Calendar from './calendar';
import RangeCalendar from './range-calendar';

/* istanbul ignore next */
const transform = (props, deprecated) => {
    const {
        type,
        onChange,
        base,
        disabledMonth,
        disabledYear,
        ...others
    } = props;
    const newProps = others;

    if ('type' in props) {
        deprecated('type', 'shape', 'Calendar');

        newProps.shape = type;

        if ('shape' in props) {
            newProps.shape = props.shape;
        }
    }

    if ('base' in props) {
        deprecated('base', 'defaultVisibleMonth', 'Calendar');

        let newDefaultVisibleMonth = () => {
            preFormatDateValue(base, 'YYYY-MM-DD');
        };

        if ('defaultVisibleMonth' in props) {
            newDefaultVisibleMonth = props.defaultVisibleMonth;
        }

        newProps.defaultVisibleMonth = newDefaultVisibleMonth;
    }

    if ('onChange' in props && typeof onChange === 'function') {
        deprecated('onChange', 'onSelect', 'Calendar');

        const newOnSelect = date => {
            onChange({ mode: others.mode, value: date });

            if ('onSelect' in props) {
                props.onSelect(date);
            }
        };

        newProps.onSelect = newOnSelect;
    }

    if ('disabledMonth' in props && typeof disabledMonth === 'function') {
        deprecated('disabledMonth', 'disabledDate', 'Calendar');
    }

    if ('disabledYear' in props && typeof disabledYear === 'function') {
        deprecated('disabledYear', 'disabledDate', 'Calendar');
    }

    if ('yearCellRender' in props && typeof yearCellRender === 'function') {
        deprecated(
            'yearCellRender',
            'monthCellRender/dateCellRender',
            'Calendar'
        );
    }

    if ('language' in props) {
        deprecated('language', 'moment.locale', 'Calendar');
    }

    return newProps;
};

Calendar.RangeCalendar = RangeCalendar;
export default ConfigProvider.config(Calendar, {
    transform,
});
