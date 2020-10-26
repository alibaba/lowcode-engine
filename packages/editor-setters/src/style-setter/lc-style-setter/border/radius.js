import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Field from '@ali/ve-field';
import NumberControl from '@ali/ve-number-control';
import radiusParser from './radiusParser';
import utils from '../utils';
import $i18n from '../i18n/index';

class RadiusStyle extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'BorderRadiusStyleSetter';

  static transducer = utils.transducer;

  state = {
    // state variable to indicate which border have use selected
    // enum: border-top-left | border-top-right
    // border-bottom-left | border-bottom-right | border
    currentSelected: 'border',
  };

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  setValue(val, props) {
    if (this.state.currentSelected === 'border') {
      utils.setPropertyValue(props, 'border-radius', val);
    } else {
      utils.setPropertyValue(props, `${this.state.currentSelected}-radius`, val);
    }
  }

  changeSelectedRadius(type) {
    this.setState({ currentSelected: type });
  }

  render() {
    const className = classNames('vs-style-border-radius', this.props.className);
    const radius = radiusParser(this.props, `${this.state.currentSelected}-radius`);
    const radiusCurrent = radius.current;
    const radiusInherit = radius.inherit;

    return (
      <div className={className}>
        <div className="vs-style-border-setter-left-pane">
          <div className="vs-style-border-setter-row">
            <div
              onClick={this.changeSelectedRadius.bind(this, 'border-top-left')}
              className={
                this.state.currentSelected === 'border-top-left' ? 'vs-style-border-selected' : ''
              }
            >
              <span data-tip={$i18n.get({ id: 'styleUpperLeftCorner', dm: '左上角' })}>┏</span>
            </div>
            <div
              onClick={this.changeSelectedRadius.bind(this, 'border-bottom-left')}
              className={
                this.state.currentSelected === 'border-bottom-left'
                  ? 'vs-style-border-selected'
                  : ''
              }
            >
              <span data-tip={$i18n.get({ id: 'styleBottomRightCorner', dm: '右下角' })}>┗</span>
            </div>
          </div>
          <div className="vs-style-border-setter-row">
            <div
              onClick={this.changeSelectedRadius.bind(this, 'border')}
              className={this.state.currentSelected === 'border' ? 'vs-style-border-selected' : ''}
            >
              <span data-tip={$i18n.get({ id: 'styleAll', dm: '全部' })}>╋</span>
            </div>
          </div>
          <div className="vs-style-border-setter-row">
            <div
              onClick={this.changeSelectedRadius.bind(this, 'border-top-right')}
              className={
                this.state.currentSelected === 'border-top-right' ? 'vs-style-border-selected' : ''
              }
            >
              <span data-tip={$i18n.get({ id: 'styleUpperRightCorner', dm: '右上角' })}>┓</span>
            </div>
            <div
              onClick={this.changeSelectedRadius.bind(this, 'border-bottom-right')}
              className={
                this.state.currentSelected === 'border-bottom-right'
                  ? 'vs-style-border-selected'
                  : ''
              }
            >
              <span data-tip={$i18n.get({ id: 'styleBottomRightCorner', dm: '右下角' })}>┛</span>
            </div>
          </div>
        </div>
        <div className="vs-style-border-setter-right-pane">
          <Field
            display="inline"
            title={$i18n.get({ id: 'styleFillet', dm: '圆角' })}
            compact
            highlight={utils.getCurrentPropertyHighlight(this.props, 'border-radius')}
          >
            <NumberControl
              key={this.state.currentSelected}
              placeholder={radiusInherit}
              onChange={(val) => {
                this.setValue(val, this.props);
              }}
              value={radiusCurrent || null}
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
        </div>
      </div>
    );
  }
}

export default RadiusStyle;
