import React from 'react';

export function getDisabledCompatibleTrigger(element) {
    if (
        element.type.displayName === 'Config(Button)' &&
        element.props.disabled
    ) {
        const displayStyle =
            element.props.style && element.props.style.display
                ? element.props.style.display
                : 'inline-block';
        const child = React.cloneElement(element, {
            style: {
                ...element.props.style,
                pointerEvents: 'none',
            },
        });
        return (
            // eslint-disable-next-line
            <span style={{ display: displayStyle, cursor: 'not-allowed' }}>
                {child}
            </span>
        );
    }
    return element;
}
