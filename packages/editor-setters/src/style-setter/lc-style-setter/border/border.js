import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Field from '@ali/ve-field';
import SelectControl from '@ali/ve-select-control';
import NumberControl from '@ali/ve-number-control';
import ColorControl from '@ali/ve-color-control';
import borderParser from './borderParser';
import utils from '../utils';
import $i18n from '../i18n/index';

const BORDER_STYLES = {
  none: $i18n.get({ id: 'styleNo', dm: '无' }),
  solid: $i18n.get({ id: 'styleSolidLine', dm: '实线' }),
  dotted: $i18n.get({ id: 'styleDottedLine', dm: '点线' }),
  dashed: $i18n.get({ id: 'styleDottedLine.1', dm: '虚线' }),
};

const borderStyles = Object.keys(BORDER_STYLES).map(i => ({
  text: BORDER_STYLES[i],
  value: i,
}));

class BorderStyle extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleBorderSetter';

  static transducer = utils.transducer;

  state = {
    // state variable to indicate which border have use selected
    // enum: border-left | border-right | border-top | border-bottom | border
    currentSelected: 'border',
  };

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  setValue(type, val, props) {
    if (this.state.currentSelected === 'border') {
      utils.setPropertyValue(props, `border-${type}`, val);
    } else {
      utils.setPropertyValue(props, `${this.state.currentSelected}-${type}`, val);
    }
  }

  changeSelectedBorder(type) {
    this.setState({ currentSelected: type });
  }

  render() {
    const className = classNames('vs-style-border-style', this.props.className);
    const border = borderParser(this.props, this.state.currentSelected);
    const { current, inherit } = border;
    const borderWidth = current.width;
    const borderColor = current.color;
    const borderStyle = current.style;

    const inheritWidth = inherit.width || '0px';
    const inheritColor = inherit.color || '#000';
    const inheritStyle = inherit.style || 'none';

    return (
      <div className={className}>
        <div className="vs-style-border-setter-left-pane">
          <div className="vs-style-border-setter-row">
            <div
              onClick={this.changeSelectedBorder.bind(this, 'border-left')}
              className={
                this.state.currentSelected === 'border-left' ? 'vs-style-border-selected' : ''
              }
            >
              <span data-tip={$i18n.get({ id: 'styleLeftBorder', dm: '左边框' })}>┣</span>
            </div>
          </div>
          <div className="vs-style-border-setter-row">
            <div
              onClick={this.changeSelectedBorder.bind(this, 'border-top')}
              className={
                this.state.currentSelected === 'border-top' ? 'vs-style-border-selected' : ''
              }
            >
              <span data-tip={$i18n.get({ id: 'styleTopBorder', dm: '上边框' })}>┳</span>
            </div>
            <div
              onClick={this.changeSelectedBorder.bind(this, 'border')}
              className={this.state.currentSelected === 'border' ? 'vs-style-border-selected' : ''}
            >
              <span data-tip={$i18n.get({ id: 'styleAll', dm: '全部' })}>╋</span>
            </div>
            <div
              onClick={this.changeSelectedBorder.bind(this, 'border-bottom')}
              className={
                this.state.currentSelected === 'border-bottom' ? 'vs-style-border-selected' : ''
              }
            >
              <span data-tip={$i18n.get({ id: 'styleBottomBorder', dm: '下边框' })}>┻</span>
            </div>
          </div>
          <div className="vs-style-border-setter-row">
            <div
              onClick={this.changeSelectedBorder.bind(this, 'border-right')}
              className={
                this.state.currentSelected === 'border-right' ? 'vs-style-border-selected' : ''
              }
            >
              <span data-tip={$i18n.get({ id: 'styleRightBorder', dm: '右边框' })}>┫</span>
            </div>
          </div>
        </div>
        <div className="vs-style-border-setter-right-pane">
          <Field
            display="inline"
            title={$i18n.get({ id: 'styleLinear', dm: '线形' })}
            compact
            highlight={borderStyle}
          >
            <SelectControl
              key={this.state.currentSelected}
              value={borderStyle || inheritStyle}
              onChange={(val) => {
                this.setValue('style', val, this.props);
              }}
              options={borderStyles}
            />
          </Field>
          <Field
            display="inline"
            title={$i18n.get({ id: 'styleWidth', dm: '宽度' })}
            compact
            highlight={borderWidth}
          >
            <NumberControl
              key={this.state.currentSelected}
              placeholder={inheritWidth}
              value={borderWidth}
              onChange={(val) => {
                this.setValue('width', val, this.props);
              }}
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
                  type: 'em',
                  list: true,
                },
              ]}
            />
          </Field>
          <Field
            display="inline"
            title={$i18n.get({ id: 'styleColour', dm: '颜色' })}
            compact
            highlight={borderColor}
          >
            <ColorControl
              key={this.state.currentSelected}
              placeholder={inheritColor}
              value={borderColor}
              onChange={(val) => {
                this.setValue('color', val, this.props);
              }}
            />
          </Field>
        </div>
      </div>
    );
  }
}

export default BorderStyle;
