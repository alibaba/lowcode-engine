import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Field from '@ali/ve-field';
import Icons from '@ali/ve-icons';
import Color from './color';
import Image from './image';
import Position from './position';
import Size from './size';
import Repeat from './repeat';
import Attachment from './attachment';
import utils from '../utils';
import $i18n from '../i18n/index';

class Background extends Component {
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
    const className = classNames('vs-style-background', this.props.className);
    const image = utils.getBackground(this.props, 'background-image').value;
    const imageUrl = utils.getImageUrl(image);

    return (
      <div className={className}>
        <Field
          display="inline"
          highlight={utils.getBackground(this.props, 'background-color').current != undefined}
          title={(
<span data-tip={$i18n.get({ id: 'styleFillColor', dm: '填充色' })}>
              <Icons name="style.fill" size="medium" />
</span>
)}
        >
          <Color {...this.props} />
        </Field>
        <Field
          display="inline"
          highlight={utils.getBackground(this.props, 'background-image').current != undefined}
          title={(
<span data-tip={$i18n.get({ id: 'styleImage', dm: '图片' })}>
              <Icons name="style.image" size="medium" />
</span>
)}
        >
          <Image {...this.props} />
        </Field>
        {imageUrl && imageUrl !== 'none' ? (
          <div className="vs-style-background-advanced">
            <Field
              display="caption"
              title={$i18n.get({ id: 'stylePositioning', dm: '定位' })}
              highlight={utils.getBackground(this.props, 'background-position').current != undefined}
            >
              <Position {...this.props} />
            </Field>
            <Field display="caption" title={$i18n.get({ id: 'styleSize', dm: '大小' })}>
              <Size
                highlight={utils.getBackground(this.props, 'background-size').current != undefined}
                {...this.props}
              />
            </Field>
            <Field
              display="plain"
              className="vs-flex-field"
              highlight={utils.getBackground(this.props, 'background-repeat').current != undefined}
            >
              <Field
                display="inline"
                title={(
<span data-tip={$i18n.get({ id: 'styleTile', dm: '平铺' })}>
                    <Icons name="style.repeat" size="16px" />
</span>
)}
              >
                <Repeat {...this.props} />
              </Field>
              <Field
                display="inline"
                title={(
<span data-tip={$i18n.get({ id: 'styleFixed', dm: '固定' })}>
                    <Icons name="style.fixed" size="medium" />
</span>
)}
              >
                <Attachment {...this.props} />
              </Field>
            </Field>
          </div>
        ) : null}
      </div>
    );
  }
}

Background.Color = Color;

Background.Image = Image;

export default Background;
