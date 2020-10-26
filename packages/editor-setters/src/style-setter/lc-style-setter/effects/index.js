import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Icons from '@ali/ve-icons';
import Field from '@ali/ve-field';
import Opacity from './opacity';
import Cursor from './cursor';
import Shadow from './shadow';

import utils from '../utils';
import $i18n from '../i18n/index';

class Effects extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleEffectsSetter';

  static transducer = utils.transducer;

  componentWillMount() {

  }

  // shouldComponentUpdate() {
  //   return false;
  // }

  componentWillUnmount() {

  }

  render() {
    const className = classNames('vs-style-effects', this.props.className);

    return (
      <div className={className}>
        <Field
          display="inline"
          highlight={utils.getCurrentPropertyHighlight(this.props, 'opacity')}
          title={(
<span data-tip={$i18n.get({ id: 'styleTransparency', dm: '透明度' })}>
              <Icons name="style.opacity" size="medium" />
</span>
)}
        >
          <Opacity {...this.props} />
        </Field>
        <Field
          display="inline"
          highlight={utils.getCurrentPropertyHighlight(this.props, 'cursor')}
          title={(
<span data-tip={$i18n.get({ id: 'styleMouseGesture', dm: '鼠标手势' })}>
              <Icons name="style.cursor" size="small" />
</span>
)}
        >
          <Cursor {...this.props} />
        </Field>
        <Shadow {...this.props} />
      </div>
    );
  }
}

export default Effects;
