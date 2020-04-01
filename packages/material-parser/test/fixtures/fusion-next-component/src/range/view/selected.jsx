import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { getPercent } from '../utils';

export default class Selected extends React.Component {
    static propTypes = {
        min: PropTypes.number,
        max: PropTypes.number,
        slider: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.arrayOf(PropTypes.number),
        ]),
        prefix: PropTypes.string,
        reverse: PropTypes.bool,
        rtl: PropTypes.bool,
    };

    static defaultProps = {
        prefix: 'next-',
        slider: 'single',
        min: 0,
        max: 100,
        value: 0,
        reverse: false,
        rtl: false,
    };

    _getStyle() {
        const { min, max, reverse, rtl } = this.props;
        let { value } = this.props;

        if (!Array.isArray(value)) {
            value = [min, value];
        }
        const width = ((value[1] - value[0]) * 100) / (max - min);

        let style;

        if (!rtl && !reverse) {
            // normal select
            style = {
                width: `${width}%`,
                left: `${getPercent(min, max, value[0])}%`,
            };
        } else if (rtl && !reverse) {
            // select in rtl mode
            style = {
                width: `${width}%`,
                left: `${getPercent(min, max, max + min - value[1])}%`,
            };
        } else if (!rtl && reverse) {
            // select in reverse mode
            style = {
                width: `${100 - width}%`,
                left: `${getPercent(min, max, value[0]) + width}%`,
            };
        } else {
            // select in rtl & reverse mode
            style = {
                width: `${100 - width}%`,
                left: `${getPercent(min, max, value[0])}%`,
            };
        }

        return style;
    }

    _getStyleLeft() {
        const { min, max, rtl } = this.props;
        let { value } = this.props;

        if (!Array.isArray(value)) {
            value = [min, value];
        }

        const style = {
            width: `${getPercent(min, max, value[0])}%`,
            left: 0,
        };
        if (rtl) {
            style.width = `${100 - getPercent(min, max, value[1])}%`;
        }
        return style;
    }

    _getStyleRight() {
        const { min, max, rtl } = this.props;
        let { value } = this.props;

        if (!Array.isArray(value)) {
            value = [min, value];
        }
        const width = ((value[1] - value[0]) * 100) / (max - min);

        let style = {
            width: `${100 - getPercent(min, max, value[0]) - width}%`,
            left: `${getPercent(min, max, value[0]) + width}%`,
        };

        if (rtl) {
            style = {
                width: `${getPercent(min, max, value[0])}%`,
                left: `${100 - getPercent(min, max, value[0])}%`,
            };
        }
        return style;
    }

    render() {
        const { prefix, slider, reverse, rtl } = this.props;
        const classes = classNames({
            [`${prefix}range-selected`]: true,
        });
        let SeletedComps = <div className={classes} style={this._getStyle()} />;

        if (slider === 'double' && reverse) {
            SeletedComps = (
                <div>
                    <div className={classes} style={this._getStyleLeft()} />
                    <div className={classes} style={this._getStyleRight()} />
                </div>
            );
        }

        return SeletedComps;
    }
}
