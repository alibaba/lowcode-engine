export function getScroll(node, isVertical) {
    if (typeof window === 'undefined') {
        return 0;
    }
    var windowProp = isVertical ? 'pageYOffset' : 'pageXOffset';
    var elementProp = isVertical ? 'scrollTop' : 'scrollLeft';
    return node === window ? node[windowProp] : node[elementProp];
}

export function getRect(node) {
    return node !== window ? node.getBoundingClientRect() : { top: 0, left: 0, bottom: 0 };
}

export function getNodeHeight(node) {
    if (!node) {
        return 0;
    }
    if (node === window) {
        return window.innerHeight;
    }
    return node.clientHeight;
}