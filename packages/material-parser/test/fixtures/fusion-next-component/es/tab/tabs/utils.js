import React from 'react';

export var triggerEvents = {
    CLICK: 'click',
    HOVER: 'hover'
};

export function getOffsetWH(node, tabPosition) {
    var prop = 'width';
    if (tabPosition === 'left' || tabPosition === 'right') {
        prop = 'height';
    }
    return node ? node.getBoundingClientRect()[prop] : 0;
}

export function getOffsetLT(node, tabPosition) {
    var prop = 'left';
    if (tabPosition === 'left' || tabPosition === 'right') {
        prop = 'top';
    }
    return node.getBoundingClientRect()[prop];
}

export function isTransformSupported(style) {
    return 'transform' in style || 'webkitTransform' in style || 'MozTransform' in style;
}

export function toArray(children) {
    var ret = [];
    React.Children.forEach(children, function (child, index) {
        if (React.isValidElement(child)) {
            ret.push(React.cloneElement(child, {
                key: child.key || index,
                title: child.props.title || child.props.tab
            }));
        }
    });
    return ret;
}