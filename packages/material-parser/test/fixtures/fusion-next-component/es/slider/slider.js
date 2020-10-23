import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { obj } from '../util';
import InnerSlider from './slick/inner-slider';
import ConfigProvider from '../config-provider';

/**
 * Slider
 */
var Slider = (_temp2 = _class = function (_Component) {
  _inherits(Slider, _Component);

  function Slider() {
    var _temp, _this, _ret;

    _classCallCheck(this, Slider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.resize = function () {
      // export api
      _this.innerSlider.onWindowResized();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Slider.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        prefix = _props.prefix,
        arrowPosition = _props.arrowPosition,
        slideDirection = _props.slideDirection,
        style = _props.style,
        className = _props.className,
        children = _props.children;


    var globalProps = {};
    Object.keys(ConfigProvider.propTypes).forEach(function (key) {
      globalProps[key] = _this2.props[key];
    });

    var sliderProps = obj.pickOthers(['className', 'style', 'slideDirection'], this.props);
    var slideCount = React.Children.count(children);

    if (slideCount === 0) {
      // 没有 item 时不显示 slider
      return null;
    } else if (slideCount === 1) {
      // 单个 item 时不显示箭头和控制器
      sliderProps.arrows = false;
      sliderProps.autoplay = false;
      sliderProps.draggable = false;
    }

    var clazz = classNames([prefix + 'slick', prefix + 'slick-' + arrowPosition, prefix + 'slick-' + slideDirection], className);

    if (slideDirection === 'ver') {
      // 向下传递时使用 vertical 属性
      sliderProps.vertical = true;
      sliderProps.verticalSwiping = true;
    }

    return React.createElement(
      ConfigProvider,
      _extends({}, globalProps, { rtl: false }),
      React.createElement(
        'div',
        _extends({
          dir: 'ltr',
          className: clazz,
          style: style
        }, obj.pickOthers(_extends({}, Slider.propTypes, InnerSlider.propTypes), sliderProps)),
        React.createElement(InnerSlider, _extends({
          ref: function ref(InnerSlider) {
            return _this2.innerSlider = InnerSlider;
          }
        }, sliderProps))
      )
    );
  };

  return Slider;
}(Component), _class.propTypes = {
  prefix: PropTypes.string,
  rtl: PropTypes.bool,
  /**
   * 自定义传入的样式
   */
  className: PropTypes.any,
  /**
   * 是否使用自适应高度
   */
  adaptiveHeight: PropTypes.bool,
  /**
   * 动效类型，默认是'slide'
   */
  animation: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  /**
   * 是否显示箭头
   */
  arrows: PropTypes.bool,
  /**
   * 导航箭头大小 可选值: 'medium', 'large'
   */
  arrowSize: PropTypes.oneOf(['medium', 'large']),
  /**
   * 导航箭头位置 可选值: 'inner', 'outer'
   */
  arrowPosition: PropTypes.oneOf(['inner', 'outer']),
  /**
   * 导航箭头的方向 可选值: 'hoz', 'ver'
   */
  arrowDirection: PropTypes.oneOf(['hoz', 'ver']),
  /**
   * 是否自动播放
   */
  autoplay: PropTypes.bool,
  /**
   * 自动播放的速度
   */
  autoplaySpeed: PropTypes.number,
  /**
   * 向后箭头
   */
  nextArrow: PropTypes.element,
  /**
   * 向前箭头
   */
  prevArrow: PropTypes.element,
  /**
   * 是否启用居中模式
   */
  centerMode: PropTypes.bool,
  /**
   * 是否显示导航锚点
   */
  dots: PropTypes.bool,
  /**
   * 导航锚点位置
   */
  dotsDirection: PropTypes.oneOf(['hoz', 'ver']),
  dotsClass: PropTypes.string,
  /**
   * 自定义导航锚点
   */
  dotRender: PropTypes.func,
  /**
   * 是否可拖拽
   */
  draggable: PropTypes.bool,
  /**
   * 是否使用无穷循环模式
   */
  infinite: PropTypes.bool,
  /**
   * 初始被激活的轮播图
   */
  defaultActiveIndex: PropTypes.number,
  /**
   * 是否启用懒加载
   */
  lazyLoad: PropTypes.bool,
  slide: PropTypes.string,
  /**
   * 轮播方向
   */
  slideDirection: PropTypes.oneOf(['hoz', 'ver']),
  /**
   * 同时展示的图片数量
   */
  slidesToShow: PropTypes.number,
  /**
   * 同时滑动的图片数量
   */
  slidesToScroll: PropTypes.number,
  /**
   * 轮播速度
   */
  speed: PropTypes.number,
  /**
   * 跳转到指定的轮播图（受控）
   */
  activeIndex: PropTypes.number,
  /**
   * 锚点导航触发方式
   */
  triggerType: PropTypes.oneOf(['click', 'hover']),
  /**
   * 轮播切换的回调函数
   * @param {Number} index 幻灯片的索引
   */
  onChange: PropTypes.func,
  onBeforeChange: PropTypes.func, // 兼容 0.x onBeforeChange
  children: PropTypes.any,
  /**
   * 自定义传入的class
   */
  style: PropTypes.object,
  /**
   * Side padding when in center mode (px or %); 展示部分为center，pading会产生前后预览
   */
  centerPadding: PropTypes.string,
  /**
   * CSS3 Animation Easing,默认‘ease’
   */
  cssEase: PropTypes.string, // used
  edgeFriction: PropTypes.number, // 非无限轮播滑动到边缘时的阻力
  /**
   * 多图轮播时，点击选中后自动居中
   */
  focusOnSelect: PropTypes.bool,
  pauseOnHover: PropTypes.bool, // 鼠标经过时停止播放
  swipe: PropTypes.bool,
  swipeToSlide: PropTypes.bool,
  touchMove: PropTypes.bool,
  touchThreshold: PropTypes.number,
  useCSS: PropTypes.bool,
  variableWidth: PropTypes.bool, // used
  waitForAnimate: PropTypes.bool,
  edgeEvent: PropTypes.any,
  swipeEvent: PropTypes.any
}, _class.defaultProps = {
  prefix: 'next-',
  animation: 'slide',
  arrowSize: 'medium',
  arrowPosition: 'inner',
  vertical: false,
  verticalSwiping: false,
  dots: true,
  dotsDirection: 'hoz',
  arrows: true,
  arrowDirection: 'hoz',
  infinite: true,
  autoplay: false,
  autoplaySpeed: 3000,
  speed: 600,
  adaptiveHeight: false,
  centerMode: false,
  centerPadding: '50px', // Side padding when in center mode (px or %); 展示部分为center，pading会产生前后预览
  cssEase: 'ease',
  draggable: true,
  edgeFriction: 0.35,
  focusOnSelect: false,
  defaultActiveIndex: 0,
  lazyLoad: false,
  pauseOnHover: false,
  rtl: false,
  slide: 'div',
  slideDirection: 'hoz',
  slidesToShow: 1,
  slidesToScroll: 1,
  swipe: true,
  swipeToSlide: false, // Allow users to drag or swipe directly to a slide irrespective of slidesToScroll
  touchMove: true, // 移动端touch
  touchThreshold: 5,
  useCSS: true,
  variableWidth: false,
  waitForAnimate: true,
  onChange: function onChange() {},
  onBeforeChange: function onBeforeChange() {},
  edgeEvent: null,
  swipeEvent: null,
  nextArrow: null, // nextArrow, prevArrow are react components
  prevArrow: null,
  style: null,
  dotsRender: null,
  triggerType: 'click'
}, _temp2);
Slider.displayName = 'Slider';
export { Slider as default };