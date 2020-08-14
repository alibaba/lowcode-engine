import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import { events, func, obj } from '../../util';
import EventHandlersMixin from './mixins/event-handlers';
import HelpersMixin from './mixins/helpers';
import Arrow from './arrow';
import Track from './track';
import Dots from './dots';

/**
 * Slider inner
 */

var noop = func.noop;
var InnerSlider = (_temp = _class = function (_React$Component) {
    _inherits(InnerSlider, _React$Component);

    function InnerSlider(props) {
        _classCallCheck(this, InnerSlider);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.state = {
            animating: false,
            dragging: false,
            autoPlayTimer: null,
            currentDirection: 0,
            currentLeft: null,
            currentSlide: 'activeIndex' in props ? props.activeIndex : props.defaultActiveIndex,
            direction: 1,
            listWidth: null,
            listHeight: null,
            slideCount: null,
            slideWidth: null,
            slideHeight: null,
            swipeLeft: null,
            touchObject: {
                startX: 0,
                startY: 0,
                curX: 0,
                curY: 0
            },

            lazyLoadedList: [],

            // added for react
            initialized: false,
            edgeDragged: false,
            swiped: false, // used by swipeEvent. differentites between touch and swipe.
            trackStyle: {},
            trackWidth: 0
        };

        // this.filterProps = Object.assign({}, sliderPropTypes, InnerSlider.propTypes);

        func.bindCtx(_this, ['onWindowResized', 'selectHandler', 'changeSlide', 'onInnerSliderEnter', 'onInnerSliderLeave', 'swipeStart', 'swipeMove', 'swipeEnd']);
        return _this;
    }

    InnerSlider.prototype.componentWillMount = function componentWillMount() {
        this.hasMounted = true;

        var _props = this.props,
            lazyLoad = _props.lazyLoad,
            children = _props.children,
            slidesToShow = _props.slidesToShow;
        var currentSlide = this.state.currentSlide;

        var lazyLoadedList = [];

        if (lazyLoad) {
            for (var i = 0, j = React.Children.count(children); i < j; i++) {
                if (i >= currentSlide && i < currentSlide + slidesToShow) {
                    lazyLoadedList.push(i);

                    var pre = i - 1 < 0 ? j - 1 : i - 1;
                    var next = i + 1 >= j ? 0 : i + 1;

                    lazyLoadedList.push(pre);
                    lazyLoadedList.push(next);
                }
            }

            if (this.state.lazyLoadedList.length === 0) {
                this.setState({
                    lazyLoadedList: lazyLoadedList
                });
            }
        }
    };

    InnerSlider.prototype.componentDidMount = function componentDidMount() {
        // TODO Hack for autoplay -- Inspect Later
        this.initialize(this.props);
        this.adaptHeight();

        if (this.props.activeIndex) {
            this.slickGoTo(this.props.activeIndex);
        }

        /* istanbul ignore if  */
        if (window) {
            // To support server-side rendering
            events.on(window, 'resize', this.onWindowResized);
        }
    };

    InnerSlider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (this.props.defaultActiveIndex !== nextProps.defaultActiveIndex) {
            this.setState({
                currentSlide: nextProps.defaultActiveIndex
            });
        }

        if (this.props.activeIndex !== nextProps.activeIndex) {
            this.slickGoTo(nextProps.activeIndex);
        } else if (this.state.currentSlide >= nextProps.children.length) {
            this.update(nextProps);
            this.changeSlide({
                message: 'index',
                index: nextProps.children.length - nextProps.slidesToShow,
                currentSlide: this.state.currentSlide
            });
        } else {
            var others = ['children'];
            var update = !obj.shallowEqual(obj.pickOthers(others, this.props), obj.pickOthers(others, nextProps));
            if (update) {
                this.update(nextProps);
            }
        }
    };

    InnerSlider.prototype.componentDidUpdate = function componentDidUpdate() {
        this.adaptHeight();
    };

    InnerSlider.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.animationEndCallback) {
            clearTimeout(this.animationEndCallback);
        }

        events.off(window, 'resize', this.onWindowResized);

        if (this.state.autoPlayTimer) {
            clearInterval(this.state.autoPlayTimer);
        }
    };

    InnerSlider.prototype.onWindowResized = function onWindowResized() {
        this.update(this.props);
        // animating state should be cleared while resizing, otherwise autoplay stops working
        this.setState({ animating: false });
        clearTimeout(this.animationEndCallback);
        delete this.animationEndCallback;
    };

    InnerSlider.prototype.slickGoTo = function slickGoTo(slide) {
        typeof slide === 'number' && this.changeSlide({
            message: 'index',
            index: slide,
            currentSlide: this.state.currentSlide
        });
    };

    InnerSlider.prototype.onEnterArrow = function onEnterArrow(msg) {
        this.arrowHoverHandler(msg);
    };

    InnerSlider.prototype.onLeaveArrow = function onLeaveArrow() {
        this.arrowHoverHandler();
    };

    InnerSlider.prototype._instanceRefHandler = function _instanceRefHandler(attr, ref) {
        this[attr] = ref;
    };

    InnerSlider.prototype.render = function render() {
        var _props2 = this.props,
            prefix = _props2.prefix,
            animation = _props2.animation,
            arrows = _props2.arrows,
            arrowSize = _props2.arrowSize,
            arrowPosition = _props2.arrowPosition,
            arrowDirection = _props2.arrowDirection,
            dots = _props2.dots,
            dotsClass = _props2.dotsClass,
            cssEase = _props2.cssEase,
            speed = _props2.speed,
            infinite = _props2.infinite,
            centerMode = _props2.centerMode,
            centerPadding = _props2.centerPadding,
            lazyLoad = _props2.lazyLoad,
            dotsDirection = _props2.dotsDirection,
            rtl = _props2.rtl,
            slidesToShow = _props2.slidesToShow,
            slidesToScroll = _props2.slidesToScroll,
            variableWidth = _props2.variableWidth,
            vertical = _props2.vertical,
            verticalSwiping = _props2.verticalSwiping,
            focusOnSelect = _props2.focusOnSelect,
            children = _props2.children,
            dotsRender = _props2.dotsRender,
            triggerType = _props2.triggerType;
        var _state = this.state,
            currentSlide = _state.currentSlide,
            lazyLoadedList = _state.lazyLoadedList,
            slideCount = _state.slideCount,
            slideWidth = _state.slideWidth,
            slideHeight = _state.slideHeight,
            trackStyle = _state.trackStyle,
            listHeight = _state.listHeight,
            dragging = _state.dragging;

        // TODO 需要精简一下

        var trackProps = {
            prefix: prefix,
            animation: animation,
            cssEase: cssEase,
            speed: speed,
            infinite: infinite,
            centerMode: centerMode,
            focusOnSelect: focusOnSelect ? this.selectHandler : null,
            currentSlide: currentSlide,
            lazyLoad: lazyLoad,
            lazyLoadedList: lazyLoadedList,
            rtl: rtl,
            slideWidth: slideWidth,
            slideHeight: slideHeight,
            slidesToShow: slidesToShow,
            slidesToScroll: slidesToScroll,
            slideCount: slideCount,
            trackStyle: trackStyle,
            variableWidth: variableWidth,
            vertical: vertical,
            verticalSwiping: verticalSwiping,
            triggerType: triggerType
            // clickHandler: this.changeSlide, unused
        };

        var dotsEle = void 0;

        if (dots === true && slideCount > slidesToShow) {
            var dotProps = {
                prefix: prefix,
                rtl: rtl,
                dotsClass: dotsClass,
                slideCount: slideCount,
                slidesToShow: slidesToShow,
                currentSlide: currentSlide,
                slidesToScroll: slidesToScroll,
                dotsDirection: dotsDirection,
                changeSlide: this.changeSlide,
                dotsRender: dotsRender,
                triggerType: triggerType
            };

            dotsEle = React.createElement(Dots, dotProps);
        }

        var prevArrow = void 0,
            nextArrow = void 0;

        var arrowProps = {
            prefix: prefix,
            rtl: rtl,
            arrowSize: arrowSize,
            arrowPosition: arrowPosition,
            arrowDirection: arrowDirection,
            infinite: infinite,
            centerMode: centerMode,
            currentSlide: currentSlide,
            slideCount: slideCount,
            slidesToShow: slidesToShow,
            clickHandler: this.changeSlide
        };

        if (arrows) {
            prevArrow = React.createElement(
                Arrow,
                _extends({}, arrowProps, {
                    type: 'prev',
                    'aria-label': 'Previous',
                    ref: this._instanceRefHandler.bind(this, 'pArrow'),
                    onMouseEnter: animation ? this.onEnterArrow.bind(this, 'prev') : noop,
                    onMouseLeave: animation ? this.onLeaveArrow.bind(this, 'prev') : noop
                }),
                this.props.prevArrow
            );

            nextArrow = React.createElement(
                Arrow,
                _extends({}, arrowProps, {
                    type: 'next',
                    'aria-label': 'Next',
                    ref: this._instanceRefHandler.bind(this, 'nArrow'),
                    onMouseEnter: animation ? this.onEnterArrow.bind(this, 'next') : noop,
                    onMouseLeave: animation ? this.onLeaveArrow.bind(this, 'next') : noop
                }),
                this.props.nextArrow
            );
        }

        var verticalHeightStyle = vertical ? {
            height: listHeight
        } : null;

        var centerPaddingStyle = void 0;
        if (centerMode) {
            centerPaddingStyle = vertical ? { padding: centerPadding + ' 0px' } : { padding: '0px ' + centerPadding };
        }

        return React.createElement(
            'div',
            {
                className: prefix + 'slick-container ' + prefix + 'slick-initialized',
                onMouseEnter: this.onInnerSliderEnter,
                onMouseLeave: this.onInnerSliderLeave
            },
            React.createElement(
                'div',
                {
                    ref: this._instanceRefHandler.bind(this, 'list'),
                    className: prefix + 'slick-list',
                    style: _extends({}, verticalHeightStyle, centerPaddingStyle),
                    onMouseDown: this.swipeStart,
                    onMouseUp: this.swipeEnd,
                    onTouchStart: this.swipeStart,
                    onTouchEnd: this.swipeEnd,
                    onMouseMove: dragging ? this.swipeMove : null,
                    onMouseLeave: dragging ? this.swipeEnd : null,
                    onTouchMove: dragging ? this.swipeMove : null,
                    onTouchCancel: dragging ? this.swipeEnd : null
                },
                React.createElement(
                    Track,
                    _extends({
                        ref: this._instanceRefHandler.bind(this, 'track')
                    }, trackProps),
                    children
                )
            ),
            prevArrow,
            nextArrow,
            dotsEle
        );
    };

    return InnerSlider;
}(React.Component), _class.propTypes = {
    prefix: PropTypes.string,
    animation: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    arrows: PropTypes.bool,
    arrowSize: PropTypes.oneOf(['medium', 'large']),
    arrowPosition: PropTypes.oneOf(['inner', 'outer']),
    arrowDirection: PropTypes.oneOf(['hoz', 'ver']),
    centerPadding: PropTypes.any,
    children: PropTypes.any,
    centerMode: PropTypes.bool,
    dots: PropTypes.bool,
    dotsDirection: PropTypes.oneOf(['hoz', 'ver']),
    dotsClass: PropTypes.string,
    focusOnSelect: PropTypes.bool,
    cssEase: PropTypes.string,
    speed: PropTypes.number,
    infinite: PropTypes.bool,
    defaultActiveIndex: PropTypes.number,
    rtl: PropTypes.bool,
    slidesToShow: PropTypes.number,
    lazyLoad: PropTypes.bool,
    activeIndex: PropTypes.number,
    slidesToScroll: PropTypes.number,
    variableWidth: PropTypes.bool,
    vertical: PropTypes.bool,
    verticalSwiping: PropTypes.bool,
    prevArrow: PropTypes.element,
    nextArrow: PropTypes.element,
    dotsRender: PropTypes.func,
    triggerType: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-',
    arrowDirection: 'hoz',
    triggerType: 'click'
}, _temp);

// extend prototype

InnerSlider.displayName = 'InnerSlider';
_extends(InnerSlider.prototype, HelpersMixin);
_extends(InnerSlider.prototype, EventHandlersMixin);

export default InnerSlider;