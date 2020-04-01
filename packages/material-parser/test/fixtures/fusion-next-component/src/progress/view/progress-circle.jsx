import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const VIEWBOX_WIDTH = 100; // width of viewBox
const HALF_VIEWBOX_WIDTH = VIEWBOX_WIDTH / 2;
const DEFAULT_STROKE_WIDTH = 8;

const viewBox = `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_WIDTH}`;

export default class Circle extends Component {
    static propTypes = {
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        percent: PropTypes.number,
        state: PropTypes.oneOf(['normal', 'success', 'error']),
        progressive: PropTypes.bool,
        textRender: PropTypes.func,
        prefix: PropTypes.string,
        className: PropTypes.string,
        color: PropTypes.string,
        backgroundColor: PropTypes.string,
        rtl: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            underlayStrokeWidth: DEFAULT_STROKE_WIDTH,
            overlayStrokeWidth: DEFAULT_STROKE_WIDTH,
        };
    }

    componentDidMount() {
        if (this.underlay && this.overlay) {
            // eslint-disable-next-line
            this.setState({
                underlayStrokeWidth:
                    this._getCssValue(this.underlay, 'stroke-width') ||
                    DEFAULT_STROKE_WIDTH,
                overlayStrokeWidth:
                    this._getCssValue(this.overlay, 'stroke-width') ||
                    DEFAULT_STROKE_WIDTH,
            });
        }
    }

    _getCssValue(dom, name) {
        const css = window.getComputedStyle(dom).getPropertyValue(name);
        const regExp = /(\d*)px/g;
        const result = regExp.exec(css);

        return Array.isArray(result) ? Number(result[1]) : 0;
    }

    _underlayRefHandler = ref => {
        this.underlay = ref;
    };

    _overlayRefHandler = ref => {
        this.overlay = ref;
    };

    _computeOverlayStrokeDashOffset() {
        const { underlayStrokeWidth, overlayStrokeWidth } = this.state;
        const overlayRadius =
            HALF_VIEWBOX_WIDTH -
            overlayStrokeWidth / 2 -
            (underlayStrokeWidth - overlayStrokeWidth) / 2;
        const overlayLen = Math.PI * 2 * overlayRadius;
        return (
            ((VIEWBOX_WIDTH - this.props.percent) / VIEWBOX_WIDTH) * overlayLen
        );
    }

    _getPath(radius) {
        return `M ${HALF_VIEWBOX_WIDTH},${HALF_VIEWBOX_WIDTH} m 0,-${radius} a ${radius},${radius} 0 1 1 0,${2 *
            radius} a ${radius},${radius} 0 1 1 0,-${2 * radius}`;
    }

    render() {
        const {
            prefix,
            size,
            state,
            percent,
            className,
            textRender,
            progressive,
            color,
            backgroundColor,
            rtl,
            ...others
        } = this.props;
        const { underlayStrokeWidth, overlayStrokeWidth } = this.state;

        // underlay path
        const underlayRadius = HALF_VIEWBOX_WIDTH - underlayStrokeWidth / 2;
        const underlayPath = this._getPath(underlayRadius);

        // overlay path (为居中，减去相对于underlay的宽度)
        const overlayRadius =
            HALF_VIEWBOX_WIDTH -
            overlayStrokeWidth / 2 -
            (underlayStrokeWidth - overlayStrokeWidth) / 2;
        const overlayPath = this._getPath(overlayRadius);
        const overlayLen = Math.PI * 2 * overlayRadius;
        const overlayStrokeDasharray = `${overlayLen}px ${overlayLen}px`;
        const overlayStrokeDashoffset = `${this._computeOverlayStrokeDashOffset()}px`;

        const suffixText = textRender(percent, { rtl });

        const wrapCls = classNames({
            [`${prefix}progress-circle`]: true,
            [`${prefix}progress-circle-show-info`]: suffixText,
            [`${prefix + size}`]: size,
            [className]: className,
        });

        const pathCls = classNames({
            [`${prefix}progress-circle-overlay`]: true,
            [`${prefix}progress-circle-overlay-${state}`]:
                !color && !progressive && state,
            [`${prefix}progress-circle-overlay-started`]:
                !color && progressive && percent <= 30,
            [`${prefix}progress-circle-overlay-middle`]:
                !color && progressive && percent > 30 && percent < 80,
            [`${prefix}progress-circle-overlay-finishing`]:
                !color && progressive && percent >= 80,
        });

        const underlayStyle = { stroke: backgroundColor };

        return (
            <div
                className={wrapCls}
                dir={rtl ? 'rtl' : undefined}
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin="0"
                aria-valuemax="100"
                {...others}
            >
                <svg
                    className={`${prefix}progress-circle-container`}
                    viewBox={viewBox}
                >
                    <path
                        className={`${prefix}progress-circle-underlay`}
                        d={underlayPath}
                        fillOpacity="0"
                        ref={this._underlayRefHandler}
                        style={underlayStyle}
                    />
                    <path
                        className={pathCls}
                        d={overlayPath}
                        fillOpacity="0"
                        strokeDasharray={overlayStrokeDasharray}
                        strokeDashoffset={overlayStrokeDashoffset}
                        ref={this._overlayRefHandler}
                        stroke={color}
                    />
                </svg>
                {suffixText ? (
                    <div className={`${prefix}progress-circle-text`}>
                        {suffixText}
                    </div>
                ) : null}
            </div>
        );
    }
}
