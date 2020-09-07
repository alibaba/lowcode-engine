export var getWidth = function getWidth(elem) {
    var width = elem && typeof elem.getBoundingClientRect === 'function' && elem.getBoundingClientRect().width;
    if (width) {
        width = +width.toFixed(6);
    }
    return width || 0;
};