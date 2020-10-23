import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Field from '@ali/ve-field';
import Icons from '@ali/ve-icons';
import Family from './family';
import Weight from './weight';
import Style from './style';
import Color from './color';
import Size from './size';
import LineHeight from './lineheight';
import TextAlign from './textalign';
import TextDecoration from './textdecoration';
import utils from '../utils';
import $i18n from '../i18n/index';

class Typography extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleTypographySetter';

  static transducer = utils.transducer;

  componentWillMount() {

  }

  // shouldComponentUpdate() {
  //   return false;
  // }

  componentWillUnmount() {

  }

  render() {
    const className = classNames('vs-style-typography', this.props.className);
    return (
      <div className={className}>
        <Field
          display="inline"
          highlight={utils.getCurrentPropertyHighlight(this.props, 'font-family')}
          title={(
<span data-tip={$i18n.get({ id: 'styleFont', dm: '字体' })}>
              <Icons name="style.font-family" size="medium" />
</span>
)}
        >
          <Family {...this.props} />
        </Field>
        <Field display="plain" className="vs-flex-field">
          <Field
            display="inline"
            highlight={utils.getCurrentPropertyHighlight(this.props, 'font-weight')}
            title={(
<span data-tip={$i18n.get({ id: 'styleWordWeight', dm: '字重' })}>
                <Icons name="style.font-weight" size="medium" />
</span>
)}
          >
            <Weight {...this.props} />
          </Field>
          <Field
            display="inline"
            highlight={utils.getCurrentPropertyHighlight(this.props, 'font-style')}
            title={(
<span data-tip={$i18n.get({ id: 'styleStyle', dm: '样式' })}>
                <Icons name="style.font-style" size="medium" />
</span>
)}
          >
            <Style {...this.props} />
          </Field>
        </Field>
        <Field
          display="inline"
          highlight={utils.getCurrentPropertyHighlight(this.props, 'color')}
          title={(
<span data-tip={$i18n.get({ id: 'styleFontColor', dm: '字体颜色' })}>
              <Icons name="style.color" size="16px" />
</span>
)}
        >
          <Color {...this.props} />
        </Field>
        <Field display="plain" className="vs-flex-field">
          <Field
            display="inline"
            highlight={utils.getCurrentPropertyHighlight(this.props, 'font-size')}
            title={(
<span data-tip={$i18n.get({ id: 'styleSize', dm: '大小' })}>
                <Icons name="style.font-size" size="medium" />
</span>
)}
          >
            <Size {...this.props} />
          </Field>
          <Field
            display="inline"
            highlight={utils.getCurrentPropertyHighlight(this.props, 'line-height')}
            title={(
<span data-tip={$i18n.get({ id: 'styleRowHeight', dm: '行高' })}>
                <Icons name="style.line-height" size="medium" />
</span>
)}
          >
            <LineHeight {...this.props} />
          </Field>
        </Field>
        <Field display="plain" className="vs-flex-field">
          <Field
            display="inline"
            highlight={utils.getCurrentPropertyHighlight(this.props, 'text-align')}
            title={(
<span data-tip={$i18n.get({ id: 'styleAlign', dm: '对齐' })}>
                <Icons name="style.text-align" size="16px" />
</span>
)}
          >
            <TextAlign {...this.props} />
          </Field>
        </Field>
        <Field display="plain" className="vs-flex-field">
          <Field
            display="inline"
            highlight={utils.getCurrentPropertyHighlight(this.props, 'text-decoration')}
            title={(
<span data-tip={$i18n.get({ id: 'styleModification', dm: '修饰' })}>
                <Icons name="style.text-decoration" size="16px" />
</span>
)}
          >
            <TextDecoration {...this.props} />
          </Field>
        </Field>
      </div>
    );
  }
}

export default Typography;
