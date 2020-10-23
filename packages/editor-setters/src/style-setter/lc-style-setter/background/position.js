import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Field from '@ali/ve-field';
import Icons from '@ali/ve-icons';
import NumberControl from '@ali/ve-number-control';

import utils from '../utils';
import $i18n from '../i18n/index';

function isZero(v) {
  return v === 0 || /^0(em|ex|ch|rem|vh|vw|vmin|vmax|px|mm|q|cm|in|pt|pc|%)?$/.test(v);
}

const offsetPresets = [
  {
    title: 'left top',
    value: { X: '0%', Y: '0%' },
    test({ x, y }) {
      return (isZero(x) || x === 'left') && (isZero(y) || y === 'top');
    },
  },
  {
    title: 'center top',
    value: { X: '50%', Y: '0%' },
    test({ x, y }) {
      return (x === '50%' || x === 'center') && (isZero(y) || y === 'top');
    },
  },
  {
    title: 'right top',
    value: { X: '100%', Y: '0%' },
    test({ x, y }) {
      return (x === '100%' || x === 'right') && (isZero(y) || y === 'top');
    },
  },
  {
    title: 'left center',
    value: { X: '0%', Y: '50%' },
    test({ x, y }) {
      return (isZero(x) || x === 'left') && (y === '50%' || y === 'center');
    },
  },
  {
    title: 'center',
    value: { X: '50%', Y: '50%' },
    test({ x, y }) {
      return (x === '50%' || x === 'center') && (y === '50%' || y === 'center');
    },
  },
  {
    title: 'right center',
    value: { X: '100%', Y: '50%' },
    test({ x, y }) {
      return (x === '100%' || x === 'right') && (y === '50%' || y === 'center');
    },
  },
  {
    title: 'left bottom',
    value: { X: '0%', Y: '100%' },
    test({ x, y }) {
      return (isZero(x) || x === 'left') && (y === '100%' || y === 'bottom');
    },
  },
  {
    title: 'center bottom',
    value: { X: '50%', Y: '100%' },
    test({ x, y }) {
      return (x === '50%' || x === 'center') && (y === '100%' || y === 'bottom');
    },
  },
  {
    title: 'right bottom',
    value: { X: '100%', Y: '100%' },
    test({ x, y }) {
      return (x === '100%' || x === 'right') && (y === '100%' || y === 'bottom');
    },
  },
];

class Presets extends Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
  };

  render() {
    const { value, onChange } = this.props;

    const presets = offsetPresets.map((item, index) => {
      const className = classNames('vs-preset-item', `vs-preset-${item.title.replace(' ', '-')}`, {
        've-active': item.test(value),
      });

      return (
        <span
          key={index}
          className={className}
          data-tip={item.title}
          onClick={() => onChange(item.value)}
        >
          <Icons name={`style.${item.title === 'center' ? 'center' : 'dir'}`} size="12px" />
        </span>
      );
    });

    return <div className="vs-style-position-preset">{presets}</div>;
  }
}

const RE_PERCENT = /^\d*(\.\d+)?%$/;

function isPercent(val) {
  return RE_PERCENT.test(val);
}

function normalizePosition(pos, x, y) {
  if (utils.isEmptyCssValue(pos) || pos === 'initial') {
    return {
      x,
      y,
      effects: {
        x: utils.notEmptyValue(x, '0%'),
        y: utils.notEmptyValue(y, '0%'),
      },
    };
  }

  const xy = pos.split(/\s+/);
  if (utils.isEmptyCssValue(x)) {
    x = xy[0];
  }
  if (utils.isEmptyCssValue(y)) {
    y = xy[1];
  }
  const effects = { x, y };
  const ret = { x, y, effects };

  if (utils.isEmptyCssValue(y)) {
    if (isPercent(x)) {
      effects.y = '50%';
    } else if (x === 'left' || x === 'right' || x === 'center') {
      effects.y = 'center';
    } else if (x === 'top' || x === 'bottom') {
      effects.y = x;
      effects.x = 'center';
      ret.y = x;
      ret.x = '';
    }
  } else if (x === 'top' || x === 'bottom' || y === 'left' || y === 'right') {
    effects.y = x;
    effects.x = y;
    ret.y = x;
    ret.x = y;
  }

  return ret;
}

class Offset extends Component {
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
        units={[
          {
            type: '%',
            list: true,
          },
          {
            type: 'left',
            preset: true,
          },
          {
            type: 'right',
            preset: true,
          },
          {
            type: 'center',
            preset: true,
          },
          {
            type: 'top',
            preset: true,
          },
          {
            type: 'bottom',
            preset: true,
          },

          'px',
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

class Position extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleBackgrounPositionSetter';

  setPosition(x, y) {
    if (utils.isEmptyCssValue(x) || utils.isEmptyCssValue(y)) {
      utils.setBackground(this.props, 'background-position', null);
      utils.setPropertyValue(this.props, 'background-position-x', x);
      utils.setPropertyValue(this.props, 'background-position-y', y);
    } else {
      utils.setBackground(this.props, 'background-position', `${x} ${y}`);
      utils.setPropertyValue(this.props, 'background-position-x', null);
      utils.setPropertyValue(this.props, 'background-position-y', null);
    }
  }

  render() {
    const className = classNames('vs-style-background-position', this.props.className);
    const { current, inherit } = utils.getBackground(this.props, 'background-position');
    const x = utils.getPropertyValue(this.props, 'background-position-x');
    const y = utils.getPropertyValue(this.props, 'background-position-y');

    const currentXY = normalizePosition(current, x.current, y.current);
    const inheritXY = normalizePosition(inherit, x.inherit, y.inherit);

    const effects = {
      x: utils.notEmptyValue(currentXY.effects.x, inheritXY.effects.x),
      y: utils.notEmptyValue(currentXY.effects.y, inheritXY.effects.y),
    };

    return (
      <div className={className}>
        <Presets value={effects} onChange={({ X, Y }) => this.setPosition(X, Y)} />

        <div className="vs-style-position-custom">
          <Field
            display="inline"
            title={(
<span data-tip={$i18n.get({ id: 'styleLateralOffset', dm: '横向偏移' })}>
                <Icons name="style.offset" className="vs-style-rotate-90-r" size="14px" />
</span>
)}
          >
            <Offset
              current={currentXY.x}
              effects={effects.x}
              onChange={value => this.setPosition(value, currentXY.y)}
            />
          </Field>
          <Field
            display="inline"
            title={(
<span data-tip={$i18n.get({ id: 'styleVerticalOffset', dm: '纵向偏移' })}>
                <Icons name="style.offset" size="14px" />
</span>
)}
          >
            <Offset
              current={currentXY.y}
              effects={effects.y}
              onChange={value => this.setPosition(currentXY.x, value)}
            />
          </Field>
        </div>
      </div>
    );
  }
}

export default Position;
