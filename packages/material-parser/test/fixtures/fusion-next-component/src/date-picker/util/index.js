import moment from 'moment';
import { KEYCODE } from '../../util';

export const PANEL = {
    TIME: 'time-panel',
    DATE: 'date-panel',
};

export const DEFAULT_TIME_FORMAT = 'HH:mm:ss';

export function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

/**
 * 将 source 的 time 替换为 target 的 time
 * @param {Object} source 输入值
 * @param {Object} target 目标值
 */
export function resetValueTime(source, target) {
    if (!moment.isMoment(source) || !moment.isMoment(target)) {
        return source;
    }
    return source
        .clone()
        .hour(target.hour())
        .minute(target.minute())
        .second(target.second());
}

export function formatDateValue(value, format) {
    const val =
        typeof value === 'string' ? moment(value, format, false) : value;
    if (val && moment.isMoment(val) && val.isValid()) {
        return val;
    }

    return null;
}

export function checkDateValue(props, propName, componentName) {
    // 支持传入 moment 对象或字符串，字符串不检测是否为日期字符串
    if (
        props[propName] &&
        !moment.isMoment(props[propName]) &&
        typeof props[propName] !== 'string'
    ) {
        return new Error(
            `Invalid prop ${propName} supplied to ${componentName}. Required a moment object or format date string!`
        );
    }
}

export function getDateTimeFormat(format, showTime, type) {
    if (!format && type) {
        format = {
            date: 'YYYY-MM-DD',
            month: 'YYYY-MM',
            year: 'YYYY',
            time: '',
        }[type];
    }
    const timeFormat = showTime ? showTime.format || DEFAULT_TIME_FORMAT : '';
    const dateTimeFormat = timeFormat ? `${format} ${timeFormat}` : format;
    return {
        format,
        timeFormat,
        dateTimeFormat,
    };
}

export function extend(source, target) {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
    return target;
}

/**
 * 监听键盘事件，操作日期字符串
 * @param {KeyboardEvent} e 事件对象
 * @param {Object} param1
 * @param {String} type 类型 year month day
 */
export function onDateKeydown(e, { format, dateInputStr, value }, type) {
    if (
        [KEYCODE.UP, KEYCODE.DOWN, KEYCODE.PAGE_UP, KEYCODE.PAGE_DOWN].indexOf(
            e.keyCode
        ) === -1
    ) {
        return;
    }

    if (
        (e.altKey &&
            [KEYCODE.PAGE_UP, KEYCODE.PAGE_DOWN].indexOf(e.keyCode) === -1) ||
        e.controlKey ||
        e.shiftKey
    ) {
        return;
    }

    let date = moment(dateInputStr, format, true);

    if (date.isValid()) {
        const stepUnit = e.altKey ? 'year' : 'month';
        switch (e.keyCode) {
            case KEYCODE.UP:
                date.subtract(1, type);
                break;
            case KEYCODE.DOWN:
                date.add(1, type);
                break;
            case KEYCODE.PAGE_UP:
                date.subtract(1, stepUnit);
                break;
            case KEYCODE.PAGE_DOWN:
                date.add(1, stepUnit);
                break;
        }
    } else if (value) {
        date = value.clone();
    } else {
        date = moment();
    }

    e.preventDefault();
    return date.format(format);
}

/**
 * 监听键盘事件，操作时间
 * @param {KeyboardEvent} e
 * @param {Object} param1
 * @param {String} type second hour minute
 */
export function onTimeKeydown(e, { format, timeInputStr, steps, value }, type) {
    if (
        [KEYCODE.UP, KEYCODE.DOWN, KEYCODE.PAGE_UP, KEYCODE.PAGE_DOWN].indexOf(
            e.keyCode
        ) === -1
    )
        return;
    if (
        (e.altKey &&
            [KEYCODE.PAGE_UP, KEYCODE.PAGE_DOWN].indexOf(e.keyCode) === -1) ||
        e.controlKey ||
        e.shiftKey
    )
        return;

    let time = moment(timeInputStr, format, true);

    if (time.isValid()) {
        const stepUnit = e.altKey ? 'hour' : 'minute';
        switch (e.keyCode) {
            case KEYCODE.UP:
                time.subtract(steps[type], type);
                break;
            case KEYCODE.DOWN:
                time.add(steps[type], type);
                break;
            case KEYCODE.PAGE_UP:
                time.subtract(steps[stepUnit], stepUnit);
                break;
            case KEYCODE.PAGE_DOWN:
                time.add(steps[stepUnit], stepUnit);
                break;
        }
    } else if (value) {
        time = value.clone();
    } else {
        time = moment()
            .hours(0)
            .minutes(0)
            .seconds(0);
    }

    e.preventDefault();
    return time.format(format);
}
