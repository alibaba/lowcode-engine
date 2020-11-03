import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ImageControl from '@ali/ve-image-control';
import utils from '../utils';
import $i18n from '../i18n/index';

class Image extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleBackgroundImageSetter';

  static transducer = utils.transducer;

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  setImage(image) {
    if (image) {
      image = image.trim();
    }
    if (image && image !== 'none') {
      image = `url("${image}")`;
    }
    utils.setBackground(this.props, 'background-image', image);
  }

  render() {
    const className = classNames('vs-style-background-image', this.props.className);
    const { current, inherit } = utils.getBackground(this.props, 'background-image');
    const url = utils.getImageUrl(current);

    return (
      <ImageControl
        className={className}
        value={url}
        showPanel={false}
        placeholder={
          current && !url
            ? $i18n.get({ id: 'styleUnsupportedImage', dm: '暂未支持的图片' })
            : inherit || $i18n.get({ id: 'stylePleaseEnterAnAddress', dm: '请输入地址或粘贴上传' })
        }
        onChange={value => this.setImage(value)}
      />
    );
  }
}

export default Image;
