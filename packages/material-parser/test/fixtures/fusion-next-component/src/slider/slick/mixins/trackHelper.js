import ReactDOM from 'react-dom';

const checkSpecKeys = (spec, keysArray) => {
    return keysArray.reduce((value, key) => {
        return value && spec.hasOwnProperty(key);
    }, true)
        ? null
        : console.error('Keys Missing', spec); /*eslint no-console:0*/
};

export const getTrackCSS = spec => {
    checkSpecKeys(spec, [
        'left',
        'variableWidth',
        'slideCount',
        'slidesToShow',
        'slideWidth',
    ]);

    let trackWidth;
    let trackHeight;

    const trackChildren = spec.slideCount + 2 * spec.slidesToShow;

    if (!spec.vertical) {
        if (spec.variableWidth) {
            trackWidth =
                (spec.slideCount + 2 * spec.slidesToShow) * spec.slideWidth;
        } else if (spec.centerMode) {
            trackWidth =
                (spec.slideCount + 2 * (spec.slidesToShow + 1)) *
                spec.slideWidth;
        } else {
            trackWidth =
                (spec.slideCount + 2 * spec.slidesToShow) * spec.slideWidth;
        }
    } else {
        trackHeight = trackChildren * spec.slideHeight;
    }

    let style = {
        opacity: 1,
    };

    const transform = {
        WebkitTransform: !spec.vertical
            ? `translate3d(${spec.left}px, 0px, 0px)`
            : `translate3d(0px, ${spec.left}px, 0px)`,
        transform: !spec.vertical
            ? `translate3d(${spec.left}px, 0px, 0px)`
            : `translate3d(0px, ${spec.left}px, 0px)`,
        transition: '',
        WebkitTransition: '',
        msTransform: !spec.vertical
            ? `translateX(${spec.left}px)`
            : `translateY(${spec.left}px)`,
    };

    if (trackWidth) {
        style = { ...style, width: trackWidth };
    }

    if (trackHeight) {
        style = { ...style, height: trackHeight };
    }

    if (spec.animation !== 'fade') {
        style = { ...style, ...transform };
    }

    return style;
};

export const getTrackAnimateCSS = spec => {
    checkSpecKeys(spec, [
        'left',
        'variableWidth',
        'slideCount',
        'slidesToShow',
        'slideWidth',
        'speed',
        'cssEase',
    ]);

    const style = getTrackCSS(spec);
    // useCSS is true by default so it can be undefined
    style.WebkitTransition = `-webkit-transform ${spec.speed}ms ${
        spec.cssEase
    }`;
    style.transition = `transform ${spec.speed}ms ${spec.cssEase}`;
    return style;
};

export const getTrackLeft = function(spec) {
    checkSpecKeys(spec, [
        'slideIndex',
        'trackRef',
        'infinite',
        'centerMode',
        'slideCount',
        'slidesToShow',
        'slidesToScroll',
        'slideWidth',
        'listWidth',
        'variableWidth',
        'slideHeight',
    ]);

    let slideOffset = 0;
    let targetLeft;
    let targetSlide;
    let verticalOffset = 0;

    if (spec.animation === 'fade') {
        return 0;
    }

    if (spec.infinite) {
        if (spec.slideCount > spec.slidesToShow) {
            slideOffset = spec.slideWidth * spec.slidesToShow * -1;
            verticalOffset = spec.slideHeight * spec.slidesToShow * -1;
        }
        if (spec.slideCount % spec.slidesToScroll !== 0) {
            let condition =
                spec.slideIndex + spec.slidesToScroll > spec.slideCount &&
                spec.slideCount > spec.slidesToShow;

            if (spec.rtl) {
                const slideIndex =
                    spec.slideIndex >= spec.slideCount
                        ? spec.slideCount - spec.slideIndex
                        : spec.slideIndex;
                condition =
                    slideIndex + spec.slidesToScroll > spec.slideCount &&
                    spec.slideCount > spec.slidesToShow;
            }
            if (condition) {
                if (spec.slideIndex > spec.slideCount) {
                    slideOffset =
                        (spec.slidesToShow -
                            (spec.slideIndex - spec.slideCount)) *
                        spec.slideWidth *
                        -1;
                    verticalOffset =
                        (spec.slidesToShow -
                            (spec.slideIndex - spec.slideCount)) *
                        spec.slideHeight *
                        -1;
                } else {
                    slideOffset =
                        (spec.slideCount % spec.slidesToScroll) *
                        spec.slideWidth *
                        -1;
                    verticalOffset =
                        (spec.slideCount % spec.slidesToScroll) *
                        spec.slideHeight *
                        -1;
                }
            }
        }
    } else {
        /* eslint-disable no-lonely-if */
        if (spec.slideCount % spec.slidesToScroll !== 0) {
            if (
                spec.slideIndex + spec.slidesToScroll > spec.slideCount &&
                spec.slideCount > spec.slidesToShow
            ) {
                const slidesToOffset =
                    spec.slidesToShow - (spec.slideCount % spec.slidesToScroll);
                slideOffset = slidesToOffset * spec.slideWidth;
            }
        }
    }

    if (spec.centerMode) {
        if (spec.infinite) {
            slideOffset += spec.slideWidth * Math.floor(spec.slidesToShow / 2);
        } else {
            slideOffset = spec.slideWidth * Math.floor(spec.slidesToShow / 2);
        }
    }

    if (!spec.vertical) {
        targetLeft = spec.slideIndex * spec.slideWidth * -1 + slideOffset;
    } else {
        targetLeft = spec.slideIndex * spec.slideHeight * -1 + verticalOffset;
    }

    if (spec.variableWidth === true) {
        let targetSlideIndex;
        if (spec.slideCount <= spec.slidesToShow || spec.infinite === false) {
            targetSlide = ReactDOM.findDOMNode(spec.trackRef).childNodes[
                spec.slideIndex
            ];
        } else {
            targetSlideIndex = spec.slideIndex + spec.slidesToShow;
            targetSlide = ReactDOM.findDOMNode(spec.trackRef).childNodes[
                targetSlideIndex
            ];
        }
        targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0;
        if (spec.centerMode === true) {
            if (spec.infinite === false) {
                targetSlide = ReactDOM.findDOMNode(spec.trackRef).children[
                    spec.slideIndex
                ];
            } else {
                targetSlide = ReactDOM.findDOMNode(spec.trackRef).children[
                    spec.slideIndex + spec.slidesToShow + 1
                ];
            }

            if (targetSlide) {
                targetLeft =
                    targetSlide.offsetLeft * -1 +
                    (spec.listWidth - targetSlide.offsetWidth) / 2;
            }
        }
    }

    return targetLeft;
};
