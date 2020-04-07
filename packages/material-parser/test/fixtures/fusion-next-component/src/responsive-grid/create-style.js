// import { prefix } from 'inline-style-prefixer';
import { filterUndefinedValue, stripObject } from './util';

const getPadding = padding => {
    if (!Array.isArray(padding)) {
        return {
            padding,
        };
    }

    const attrs = [
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
    ];
    const paddings = {};
    let value;

    attrs.forEach((attr, index) => {
        switch (padding.length) {
            case 1:
                value = padding[0] || 0;
                break;
            case 2:
                value = padding[index] || padding[index - 2] || 0;
                break;
            case 3:
                value =
                    index === 2
                        ? padding[2]
                        : padding[index] || padding[index - 2] || 0;
                break;
            case 4:
            default:
                value = padding[index] || 0;
                break;
        }
        paddings[attr] = value;
    });

    return paddings;
};

const getMargin = (
    size,
    { isNegative, half } = { isNegative: false, half: false }
) => {
    if (!size) {
        return {};
    }
    const attrs = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'];
    const margins = {};
    const param = 1 * (isNegative ? -1 : 1) * (half ? 0.5 : 1);
    let value;

    attrs.forEach((attr, index) => {
        if (!Array.isArray(size)) {
            value = param * size;
        } else {
            switch (size.length) {
                case 1:
                    value = param * (size[0] || 0);
                    break;
                case 2:
                    value = param * (size[index] || size[index - 2] || 0);
                    break;
                case 3:
                    value =
                        param *
                        (index === 2
                            ? size[2]
                            : size[index] || size[index - 2] || 0);
                    break;
                case 4:
                default:
                    value = param * (size[index] || 0);
                    break;
            }
        }

        margins[attr] = value;
    });

    return margins;
};

const getChildMargin = spacing => {
    return getMargin(spacing, { half: true });
};

const getSpacingMargin = spacing => {
    return getMargin(spacing, { half: true });
};

const getSpacingHelperMargin = spacing => {
    return getMargin(spacing, { isNegative: true, half: true });
};

const getFlexs = flex => {
    if (!Array.isArray(flex)) {
        return {
            flex,
        };
    }

    const attrs = ['flexGrow', 'flexShrink', 'flexBasis'];
    const flexs = {};

    flex.forEach((val, index) => {
        flexs[attrs[index]] = val;
    });

    return flexs;
};

const getGridGap = gap => {
    if (!Array.isArray(gap)) {
        return {
            gap,
        };
    }

    const attrs = ['rowGap', 'columnGap'];
    const gaps = {};

    gap.forEach((val, index) => {
        gaps[attrs[index]] = val;
    });

    return gaps;
};

const getTemplateCount = counts => {
    if (!isNaN(counts)) {
        return `repeat(${counts}, minmax(0,1fr))`;
    }

    return counts;
};

// const outerProps = ['alignSelf', 'flexGrow', 'flexShrink', 'flexBasis', 'backgroundColor', 'boxShadow', 'borderRadius', 'borderWidth', 'borderStyle', 'borderColor', 'padding', 'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom'];

const helperProps = [
    'margin',
    'marginTop',
    'marginLeft',
    'marginRight',
    'marginBottom',
];

const innerProps = [
    'flexDirection',
    'flexWrap',
    'justifyContent',
    'alignContent',
    'alignItems',
    'display',
];

const filterOuterStyle = style => {
    const props = {};

    [...innerProps].forEach(key => {
        props[key] = style[key];
    });

    return filterUndefinedValue(stripObject(style, props));
};

const filterHelperStyle = style => {
    const props = {};
    helperProps.forEach(key => {
        props[key] = style[key];
    });

    return filterUndefinedValue({
        ...props,
        overflow: 'hidden',
    });
};

const filterInnerStyle = style => {
    const props = {};

    innerProps.forEach(key => {
        props[key] = style[key];
    });

    return filterUndefinedValue(props);
};

const getGridChildProps = (props, device) => {
    const {
        row = 'initial',
        col = 'initial',
        rowSpan = 1,
        colSpan = 1,
        // justifySelf,
        // alignSelf,
    } = props;

    let newColSpan =
        typeof colSpan === 'object' && 'desktop' in colSpan
            ? colSpan.desktop
            : colSpan;

    ['tablet', 'phone'].forEach(deviceKey => {
        if (deviceKey === device) {
            if (typeof colSpan === 'object' && device in colSpan) {
                newColSpan = colSpan[device];
            } else {
                switch (deviceKey) {
                    case 'tablet':
                        newColSpan = colSpan > 5 ? 8 : colSpan > 2 ? 4 : 2;
                        break;
                    case 'phone':
                        newColSpan = colSpan > 2 ? 4 : 2;
                        break;
                }
            }
        }
    });

    return filterUndefinedValue({
        gridRowStart: row,
        gridRowEnd: `span ${rowSpan}`,
        gridColumnStart: col,
        gridColumnEnd: `span ${newColSpan}`,
        // gridRow: `${row} / span ${rowSpan}`,
        // gridColumn: `${col} / span ${colSpan}`,
        // justifySelf,
        // alignSelf,
    });
};

const getBoxChildProps = props => {
    const { alignSelf, flex } = props;

    return filterUndefinedValue({
        alignSelf,
        ...getFlexs(flex),
    });
};

export default ({
    device,
    display,
    gap,
    direction,
    dense,
    rowSpan,
    colSpan,
    row,
    col,
    rows,
    columns,
    justify,
    // justifySelf,
    align,
    alignSelf,
    wrap,
    flex,
    padding,
    margin,
}) => {
    let style = {
        ...getPadding(padding),
    };

    let deviceColumns = 'auto';

    switch (device) {
        case 'phone':
            deviceColumns = 4;
            break;
        case 'tablet':
            deviceColumns = 8;
            break;
        case 'desktop':
            deviceColumns = 12;
            break;
        default:
            break;
    }
    const newColumns = !isNaN(columns) ? columns : deviceColumns;

    switch (display) {
        case 'grid':
            style = {
                // parent
                ...getGridGap(gap),
                gridTemplateRows: getTemplateCount(rows),
                gridTemplateColumns: getTemplateCount(newColumns),
                gridAutoFlow: `${direction}${dense && ` dense`}`,
                // justifyItems: justify,
                // alignItems: align,
                // child
                ...getGridChildProps(
                    {
                        row,
                        rowSpan,
                        col,
                        colSpan,
                        // justifySelf,
                        // alignSelf,
                    },
                    device
                ),
                ...style,
            };
            break;
        case 'flex':
            style = {
                // parent
                flexDirection: direction,
                flexWrap: wrap ? 'wrap' : 'nowrap',
                justifyContent: justify,
                alignItems: align,
                ...getMargin(margin),
                // child
                ...getBoxChildProps({
                    alignSelf,
                    flex,
                }),
                ...style,
            };
            break;
        default:
            break;
    }

    // return prefix(style);
    return filterUndefinedValue(style);
};

export {
    getMargin,
    getChildMargin,
    getSpacingMargin,
    getSpacingHelperMargin,
    filterInnerStyle,
    filterOuterStyle,
    filterHelperStyle,
    getGridChildProps,
    // getBoxChildProps,
};
