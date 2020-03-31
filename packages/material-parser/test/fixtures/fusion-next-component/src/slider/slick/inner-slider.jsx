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

const { noop } = func;

class InnerSlider extends React.Component {
    static propTypes = {
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
        triggerType: PropTypes.string,
    };

    static defaultProps = {
        prefix: 'next-',
        arrowDirection: 'hoz',
        triggerType: 'click',
    };

    constructor(props) {
        super(props);

        this.state = {
            animating: false,
            dragging: false,
            autoPlayTimer: null,
            currentDirection: 0,
            currentLeft: null,
            currentSlide:
                'activeIndex' in props
                    ? props.activeIndex
                    : props.defaultActiveIndex,
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
                curY: 0,
            },

            lazyLoadedList: [],

            // added for react
            initialized: false,
            edgeDragged: false,
            swiped: false, // used by swipeEvent. differentites between touch and swipe.
            trackStyle: {},
            trackWidth: 0,
        };

        // this.filterProps = Object.assign({}, sliderPropTypes, InnerSlider.propTypes);

        func.bindCtx(this, [
            'onWindowResized',
            'selectHandler',
            'changeSlide',
            'onInnerSliderEnter',
            'onInnerSliderLeave',
            'swipeStart',
            'swipeMove',
            'swipeEnd',
        ]);
    }

    componentWillMount() {
        this.hasMounted = true;

        const { lazyLoad, children, slidesToShow } = this.props;
        const { currentSlide } = this.state;
        const lazyLoadedList = [];

        if (lazyLoad) {
            for (let i = 0, j = React.Children.count(children); i < j; i++) {
                if (i >= currentSlide && i < currentSlide + slidesToShow) {
                    lazyLoadedList.push(i);

                    const pre = i - 1 < 0 ? j - 1 : i - 1;
                    const next = i + 1 >= j ? 0 : i + 1;

                    lazyLoadedList.push(pre);
                    lazyLoadedList.push(next);
                }
            }

            if (this.state.lazyLoadedList.length === 0) {
                this.setState({
                    lazyLoadedList,
                });
            }
        }
    }

    componentDidMount() {
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
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.defaultActiveIndex !== nextProps.defaultActiveIndex) {
            this.setState({
                currentSlide: nextProps.defaultActiveIndex,
            });
        }

        if (this.props.activeIndex !== nextProps.activeIndex) {
            this.slickGoTo(nextProps.activeIndex);
        } else if (this.state.currentSlide >= nextProps.children.length) {
            this.update(nextProps);
            this.changeSlide({
                message: 'index',
                index: nextProps.children.length - nextProps.slidesToShow,
                currentSlide: this.state.currentSlide,
            });
        } else {
            const others = ['children'];
            const update = !obj.shallowEqual(
                obj.pickOthers(others, this.props),
                obj.pickOthers(others, nextProps)
            );
            if (update) {
                this.update(nextProps);
            }
        }
    }

    componentDidUpdate() {
        this.adaptHeight();
    }

    componentWillUnmount() {
        if (this.animationEndCallback) {
            clearTimeout(this.animationEndCallback);
        }

        events.off(window, 'resize', this.onWindowResized);

        if (this.state.autoPlayTimer) {
            clearInterval(this.state.autoPlayTimer);
        }
    }

    onWindowResized() {
        this.update(this.props);
        // animating state should be cleared while resizing, otherwise autoplay stops working
        this.setState({ animating: false });
        clearTimeout(this.animationEndCallback);
        delete this.animationEndCallback;
    }

    slickGoTo(slide) {
        typeof slide === 'number' &&
            this.changeSlide({
                message: 'index',
                index: slide,
                currentSlide: this.state.currentSlide,
            });
    }

    onEnterArrow(msg) {
        this.arrowHoverHandler(msg);
    }

    onLeaveArrow() {
        this.arrowHoverHandler();
    }

    _instanceRefHandler(attr, ref) {
        this[attr] = ref;
    }

    render() {
        const {
            prefix,
            animation,
            arrows,
            arrowSize,
            arrowPosition,
            arrowDirection,
            dots,
            dotsClass,
            cssEase,
            speed,
            infinite,
            centerMode,
            centerPadding,
            lazyLoad,
            dotsDirection,
            rtl,
            slidesToShow,
            slidesToScroll,
            variableWidth,
            vertical,
            verticalSwiping,
            focusOnSelect,
            children,
            dotsRender,
            triggerType,
        } = this.props;

        const {
            currentSlide,
            lazyLoadedList,
            slideCount,
            slideWidth,
            slideHeight,
            trackStyle,
            listHeight,
            dragging,
        } = this.state;

        // TODO 需要精简一下
        const trackProps = {
            prefix,
            animation,
            cssEase,
            speed,
            infinite,
            centerMode,
            focusOnSelect: focusOnSelect ? this.selectHandler : null,
            currentSlide,
            lazyLoad,
            lazyLoadedList,
            rtl,
            slideWidth,
            slideHeight,
            slidesToShow,
            slidesToScroll,
            slideCount,
            trackStyle,
            variableWidth,
            vertical,
            verticalSwiping,
            triggerType,
            // clickHandler: this.changeSlide, unused
        };

        let dotsEle;

        if (dots === true && slideCount > slidesToShow) {
            const dotProps = {
                prefix,
                rtl,
                dotsClass,
                slideCount,
                slidesToShow,
                currentSlide,
                slidesToScroll,
                dotsDirection,
                changeSlide: this.changeSlide,
                dotsRender,
                triggerType,
            };

            dotsEle = <Dots {...dotProps} />;
        }

        let prevArrow, nextArrow;

        const arrowProps = {
            prefix,
            rtl,
            arrowSize,
            arrowPosition,
            arrowDirection,
            infinite,
            centerMode,
            currentSlide,
            slideCount,
            slidesToShow,
            clickHandler: this.changeSlide,
        };

        if (arrows) {
            prevArrow = (
                <Arrow
                    {...arrowProps}
                    type="prev"
                    aria-label="Previous"
                    ref={this._instanceRefHandler.bind(this, 'pArrow')}
                    onMouseEnter={
                        animation ? this.onEnterArrow.bind(this, 'prev') : noop
                    }
                    onMouseLeave={
                        animation ? this.onLeaveArrow.bind(this, 'prev') : noop
                    }
                >
                    {this.props.prevArrow}
                </Arrow>
            );

            nextArrow = (
                <Arrow
                    {...arrowProps}
                    type="next"
                    aria-label="Next"
                    ref={this._instanceRefHandler.bind(this, 'nArrow')}
                    onMouseEnter={
                        animation ? this.onEnterArrow.bind(this, 'next') : noop
                    }
                    onMouseLeave={
                        animation ? this.onLeaveArrow.bind(this, 'next') : noop
                    }
                >
                    {this.props.nextArrow}
                </Arrow>
            );
        }

        const verticalHeightStyle = vertical
            ? {
                  height: listHeight,
              }
            : null;

        let centerPaddingStyle;
        if (centerMode) {
            centerPaddingStyle = vertical
                ? { padding: `${centerPadding} 0px` }
                : { padding: `0px ${centerPadding}` };
        }

        return (
            <div
                className={`${prefix}slick-container ${prefix}slick-initialized`}
                onMouseEnter={this.onInnerSliderEnter}
                onMouseLeave={this.onInnerSliderLeave}
            >
                <div
                    ref={this._instanceRefHandler.bind(this, 'list')}
                    className={`${prefix}slick-list`}
                    style={{ ...verticalHeightStyle, ...centerPaddingStyle }}
                    onMouseDown={this.swipeStart}
                    onMouseUp={this.swipeEnd}
                    onTouchStart={this.swipeStart}
                    onTouchEnd={this.swipeEnd}
                    onMouseMove={dragging ? this.swipeMove : null}
                    onMouseLeave={dragging ? this.swipeEnd : null}
                    onTouchMove={dragging ? this.swipeMove : null}
                    onTouchCancel={dragging ? this.swipeEnd : null}
                >
                    <Track
                        ref={this._instanceRefHandler.bind(this, 'track')}
                        {...trackProps}
                    >
                        {children}
                    </Track>
                </div>
                {prevArrow}
                {nextArrow}
                {dotsEle}
            </div>
        );
    }
}

// extend prototype
Object.assign(InnerSlider.prototype, HelpersMixin);
Object.assign(InnerSlider.prototype, EventHandlersMixin);

export default InnerSlider;
