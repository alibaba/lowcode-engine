import React from 'react';

export const triggerEvents = {
    CLICK: 'click',
    HOVER: 'hover',
};

export function getOffsetWH(node, tabPosition) {
    let prop = 'width';
    if (tabPosition === 'left' || tabPosition === 'right') {
        prop = 'height';
    }
    return node ? node.getBoundingClientRect()[prop] : 0;
}

export function getOffsetLT(node, tabPosition) {
    let prop = 'left';
    if (tabPosition === 'left' || tabPosition === 'right') {
        prop = 'top';
    }
    return node.getBoundingClientRect()[prop];
}

export function isTransformSupported(style) {
    return (
        'transform' in style ||
        'webkitTransform' in style ||
        'MozTransform' in style
    );
}

export function toArray(children) {
    const ret = [];
    React.Children.forEach(children, (child, index) => {
        if (React.isValidElement(child)) {
            ret.push(
                React.cloneElement(child, {
                    key: child.key || index,
                    title: child.props.title || child.props.tab,
                })
            );
        }
    });
    return ret;
}
