import React from 'react';
import ReactDOM from 'react-dom';
import { getTrackCSS, getTrackLeft, getTrackAnimateCSS } from './trackHelper';

const helpers = {
    initialize(props) {
        const slickList = ReactDOM.findDOMNode(this.list);
        const slideCount = React.Children.count(props.children);
        const listWidth = this.getWidth(slickList);
        const trackWidth = this.getWidth(ReactDOM.findDOMNode(this.track));
        let slideWidth;

        if (!props.vertical) {
            const centerPaddingAdj =
                props.centerMode && parseInt(props.centerPadding) * 2;
            slideWidth = (listWidth - centerPaddingAdj) / props.slidesToShow;
        } else {
            slideWidth = listWidth;
        }

        const slideHeight = this.getHeight(
            slickList.querySelector('[data-index="0"]')
        );
        const listHeight = slideHeight * props.slidesToShow;

        const slidesToShow = props.slidesToShow || 1;
        const currentSlide = props.rtl
            ? slideCount - 1 - (slidesToShow - 1) - props.defaultActiveIndex
            : props.defaultActiveIndex;

        this.setState(
            {
                slideCount,
                slideWidth,
                listWidth,
                trackWidth,
                currentSlide,
                slideHeight,
                listHeight,
            },
            () => {
                const targetLeft = getTrackLeft({
                    slideIndex: this.state.currentSlide,
                    trackRef: this.track,
                    ...props,
                    ...this.state,
                });
                // getCSS function needs previously set state
                const trackStyle = getTrackCSS({
                    left: targetLeft,
                    ...props,
                    ...this.state,
                });

                this.setState({ trackStyle: trackStyle });

                this.autoPlay(); // once we're set up, trigger the initial autoplay.
            }
        );
    },

    update(props) {
        this.initialize(props);
    },

    getWidth(elem) {
        return elem.getBoundingClientRect().width || elem.offsetWidth;
    },

    getHeight(elem) {
        return elem.getBoundingClientRect().height || elem.offsetHeight;
    },

    adaptHeight() {
        if (this.props.adaptiveHeight) {
            const selector = `[data-index="${this.state.currentSlide}"]`;
            if (this.list) {
                const slickList = ReactDOM.findDOMNode(this.list);
                const listHeight = slickList.querySelector(selector)
                    .offsetHeight;
                slickList.style.height = `${listHeight}px`;
            }
        }
    },

    canGoNext(opts) {
        let canGo = true;
        if (!opts.infinite) {
            if (opts.centerMode) {
                if (opts.currentSlide >= opts.slideCount - 1) {
                    canGo = false;
                }
            } else if (
                opts.slideCount <= opts.slidesToShow ||
                opts.currentSlide >= opts.slideCount - opts.slidesToShow
            ) {
                // check if all slides are shown in slider
                canGo = false;
            }
        }
        return canGo;
    },

    slideHandler(index) {
        const { rtl } = this.props;

        // Functionality of animateSlide and postSlide is merged into this function
        let targetSlide, currentSlide;
        let callback;

        if (this.props.waitForAnimate && this.state.animating) {
            return;
        }

        if (this.props.animation === 'fade') {
            currentSlide = this.state.currentSlide;

            // don't change slide if it's not infinite and current slide is the first or last slide'
            if (
                this.props.infinite === false &&
                (index < 0 || index >= this.state.slideCount)
            ) {
                return;
            }

            //  Shifting targetSlide back into the range
            if (index < 0) {
                targetSlide = index + this.state.slideCount;
            } else if (index >= this.state.slideCount) {
                targetSlide = index - this.state.slideCount;
            } else {
                targetSlide = index;
            }

            if (
                this.props.lazyLoad &&
                this.state.lazyLoadedList.indexOf(targetSlide) < 0
            ) {
                this.setState({
                    lazyLoadedList: this.state.lazyLoadedList.concat(
                        targetSlide
                    ),
                });
            }

            callback = () => {
                this.setState({
                    animating: false,
                });
                this.props.onChange(targetSlide);
                delete this.animationEndCallback;
            };

            this.props.onBeforeChange(this.state.currentSlide, targetSlide);

            this.setState(
                {
                    animating: true,
                    currentSlide: targetSlide,
                },
                function() {
                    this.animationEndCallback = setTimeout(
                        callback,
                        this.props.speed + 20
                    );
                }
            );

            this.autoPlay();
            return;
        }

        targetSlide = index;

        if (rtl) {
            if (targetSlide < 0) {
                if (this.props.infinite === false) {
                    currentSlide = 0;
                } else if (
                    this.state.slideCount % this.props.slidesToScroll !==
                    0
                ) {
                    if (targetSlide + this.props.slidesToScroll <= 0) {
                        currentSlide = this.state.slideCount + targetSlide;
                        targetSlide =
                            this.state.slideCount - this.props.slidesToScroll;
                    } else {
                        currentSlide = targetSlide = 0;
                    }
                } else {
                    // this.state.slideCount % this.props.slidesToScroll
                    currentSlide = this.state.slideCount + targetSlide;
                }
            } else if (targetSlide >= this.state.slideCount) {
                if (this.props.infinite === false) {
                    currentSlide =
                        this.state.slideCount - this.props.slidesToShow;
                } else if (
                    this.state.slideCount % this.props.slidesToScroll !==
                    0
                ) {
                    currentSlide = 0;
                } else {
                    currentSlide = targetSlide - this.state.slideCount;
                }
            } else {
                currentSlide = targetSlide;
            }
        } else if (targetSlide < 0) {
            if (this.props.infinite === false) {
                currentSlide = 0;
            } else if (
                this.state.slideCount % this.props.slidesToScroll !==
                0
            ) {
                currentSlide =
                    this.state.slideCount -
                    (this.state.slideCount % this.props.slidesToScroll);
            } else {
                currentSlide = this.state.slideCount + targetSlide;
            }
        } else if (targetSlide >= this.state.slideCount) {
            if (this.props.infinite === false) {
                currentSlide = this.state.slideCount - this.props.slidesToShow;
            } else if (
                this.state.slideCount % this.props.slidesToScroll !==
                0
            ) {
                currentSlide = 0;
            } else {
                currentSlide = targetSlide - this.state.slideCount;
            }
        } else {
            currentSlide = targetSlide;
        }

        let targetLeft = getTrackLeft({
            slideIndex: targetSlide,
            trackRef: this.track,
            ...this.props,
            ...this.state,
        });

        const currentLeft = getTrackLeft({
            slideIndex: currentSlide,
            trackRef: this.track,
            ...this.props,
            ...this.state,
        });

        if (this.props.infinite === false) {
            targetLeft = currentLeft;
        }

        if (this.props.lazyLoad) {
            let loaded = true;
            const slidesToLoad = [];
            const slidesLen = this.state.slideCount;

            const sliderIndex =
                targetSlide < 0 ? slidesLen + targetSlide : currentSlide;

            for (
                let i = sliderIndex;
                i < sliderIndex + this.props.slidesToShow;
                i++
            ) {
                let k = i;
                if (rtl) {
                    k =
                        i >= slidesLen
                            ? slidesLen * 2 - i - 1
                            : slidesLen - i - 1;
                }

                const pre = k - 1 < 0 ? slidesLen - 1 : k - 1;
                const next = k + 1 >= slidesLen ? 0 : k + 1;

                this.state.lazyLoadedList.indexOf(k) < 0 &&
                    slidesToLoad.push(k);
                this.state.lazyLoadedList.indexOf(pre) < 0 &&
                    slidesToLoad.push(pre);
                this.state.lazyLoadedList.indexOf(next) < 0 &&
                    slidesToLoad.push(next);
            }

            slidesToLoad.forEach(i => {
                if (this.state.lazyLoadedList.indexOf(i) < 0) {
                    loaded = false;
                }
            });

            if (!loaded) {
                this.setState({
                    lazyLoadedList: this.state.lazyLoadedList.concat(
                        slidesToLoad
                    ),
                });
            }
        }

        this.props.onBeforeChange(this.state.currentSlide, currentSlide);

        // Slide Transition happens here.
        // animated transition happens to target Slide and
        // non - animated transition happens to current Slide
        // If CSS transitions are false, directly go the current slide.
        /* istanbul ignore if */
        if (this.props.useCSS === false) {
            this.setState(
                {
                    currentSlide: currentSlide,
                    trackStyle: getTrackCSS({
                        left: currentLeft,
                        ...this.props,
                        ...this.state,
                    }),
                },
                () => {
                    this.props.onChange(currentSlide);
                }
            );
        } else {
            const nextStateChanges = {
                animating: false,
                currentSlide: currentSlide,
                trackStyle: getTrackCSS({
                    left: currentLeft,
                    ...this.props,
                    ...this.state,
                }),
                swipeLeft: null,
            };

            callback = () => {
                this.setState(nextStateChanges);
                this.props.onChange(currentSlide);
                delete this.animationEndCallback;
            };

            this.setState(
                {
                    animating: true,
                    currentSlide: currentSlide,
                    trackStyle: getTrackAnimateCSS({
                        left: targetLeft,
                        ...this.props,
                        ...this.state,
                    }),
                },
                function() {
                    this.animationEndCallback = setTimeout(
                        callback,
                        this.props.speed + 20
                    );
                }
            );
        }

        this.autoPlay();
    },

    // 鼠标悬浮在 arrow 上时作出动画反馈
    arrowHoverHandler(msg) {
        const offset = 30; // slide 的位置偏移量
        const targetLeft = getTrackLeft({
            slideIndex: this.state.currentSlide,
            trackRef: this.track,
            ...this.props,
            ...this.state,
        });

        let left;
        /* istanbul ignore next */
        if (msg === 'next') {
            left = targetLeft - offset;
        } else if (msg === 'prev') {
            left = targetLeft + offset;
        } else {
            left = targetLeft;
        }

        this.setState({
            trackStyle: getTrackAnimateCSS({
                left,
                ...this.props,
                ...this.state,
            }),
        });
    },

    swipeDirection(touchObject) {
        /* istanbul ignore next */
        let swipeAngle;
        /* istanbul ignore next */
        const xDist = touchObject.startX - touchObject.curX;
        /* istanbul ignore next */
        const yDist = touchObject.startY - touchObject.curY;
        /* istanbul ignore next */
        const r = Math.atan2(yDist, xDist);
        /* istanbul ignore next */
        swipeAngle = Math.round((r * 180) / Math.PI);
        /* istanbul ignore next */
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }
        /* istanbul ignore next */
        if (
            (swipeAngle <= 45 && swipeAngle >= 0) ||
            (swipeAngle <= 360 && swipeAngle >= 315)
        ) {
            return this.props.rtl === false ? 'left' : 'right';
        }
        /* istanbul ignore next */
        if (swipeAngle >= 135 && swipeAngle <= 225) {
            return this.props.rtl === false ? 'right' : 'left';
        }
        /* istanbul ignore next */
        if (this.props.verticalSwiping === true) {
            if (swipeAngle >= 35 && swipeAngle <= 135) {
                return 'down';
            } else {
                return 'up';
            }
        }

        /* istanbul ignore next */
        return 'vertical';
    },

    play() {
        let nextIndex;
        if (!this.hasMounted) {
            /* istanbul ignore next */
            return false;
        }
        if (this.props.rtl) {
            nextIndex = this.state.currentSlide - this.props.slidesToScroll;
        } else if (this.canGoNext({ ...this.props, ...this.state })) {
            nextIndex = this.state.currentSlide + this.props.slidesToScroll;
        } else {
            return false;
        }
        this.slideHandler(nextIndex);
    },

    autoPlay() {
        if (this.state.autoPlayTimer) {
            clearTimeout(this.state.autoPlayTimer);
        }
        if (this.props.autoplay) {
            this.setState({
                autoPlayTimer: setTimeout(
                    this.play.bind(this),
                    this.props.autoplaySpeed
                ),
            });
        }
    },

    pause() {
        /* istanbul ignore next */
        if (this.state.autoPlayTimer) {
            clearTimeout(this.state.autoPlayTimer);
            this.setState({
                autoPlayTimer: null,
            });
        }
    },
};

export default helpers;
