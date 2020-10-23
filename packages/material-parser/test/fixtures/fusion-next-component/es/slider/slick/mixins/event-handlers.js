import _extends from 'babel-runtime/helpers/extends';
import { findDOMNode } from 'react-dom';
import { getTrackCSS, getTrackLeft, getTrackAnimateCSS } from './trackHelper';

/* istanbul ignore next */
var EventHandlers = {
    // Event handler for previous and next
    changeSlide: function changeSlide(options) {
        var slideOffset = void 0,
            targetSlide = void 0;
        var unevenOffset = this.state.slideCount % this.props.slidesToScroll !== 0;
        var indexOffset = unevenOffset ? 0 : (this.state.slideCount - this.state.currentSlide) % this.props.slidesToScroll;

        if (options.message === 'previous') {
            slideOffset = indexOffset === 0 ? this.props.slidesToScroll : this.props.slidesToShow - indexOffset;
            targetSlide = this.state.currentSlide - slideOffset;
        } else if (options.message === 'next') {
            slideOffset = indexOffset === 0 ? this.props.slidesToScroll : indexOffset;
            targetSlide = this.state.currentSlide + slideOffset;
        } else if (options.message === 'dots' || options.message === 'children') {
            // Click on dots
            targetSlide = options.index * options.slidesToScroll;
            if (targetSlide === options.currentSlide) {
                return;
            }
        } else if (options.message === 'index') {
            targetSlide = options.index;
            if (targetSlide === options.currentSlide) {
                return;
            }
        }
        this.slideHandler(targetSlide);
    },


    // Accessiblity handler for previous and next
    keyHandler: function keyHandler(e) {
        //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if (!e.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (e.keyCode === 37 && this.props.accessibility === true) {
                this.changeSlide({
                    message: this.props.rtl === true ? 'next' : 'previous'
                });
            } else if (e.keyCode === 39 && this.props.accessibility === true) {
                this.changeSlide({
                    message: this.props.rtl === true ? 'previous' : 'next'
                });
            }
        }
    },


    // Focus on selecting a slide (click handler on track)
    selectHandler: function selectHandler(options) {
        this.changeSlide(options);
    },
    swipeStart: function swipeStart(e) {
        if (this.props.swipe === false || 'ontouchend' in document && this.props.swipe === false) {
            return;
        } else if (this.props.draggable === false && e.type.indexOf('mouse') !== -1) {
            return;
        }
        var posX = e.touches !== undefined ? e.touches[0].pageX : e.clientX;
        var posY = e.touches !== undefined ? e.touches[0].pageY : e.clientY;
        this.setState({
            dragging: true,
            touchObject: {
                startX: posX,
                startY: posY,
                curX: posX,
                curY: posY
            }
        });
    },
    swipeMove: function swipeMove(e) {
        if (!this.state.dragging) {
            return;
        }
        if (this.state.animating) {
            return;
        }
        var touchObject = this.state.touchObject;

        var curLeft = getTrackLeft(_extends({
            slideIndex: this.state.currentSlide,
            trackRef: this.refs.track
        }, this.props, this.state));

        touchObject.curX = e.touches ? e.touches[0].pageX : e.clientX;
        touchObject.curY = e.touches ? e.touches[0].pageY : e.clientY;
        touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(touchObject.curX - touchObject.startX, 2)));

        var positionOffset = (this.props.rtl === false ? 1 : -1) * (touchObject.curX > touchObject.startX ? 1 : -1);

        if (this.props.verticalSwiping === true) {
            touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(touchObject.curY - touchObject.startY, 2)));
            positionOffset = touchObject.curY > touchObject.startY ? 1 : -1;
        }

        var currentSlide = this.state.currentSlide;
        var dotCount = Math.ceil(this.state.slideCount / this.props.slidesToScroll);
        var swipeDirection = this.swipeDirection(this.state.touchObject);
        var touchSwipeLength = touchObject.swipeLength;

        if (this.props.infinite === false) {
            if (currentSlide === 0 && swipeDirection === 'right' || currentSlide + 1 >= dotCount && swipeDirection === 'left') {
                touchSwipeLength = touchObject.swipeLength * this.props.edgeFriction;

                if (this.state.edgeDragged === false && this.props.edgeEvent) {
                    this.props.edgeEvent(swipeDirection);
                    this.setState({ edgeDragged: true });
                }
            }
        }

        if (this.state.swiped === false && this.props.swipeEvent) {
            this.props.swipeEvent(swipeDirection);
            this.setState({ swiped: true });
        }

        var swipeLeft = curLeft + touchSwipeLength * positionOffset;
        this.setState({
            touchObject: touchObject,
            swipeLeft: swipeLeft,
            trackStyle: getTrackCSS(_extends({
                left: swipeLeft
            }, this.props, this.state))
        });

        if (Math.abs(touchObject.curX - touchObject.startX) < Math.abs(touchObject.curY - touchObject.startY) * 0.8) {
            return;
        }
        if (touchObject.swipeLength > 4) {
            e.preventDefault();
        }
    },
    getNavigableIndexes: function getNavigableIndexes() {
        var max = void 0;
        var breakPoint = 0;
        var counter = 0;
        var indexes = [];

        if (!this.props.infinite) {
            max = this.state.slideCount;
        } else {
            breakPoint = this.props.slidesToShow * -1;
            counter = this.props.slidesToShow * -1;
            max = this.state.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + this.props.slidesToScroll;

            counter += this.props.slidesToScroll <= this.props.slidesToShow ? this.props.slidesToScroll : this.props.slidesToShow;
        }

        return indexes;
    },
    checkNavigable: function checkNavigable(index) {
        var navigables = this.getNavigableIndexes();
        var prevNavigable = 0;

        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }

                prevNavigable = navigables[n];
            }
        }

        return index;
    },
    getSlideCount: function getSlideCount() {
        var _this = this;

        var centerOffset = this.props.centerMode ? this.state.slideWidth * Math.floor(this.props.slidesToShow / 2) : 0;
        if (this.props.swipeToSlide) {
            var swipedSlide = void 0;
            var slickList = findDOMNode(this.list);

            var slides = slickList.querySelectorAll(this.props.prefix + 'slick-slide');

            Array.from(slides).every(function (slide) {
                if (!_this.props.vertical) {
                    if (slide.offsetLeft - centerOffset + _this.getWidth(slide) / 2 > _this.state.swipeLeft * -1) {
                        swipedSlide = slide;
                        return false;
                    }
                } else if (slide.offsetTop + _this.getHeight(slide) / 2 > _this.state.swipeLeft * -1) {
                    swipedSlide = slide;
                    return false;
                }

                return true;
            });
            var slidesTraversed = Math.abs(swipedSlide.dataset.index - this.state.currentSlide) || 1;
            return slidesTraversed;
        } else {
            return this.props.slidesToScroll;
        }
    },
    swipeEnd: function swipeEnd(e) {
        if (!this.state.dragging) {
            if (this.props.swipe) {
                e.preventDefault();
            }
            return;
        }
        var touchObject = this.state.touchObject;
        var minSwipe = this.state.listWidth / this.props.touchThreshold;
        var swipeDirection = this.swipeDirection(touchObject);

        if (this.props.verticalSwiping) {
            minSwipe = this.state.listHeight / this.props.touchThreshold;
        }

        // reset the state of touch related state variables.
        this.setState({
            dragging: false,
            edgeDragged: false,
            swiped: false,
            swipeLeft: null,
            touchObject: {}
        });

        if (!touchObject.swipeLength) {
            return;
        }

        if (touchObject.swipeLength > minSwipe) {
            e.preventDefault();

            var slideCount = void 0;
            var newSlide = void 0;

            switch (swipeDirection) {
                case 'left':
                case 'down':
                    newSlide = this.state.currentSlide + this.getSlideCount();
                    slideCount = this.props.swipeToSlide ? this.checkNavigable(newSlide) : newSlide;
                    this.setState({ currentDirection: 0 });
                    break;
                case 'right':
                case 'up':
                    newSlide = this.state.currentSlide - this.getSlideCount();
                    slideCount = this.props.swipeToSlide ? this.checkNavigable(newSlide) : newSlide;
                    this.setState({ currentDirection: 1 });
                    break;
                default:
                    slideCount = this.state.currentSlide;
            }
            this.slideHandler(slideCount);
        } else {
            // Adjust the track back to it's original position.
            var currentLeft = getTrackLeft(_extends({
                slideIndex: this.state.currentSlide,
                trackRef: this.track
            }, this.props, this.state));

            this.setState({
                trackStyle: getTrackAnimateCSS(_extends({
                    left: currentLeft
                }, this.props, this.state))
            });
        }
    },
    onInnerSliderEnter: function onInnerSliderEnter() {
        if (this.props.autoplay && this.props.pauseOnHover) {
            this.pause();
        }
    },
    onInnerSliderLeave: function onInnerSliderLeave() {
        if (this.props.autoplay && this.props.pauseOnHover) {
            this.autoPlay();
        }
    }
};

export default EventHandlers;