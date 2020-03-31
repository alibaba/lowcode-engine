import React from 'react';
import PropTypes from 'prop-types';
import { events, func } from '../../util';
import Balloon from '../../balloon';
import { getPercent } from '../utils';

const Tooltip = Balloon.Tooltip;
const { noop } = func;

function _getStyle(min, max, value, rtl) {
    if (rtl) {
        return {
            left: `${getPercent(min, max, max + min - value[1])}%`,
            right: `${getPercent(min, max, value[0])}%`,
        };
    }
    return {
        left: `${getPercent(min, max, value[0])}%`,
        right: `${100 - getPercent(min, max, value[1])}%`,
    };
}

function sliderFrag(props) {
    const {
        prefix,
        min,
        max,
        value,
        disabled,
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        rtl,
    } = props;

    const activeClass =
        !disabled && props.hasMovingClass ? `${prefix}range-active` : '';

    return (
        <div
            className={`${prefix}range-frag ${activeClass}`}
            style={_getStyle(min, max, value, rtl)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
        >
            <div className={`${prefix}range-selected`} />

            <div className={`${prefix}range-slider`}>
                <div className={`${prefix}range-slider-inner`} />
            </div>
            <div className={`${prefix}range-slider`}>
                <div className={`${prefix}range-slider-inner`} />
            </div>
        </div>
    );
}

sliderFrag.propTypes = {
    prefix: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    hasMovingClass: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseDown: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.number),
    disabled: PropTypes.bool,
    rtl: PropTypes.bool,
};

export default class FixedSlider extends React.Component {
    static propTypes = {
        hasTip: PropTypes.bool,
        tooltipVisible: PropTypes.bool,
        onTooltipVisibleChange: PropTypes.func,
        tooltipAnimation: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.object,
        ]),
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.arrayOf(PropTypes.number),
        ]),
        tipRender: PropTypes.func,
        disabled: PropTypes.bool,
        hasMovingClass: PropTypes.bool,
        rtl: PropTypes.bool,
    };

    static defaultProps = {
        disabled: false,
        hasTip: true,
        onChange: noop,
        onProcess: noop,
        tipRender: value => value,
        reverse: false,
        rtl: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            hasMovingClass: false,
            onTooltipVisibleChange: false,
            tooltipAnimation: true,
        };
    }

    _onMouseEnter() {
        if (!(this.keyState === 'down')) {
            this.keyState = 'enter';
        }
        this.setState({
            hasMovingClass: true,
        });
    }

    _onMouseLeave() {
        if (this.keyState === 'enter') {
            this.setState({
                hasMovingClass: false,
            });
        }
    }

    _onMouseDown() {
        this.keyState = 'down';
        this.setState({
            hasMovingClass: true,
        });
        this._addDocumentEvents();
    }

    _onMouseUp() {
        if (this.keyState === 'down') {
            this.keyState = '';
            this._removeDocumentEvents();
            this.setState({
                hasMovingClass: false,
            });
        }
    }

    _addDocumentEvents() {
        this._onMouseUpListener = events.on(
            document,
            'mouseup',
            this._onMouseUp.bind(this)
        );
    }

    _removeDocumentEvents() {
        if (this._onMouseUpListener) {
            this._onMouseUpListener.off();
            this._onMouseUpListener = null;
        }
    }

    render() {
        const {
            hasTip,
            value,
            tipRender,
            tooltipVisible,
            hasMovingClass,
        } = this.props;

        const addedProps = {
            hasMovingClass: hasMovingClass || this.state.hasMovingClass,
            onMouseEnter: this._onMouseEnter.bind(this),
            onMouseLeave: this._onMouseLeave.bind(this),
            onMouseDown: this._onMouseDown.bind(this),
        };

        return hasTip ? (
            <Tooltip
                popupContainer={target => target.parentNode}
                popupProps={{
                    visible: tooltipVisible || hasMovingClass,
                    animation: this.state.tooltipAnimation
                        ? { in: 'expandInUp', out: 'expandOutDown' }
                        : false,
                }}
                trigger={sliderFrag({ ...this.props, ...addedProps })}
                align="t"
            >
                {tipRender(`${value[0]}-${value[1]}`)}
            </Tooltip>
        ) : (
            sliderFrag({ ...this.props, ...addedProps })
        );
    }
}
