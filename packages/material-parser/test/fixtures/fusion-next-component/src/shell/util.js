/**
 * 判断是否为布尔类型
 * @param  {any} val 例：'str' / undefined / null / true / false / 0
 * @return {bool}     例： false / false / false / true / false / false
 */
export function isBoolean(val) {
    return typeof val === 'boolean';
}

export function getCollapseMap(device) {
    // by default all of them are collapsed
    const origin = {
        Navigation: true,
        LocalNavigation: true,
        Ancillary: true,
        ToolDock: true,
    };

    let map = [];

    switch (device) {
        case 'phone':
            break;
        case 'pad':
        case 'tablet':
            map = ['ToolDock'];
            break;
        case 'desktop':
            map = ['Navigation', 'LocalNavigation', 'Ancillary', 'ToolDock'];
            break;
        default:
            break;
    }

    Object.keys(origin).forEach(key => {
        if (map.indexOf(key) > -1) {
            origin[key] = false;
        }
    });

    return origin;
}
