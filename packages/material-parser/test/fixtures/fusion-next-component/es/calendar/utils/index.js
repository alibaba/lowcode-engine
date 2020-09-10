import _extends from 'babel-runtime/helpers/extends';
export { getLocaleData };
import moment from 'moment';

export var DAYS_OF_WEEK = 7;

export var CALENDAR_TABLE_COL_COUNT = 7;

export var CALENDAR_TABLE_ROW_COUNT = 6;

export var MONTH_TABLE_ROW_COUNT = 4;

export var MONTH_TABLE_COL_COUNT = 3;

export var YEAR_TABLE_ROW_COUNT = 4;

export var YEAR_TABLE_COL_COUNT = 3;

export var CALENDAR_MODE_YEAR = 'year';

export var CALENDAR_MODE_MONTH = 'month';

export var CALENDAR_MODE_DATE = 'date';

export var CALENDAR_MODES = [CALENDAR_MODE_DATE, CALENDAR_MODE_MONTH, CALENDAR_MODE_YEAR];

export function isDisabledDate(date, fn, view) {
    if (typeof fn === 'function' && fn(date, view)) {
        return true;
    }
    return false;
}

export function checkMomentObj(props, propName, componentName) {
    if (props[propName] && !moment.isMoment(props[propName])) {
        return new Error('Invalid prop ' + propName + ' supplied to ' + componentName + '. Required a moment object');
    }
}

export function formatDateValue(value) {
    var reservedValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    if (value && moment.isMoment(value)) {
        return value;
    }
    return reservedValue;
}

export function getVisibleMonth(defaultVisibleMonth, value) {
    var getVM = defaultVisibleMonth;
    if (typeof getVM !== 'function' || !moment.isMoment(getVM())) {
        getVM = function getVM() {
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
    var val = typeof value === 'string' ? moment(value, format, false) : value;
    if (val && moment.isMoment(val) && val.isValid()) {
        return val;
    }

    return null;
}

function getLocaleData(_ref, localeData) {
    var _months = _ref.months,
        shortMonths = _ref.shortMonths,
        _firstDayOfWeek = _ref.firstDayOfWeek,
        _weekdays = _ref.weekdays,
        shortWeekdays = _ref.shortWeekdays,
        veryShortWeekdays = _ref.veryShortWeekdays;

    return _extends({}, localeData, {
        monthsShort: function monthsShort() {
            return shortMonths || localeData.monthsShort();
        },
        months: function months() {
            return _months || localeData.months();
        },
        firstDayOfWeek: function firstDayOfWeek() {
            return _firstDayOfWeek || localeData.firstDayOfWeek();
        },
        weekdays: function weekdays() {
            return _weekdays || localeData.weekdays;
        },
        weekdaysShort: function weekdaysShort() {
            return shortWeekdays || localeData.weekdaysShort();
        },
        weekdaysMin: function weekdaysMin() {
            return veryShortWeekdays || localeData.weekdaysMin();
        }
    });
}

/* istanbul ignore next */
export function getYears(yearRange, yearRangeOffset, year) {
    var options = [];
    var startYear = yearRange[0],
        endYear = yearRange[1];

    if (!startYear || !endYear) {
        startYear = year - yearRangeOffset;
        endYear = year + yearRangeOffset;
    }

    for (var i = startYear; i <= endYear; i++) {
        options.push({
            label: i,
            value: i
        });
    }
    return options;
}

/* istanbul ignore next */
export function getMonths(momentLocale) {
    var localeMonths = momentLocale.monthsShort();
    var options = [];
    for (var i = 0; i < 12; i++) {
        options.push({
            value: i,
            label: localeMonths[i]
        });
    }
    return options;
}