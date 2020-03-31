const blackList = [
    'defaultProps',
    'propTypes',
    'contextTypes',
    'childContextTypes',
    'displayName',
];

export const statics = (Target, Component) => {
    Object.keys(Component).forEach(property => {
        if (blackList.indexOf(property) === -1) {
            Target[property] = Component[property];
        }
    });
};

export const fetchDataByPath = (object, path) => {
    if (!object || !path) {
        return false;
    }
    path = path.toString();
    const field = path.split('.');
    let val, key;
    if (field.length) {
        key = field[0];
        // lists[1].name
        if (key.indexOf('[') >= 0) {
            key = key.match(/(.*)\[(.*)\]/);
            if (key) {
                val = object[key[1]][key[2]];
            }
        } else {
            val = object[field[0]];
        }
        if (val) {
            for (let colIndex = 1; colIndex < field.length; colIndex++) {
                val = val[field[colIndex]];
                if (typeof val === 'undefined') {
                    break;
                }
            }
        }
    }
    return val;
};
