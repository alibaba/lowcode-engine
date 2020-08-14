import _typeof from 'babel-runtime/helpers/typeof';
import _extends from 'babel-runtime/helpers/extends';
// import { prefix } from 'inline-style-prefixer';
import { filterUndefinedValue, stripObject } from './util';

var getPadding = function getPadding(padding) {
    if (!Array.isArray(padding)) {
        return {
            padding: padding
        };
    }

    var attrs = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];
    var paddings = {};
    var value = void 0;

    attrs.forEach(function (attr, index) {
        switch (padding.length) {
            case 1:
                value = padding[0] || 0;
                break;
            case 2:
                value = padding[index] || padding[index - 2] || 0;
                break;
            case 3:
                value = index === 2 ? padding[2] : padding[index] || padding[index - 2] || 0;
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

var getMargin = function getMargin(size) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { isNegative: false, half: false },
        isNegative = _ref.isNegative,
        half = _ref.half;

    if (!size) {
        return {};
    }
    var attrs = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'];
    var margins = {};
    var param = 1 * (isNegative ? -1 : 1) * (half ? 0.5 : 1);
    var value = void 0;

    attrs.forEach(function (attr, index) {
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
                    value = param * (index === 2 ? size[2] : size[index] || size[index - 2] || 0);
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

var getChildMargin = function getChildMargin(spacing) {
    return getMargin(spacing, { half: true });
};

var getSpacingMargin = function getSpacingMargin(spacing) {
    return getMargin(spacing, { half: true });
};

var getSpacingHelperMargin = function getSpacingHelperMargin(spacing) {
    return getMargin(spacing, { isNegative: true, half: true });
};

var getFlexs = function getFlexs(flex) {
    if (!Array.isArray(flex)) {
        return {
            flex: flex
        };
    }

    var attrs = ['flexGrow', 'flexShrink', 'flexBasis'];
    var flexs = {};

    flex.forEach(function (val, index) {
        flexs[attrs[index]] = val;
    });

    return flexs;
};

var getGridGap = function getGridGap(gap) {
    if (!Array.isArray(gap)) {
        return {
            gap: gap
        };
    }

    var attrs = ['rowGap', 'columnGap'];
    var gaps = {};

    gap.forEach(function (val, index) {
        gaps[attrs[index]] = val;
    });

    return gaps;
};

var getTemplateCount = function getTemplateCount(counts) {
    if (!isNaN(counts)) {
        return 'repeat(' + counts + ', minmax(0,1fr))';
    }

    return counts;
};

// const outerProps = ['alignSelf', 'flexGrow', 'flexShrink', 'flexBasis', 'backgroundColor', 'boxShadow', 'borderRadius', 'borderWidth', 'borderStyle', 'borderColor', 'padding', 'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom'];

var helperProps = ['margin', 'marginTop', 'marginLeft', 'marginRight', 'marginBottom'];

var innerProps = ['flexDirection', 'flexWrap', 'justifyContent', 'alignContent', 'alignItems', 'display'];

var filterOuterStyle = function filterOuterStyle(style) {
    var props = {};

    [].concat(innerProps).forEach(function (key) {
        props[key] = style[key];
    });

    return filterUndefinedValue(stripObject(style, props));
};

var filterHelperStyle = function filterHelperStyle(style) {
    var props = {};
    helperProps.forEach(function (key) {
        props[key] = style[key];
    });

    return filterUndefinedValue(_extends({}, props, {
        overflow: 'hidden'
    }));
};

var filterInnerStyle = function filterInnerStyle(style) {
    var props = {};

    innerProps.forEach(function (key) {
        props[key] = style[key];
    });

    return filterUndefinedValue(props);
};

var getGridChildProps = function getGridChildProps(props, device) {
    var _props$row = props.row,
        row = _props$row === undefined ? 'initial' : _props$row,
        _props$col = props.col,
        col = _props$col === undefined ? 'initial' : _props$col,
        _props$rowSpan = props.rowSpan,
        rowSpan = _props$rowSpan === undefined ? 1 : _props$rowSpan,
        _props$colSpan = props.colSpan,
        colSpan = _props$colSpan === undefined ? 1 : _props$colSpan;


    var newColSpan = (typeof colSpan === 'undefined' ? 'undefined' : _typeof(colSpan)) === 'object' && 'desktop' in colSpan ? colSpan.desktop : colSpan;

    ['tablet', 'phone'].forEach(function (deviceKey) {
        if (deviceKey === device) {
            if ((typeof colSpan === 'undefined' ? 'undefined' : _typeof(colSpan)) === 'object' && device in colSpan) {
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
        gridRowEnd: 'span ' + rowSpan,
        gridColumnStart: col,
        gridColumnEnd: 'span ' + newColSpan
        // gridRow: `${row} / span ${rowSpan}`,
        // gridColumn: `${col} / span ${colSpan}`,
        // justifySelf,
        // alignSelf,
    });
};

var getBoxChildProps = function getBoxChildProps(props) {
    var alignSelf = props.alignSelf,
        flex = props.flex;


    return filterUndefinedValue(_extends({
        alignSelf: alignSelf
    }, getFlexs(flex)));
};

export default (function (_ref2) {
    var device = _ref2.device,
        display = _ref2.display,
        gap = _ref2.gap,
        direction = _ref2.direction,
        dense = _ref2.dense,
        rowSpan = _ref2.rowSpan,
        colSpan = _ref2.colSpan,
        row = _ref2.row,
        col = _ref2.col,
        rows = _ref2.rows,
        columns = _ref2.columns,
        justify = _ref2.justify,
        align = _ref2.align,
        alignSelf = _ref2.alignSelf,
        wrap = _ref2.wrap,
        flex = _ref2.flex,
        padding = _ref2.padding,
        margin = _ref2.margin;

    var style = _extends({}, getPadding(padding));

    var deviceColumns = 'auto';

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
    var newColumns = !isNaN(columns) ? columns : deviceColumns;

    switch (display) {
        case 'grid':
            style = _extends({}, getGridGap(gap), {
                gridTemplateRows: getTemplateCount(rows),
                gridTemplateColumns: getTemplateCount(newColumns),
                gridAutoFlow: '' + direction + (dense && ' dense')
            }, getGridChildProps({
                row: row,
                rowSpan: rowSpan,
                col: col,
                colSpan: colSpan
                // justifySelf,
                // alignSelf,
            }, device), style);
            break;
        case 'flex':
            style = _extends({
                // parent
                flexDirection: direction,
                flexWrap: wrap ? 'wrap' : 'nowrap',
                justifyContent: justify,
                alignItems: align
            }, getMargin(margin), getBoxChildProps({
                alignSelf: alignSelf,
                flex: flex
            }), style);
            break;
        default:
            break;
    }

    // return prefix(style);
    return filterUndefinedValue(style);
});

export { getMargin, getChildMargin, getSpacingMargin, getSpacingHelperMargin, filterInnerStyle, filterOuterStyle, filterHelperStyle, getGridChildProps };