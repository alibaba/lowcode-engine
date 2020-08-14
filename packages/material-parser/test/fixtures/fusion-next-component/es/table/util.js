var blackList = ['defaultProps', 'propTypes', 'contextTypes', 'childContextTypes', 'displayName'];

export var statics = function statics(Target, Component) {
    Object.keys(Component).forEach(function (property) {
        if (blackList.indexOf(property) === -1) {
            Target[property] = Component[property];
        }
    });
};

export var fetchDataByPath = function fetchDataByPath(object, path) {
    if (!object || !path) {
        return false;
    }
    path = path.toString();
    var field = path.split('.');
    var val = void 0,
        key = void 0;
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
            for (var colIndex = 1; colIndex < field.length; colIndex++) {
                val = val[field[colIndex]];
                if (typeof val === 'undefined') {
                    break;
                }
            }
        }
    }
    return val;
};