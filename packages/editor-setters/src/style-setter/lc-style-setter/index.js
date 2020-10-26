import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Field from '@ali/ve-field';
import { registerDict } from '@ali/ve-icons';
import { normalizeStyle } from '@ali/vu-css-style';

import Layout from './layout';
import Typography from './typography';
import Background from './background';
import Border from './border';
import Effects from './effects';

import utils from './utils';
import SvgLib from './svglib';
import './style.less';
import $i18n from './i18n/index';

registerDict('style', SvgLib);

/**
 * state
 * json: JSON模式
 * ----
 * layout
 *   display
 *     flexItem
 *   padding+margin
 *   size
 *     width
 *     height
 *   min+max advanced
 *   float advanced
 *   clear advanced
 *   overflow advanced
 *   position advanced
 * background
 *   color
 *   image
 * border
 *   border
 *   radius
 * typography
 *   font-family
 *   color
 *   font-size
 *   text-align
 *   line-height
 *   font-weight
 *   text-decoration
 *   font-style
 *   letter-spacing advanced
 *   text-indent advanced
 *   text-transform advanced
 *   direction advanced
 * effects
 *   opacity
 *   cursor
 * svg
 *   fill
 */

class StyleSetter extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleSetter';

  static transducer = utils.transducer;

  static defaultProps = {

  };

  render() {
    const className = classNames(
      'vs-style',
      'vs-style-advanced',
      this.props.className,
    );
    // react style -> css style
    const value = this.props.value ? normalizeStyle(this.props.value) : null;
    const defaultValue = this.props.defaultValue ? normalizeStyle(this.props.defaultValue) : null;
    const props = {...this.props, value, defaultValue};

    return (
      <div className={className}>
        <Field display="accordion" title={$i18n.get({ id: 'styleLayout', dm: '布局' })}>
          <Layout {...props} />
        </Field>
        <Field display="accordion" title={$i18n.get({ id: 'styleText', dm: '文字' })}>
          <Typography {...props} />
        </Field>
        <Field display="accordion" title={$i18n.get({ id: 'styleBackground', dm: '背景' })}>
          <Background {...props} />
        </Field>
        <Field display="accordion" title={$i18n.get({ id: 'styleFrame', dm: '边框' })}>
          <Border {...props} />
        </Field>
        <Field display="accordion" title={$i18n.get({ id: 'styleEffect', dm: '效果' })}>
          <Effects {...props} />
        </Field>
      </div>
    );
  }
}

StyleSetter.Layout = Layout;
StyleSetter.Typography = Typography;
StyleSetter.Background = Background;
StyleSetter.Effects = Effects;
StyleSetter.Border = Border;

// StyleSetter.Svg = Svg;

export default StyleSetter;
