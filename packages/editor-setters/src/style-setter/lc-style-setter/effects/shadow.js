import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Field from '@ali/ve-field';
import Icons from '@ali/ve-icons';
import NumberControl from '@ali/ve-number-control';
import ColorControl from '@ali/ve-color-control';

import utils from '../utils';
import $i18n from '../i18n/index';

const generateShadow = (c = 'rgba(0,0,0,0)', x = '0', y = '0', b = '0', s = '0') => `${c} ${x} ${y} ${b} ${s}`;

class Shadow extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleShadowSetter';

  static transducer = utils.transducer;

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const className = classNames('vs-style-shadow', this.props.className);
    const shadow = utils.getPropertyValue(this.props, 'box-shadow').value;

    let c = ''; // color
    let x = ''; // x
    let y = ''; // y
    let b = ''; // blur
    let s = ''; // spread

    // @todo shadow parser 比较复杂考虑情况比较多，这里有明显的 Bug
    // 由于时间问题，这里先留坑，满足可用性，后面有时间再来修复一下。
    if (shadow !== 'none' && !!shadow && typeof shadow === 'string') {
      const res = shadow.split(' ');
      s = res.pop();
      b = res.pop();
      y = res.pop();
      x = res.pop();
      c = res.join(' ');
    }

    return (
      <div>
        <div className="ve-style-box-shadow-select">
          <Field
            display="inline"
            highlight={utils.getCurrentPropertyHighlight(this.props, 'box-shadow')}
            title={(
<span data-tip={$i18n.get({ id: 'styleColour', dm: '颜色' })}>
                <Icons name="style.fill" size="medium" />
</span>
)}
          >
            <ColorControl
              value={c}
              placeholder="#000"
              onChange={(val) => {
                utils.setPropertyValue(this.props, 'box-shadow', generateShadow(val, x, y, b, s));
              }}
            />
          </Field>
        </div>
        <div className="ve-style-box-shadow-select">
          <Field
            display="inline"
            highlight={utils.getCurrentPropertyHighlight(this.props, 'box-shadow')}
            title="X"
          >
            <NumberControl
              className={className}
              value={x}
              placeholder="0"
              onChange={(val) => {
                utils.setPropertyValue(this.props, 'box-shadow', generateShadow(c, val, y, b, s));
              }}
              min={0}
              max={100}
              units={[
                {
                  type: 'px',
                  list: true,
                },
                {
                  type: '%',
                  list: true,
                },
                {
                  type: 'em',
                  list: true,
                },
              ]}
            />
          </Field>
          <Field
            display="inline"
            highlight={utils.getCurrentPropertyHighlight(this.props, 'box-shadow')}
            title="Y"
          >
            <NumberControl
              className={className}
              placeholder="0"
              value={y}
              onChange={(val) => {
                utils.setPropertyValue(this.props, 'box-shadow', generateShadow(c, x, val, b, s));
              }}
              min={0}
              max={100}
              units={[
                {
                  type: 'px',
                  list: true,
                },
                {
                  type: '%',
                  list: true,
                },
                {
                  type: 'em',
                  list: true,
                },
              ]}
            />
          </Field>
        </div>
        <div className="ve-style-box-shadow-select">
          <Field
            display="inline"
            highlight={utils.getCurrentPropertyHighlight(this.props, 'box-shadow')}
            title={(
<span data-tip="blur">
                <Icons name="style.blur" size="medium" />
</span>
)}
          >
            <NumberControl
              className={className}
              placeholder="0"
              value={b}
              onChange={(val) => {
                utils.setPropertyValue(this.props, 'box-shadow', generateShadow(c, x, y, val, s));
              }}
              min={0}
              max={100}
              units={[
                {
                  type: 'px',
                  list: true,
                },
                {
                  type: '%',
                  list: true,
                },
                {
                  type: 'em',
                  list: true,
                },
              ]}
            />
          </Field>
          <Field
            display="inline"
            highlight={utils.getCurrentPropertyHighlight(this.props, 'box-shadow')}
            title={(
<span data-tip="spread">
                <Icons name="style.layer" size="small" />
</span>
)}
          >
            <NumberControl
              value={s}
              placeholder="0"
              className={className}
              onChange={(val) => {
                utils.setPropertyValue(this.props, 'box-shadow', generateShadow(c, x, y, b, val));
              }}
              min={0}
              max={100}
              units={[
                {
                  type: 'px',
                  list: true,
                },
                {
                  type: '%',
                  list: true,
                },
                {
                  type: 'em',
                  list: true,
                },
              ]}
            />
          </Field>
        </div>
      </div>
    );
  }
}

export default Shadow;
