import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { inRange, getPercent } from '../utils';

export default class Mark extends React.Component {
    static propTypes = {
        min: PropTypes.number,
        max: PropTypes.number,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.arrayOf(PropTypes.number),
        ]),
        prefix: PropTypes.string,
        marks: PropTypes.object,
        marksPosition: PropTypes.string,
        rtl: PropTypes.bool,
    };

    static defaultProps = {
        prefix: 'next-',
        min: 0,
        max: 100,
        value: 0,
        marksPosition: '',
        rtl: false,
    };

    _renderItems() {
        const { min, max, value, prefix, marks, rtl } = this.props;
        const items = [];

        Object.keys(marks).forEach((mark, i) => {
            const classes = classNames({
                [`${prefix}range-mark-text`]: true,
                activated: inRange(mark, value, min),
            });
            let style;
            if (rtl) {
                style = {
                    right: `${getPercent(min, max, mark)}%`,
                    left: 'auto',
                };
            } else {
                style = {
                    left: `${getPercent(min, max, mark)}%`,
                    right: 'auto',
                };
            }

            items.push(
                // "key" is for https://fb.me/react-warning-keys
                <span className={classes} style={style} key={i}>
                    {marks[mark]}
                </span>
            );
        });

        return items;
    }

    render() {
        const { prefix, marksPosition } = this.props;
        const className =
            marksPosition === 'above'
                ? `${prefix}range-mark-above`
                : `${prefix}range-mark-below`;
        const classes = classNames(className, {
            [`${prefix}range-mark`]: true,
        });
        const items = this._renderItems();

        return <div className={classes}>{items}</div>;
    }
}
