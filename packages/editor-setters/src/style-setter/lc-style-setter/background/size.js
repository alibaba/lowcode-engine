import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ChoiceControl from '@ali/ve-choice-control';
import NumberControl from '@ali/ve-number-control';
import Icons from '@ali/ve-icons';
import Field from '@ali/ve-field';
import utils from '../utils';
import $i18n from '../i18n/index';

const RE_SIZE_PRESETS = /^(cover|contain)$/i;

function getEffects(current, inherit) {
  const size = utils.isEmptyCssValue(current) || current === 'initial' ? inherit : current;

  if (utils.isEmptyCssValue(size) || RE_SIZE_PRESETS.test(size)) {
    return { x: 'auto', y: 'auto' };
  }

  const xy = size.split(/\s+/);

  return {
    x: utils.isEmptyCssValue(xy[0]) ? 'auto' : xy[0],
    y: utils.isEmptyCssValue(xy[1]) ? 'auto' : xy[1],
  };
}

function normalizeCurrent(current) {
  if (utils.isEmptyCssValue(current) || current === 'initial' || RE_SIZE_PRESETS.test(current)) {
    return {
      x: '',
      y: '',
    };
  }

  const xy = current.split(/\s+/);

  return {
    x: utils.isEmptyCssValue(xy[0]) ? '' : xy[0],
    y: utils.isEmptyCssValue(xy[1]) ? '' : xy[1],
  };
}

class SizeItem extends Component {
  static propTypes = {
    current: PropTypes.any,
    effects: PropTypes.any,
    onChange: PropTypes.func,
  };

  render() {
    return (
      <NumberControl
        value={this.props.current}
        placeholder={this.props.effects}
        min={0}
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
            type: 'auto',
            preset: true,
          },

          'em',
          'rem',
          'pt',
          'ex',
          'ch',
          'vh',
          'vw',
          'vmin',
          'vmax',
          'mm',
          'q',
          'cm',
          'in',
          'pc',
        ]}
        onChange={this.props.onChange}
      />
    );
  }
}

class Size extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleBackgrounSizeSetter';

  setSize(sizeX, sizeY) {
    let size;
    if (utils.isEmptyCssValue(sizeX) && utils.isEmptyCssValue(sizeY)) {
      size = '';
    } else if (RE_SIZE_PRESETS.test(sizeX) || utils.isEmptyCssValue(sizeY)) {
      size = sizeX;
    } else if (utils.isEmptyCssValue(sizeX) && !utils.isEmptyCssValue(sizeY)) {
      size = `auto ${sizeY}`;
    } else {
      size = `${sizeX} ${sizeY}`;
    }
    utils.setBackground(this.props, 'background-size', size);
  }

  render() {
    const className = classNames('vs-style-background-size', this.props.className);
    const { current, inherit, value } = utils.getBackground(this.props, 'background-size');

    const currentXY = normalizeCurrent(current);
    const effects = getEffects(current, inherit);

    return (
      <div className={className}>
        <ChoiceControl
          className="vs-style-bgsize-preset"
          options={[
            {
              title: <Icons name="style.cover" size="medium" />,
              value: 'cover',
            },
            {
              title: <Icons name="style.contain" size="medium" />,
              value: 'contain',
            },
          ]}
          value={value}
          onChange={val => this.setSize(val, null)}
          loose
        />

        <div className="vs-style-bgsize-custom">
          <Field
            display="inline"
            title={(
<span data-tip={$i18n.get({ id: 'styleWidth', dm: '宽度' })}>
                <Icons name="style.height" className="vs-style-rotate-90" size="14px" />
</span>
)}
          >
            <SizeItem
              current={currentXY.x}
              effects={effects.x}
              onChange={val => this.setSize(val, currentXY.y)}
            />
          </Field>
          <Field
            display="inline"
            title={(
<span data-tip={$i18n.get({ id: 'styleHeight', dm: '高度' })}>
                <Icons name="style.height" size="14px" />
</span>
)}
          >
            <SizeItem
              current={currentXY.y}
              effects={effects.y}
              onChange={val => this.setSize(currentXY.x, val)}
            />
          </Field>
        </div>
      </div>
    );
  }
}

export default Size;
