import moment from 'moment';

// 检查传入值是否为 moment 对象
export function checkMomentObj(props, propName, componentName) {
    if (props[propName] && !moment.isMoment(props[propName])) {
        return new Error(
            `Invalid prop ${propName} supplied to ${componentName}. Required a moment object`
        );
    }
}

// 检查传入值是否为 moment 对象或时间字符串，字符串不检测是否为日期字符串
export function checkDateValue(props, propName, componentName) {
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

export function formatDateValue(value, format) {
    const val = typeof value === 'string' ? moment(value, format, true) : value;
    if (val && moment.isMoment(val) && val.isValid()) {
        return val;
    }
    return null;
}
