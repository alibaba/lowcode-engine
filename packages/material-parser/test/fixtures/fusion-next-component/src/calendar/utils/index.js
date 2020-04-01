import moment from 'moment';

export const DAYS_OF_WEEK = 7;

export const CALENDAR_TABLE_COL_COUNT = 7;

export const CALENDAR_TABLE_ROW_COUNT = 6;

export const MONTH_TABLE_ROW_COUNT = 4;

export const MONTH_TABLE_COL_COUNT = 3;

export const YEAR_TABLE_ROW_COUNT = 4;

export const YEAR_TABLE_COL_COUNT = 3;

export const CALENDAR_MODE_YEAR = 'year';

export const CALENDAR_MODE_MONTH = 'month';

export const CALENDAR_MODE_DATE = 'date';

export const CALENDAR_MODES = [
    CALENDAR_MODE_DATE,
    CALENDAR_MODE_MONTH,
    CALENDAR_MODE_YEAR,
];

export function isDisabledDate(date, fn, view) {
    if (typeof fn === 'function' && fn(date, view)) {
        return true;
    }
    return false;
}

export function checkMomentObj(props, propName, componentName) {
    if (props[propName] && !moment.isMoment(props[propName])) {
        return new Error(
            `Invalid prop ${propName} supplied to ${componentName}. Required a moment object`
        );
    }
}

export function formatDateValue(value, reservedValue = null) {
    if (value && moment.isMoment(value)) {
        return value;
    }
    return reservedValue;
}

export function getVisibleMonth(defaultVisibleMonth, value) {
    let getVM = defaultVisibleMonth;
    if (typeof getVM !== 'function' || !moment.isMoment(getVM())) {
        getVM = () => {
            if (value) {
                return value;
            }
            return moment();
        };
    }
    return getVM();
}

export function isSameYearMonth(dateA, dateB) {
    return dateA.month() === dateB.month() && dateA.year() === dateB.year();
}

export function preFormatDateValue(value, format) {
    const val =
        typeof value === 'string' ? moment(value, format, false) : value;
    if (val && moment.isMoment(val) && val.isValid()) {
        return val;
    }

    return null;
}

export function getLocaleData(
    {
        months,
        shortMonths,
        firstDayOfWeek,
        weekdays,
        shortWeekdays,
        veryShortWeekdays,
    },
    localeData
) {
    return {
        ...localeData,
        monthsShort: () => shortMonths || localeData.monthsShort(),
        months: () => months || localeData.months(),
        firstDayOfWeek: () => firstDayOfWeek || localeData.firstDayOfWeek(),
        weekdays: () => weekdays || localeData.weekdays,
        weekdaysShort: () => shortWeekdays || localeData.weekdaysShort(),
        weekdaysMin: () => veryShortWeekdays || localeData.weekdaysMin(),
    };
}

/* istanbul ignore next */
export function getYears(yearRange, yearRangeOffset, year) {
    const options = [];
    let [startYear, endYear] = yearRange;
    if (!startYear || !endYear) {
        startYear = year - yearRangeOffset;
        endYear = year + yearRangeOffset;
    }

    for (let i = startYear; i <= endYear; i++) {
        options.push({
            label: i,
            value: i,
        });
    }
    return options;
}

/* istanbul ignore next */
export function getMonths(momentLocale) {
    const localeMonths = momentLocale.monthsShort();
    const options = [];
    for (let i = 0; i < 12; i++) {
        options.push({
            value: i,
            label: localeMonths[i],
        });
    }
    return options;
}
