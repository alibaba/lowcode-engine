import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Field from '@ali/ve-field';
import Display from './display';
import Flex from './flex';
import FlexItem from './flexitem';
import PaddingMargin from './padding+margin';
import Width from './width';
import Height from './height';
import Position from './position'; // advanced
import utils from '../utils';
import $i18n from '../i18n/index';

function inFlexBox(node) {
  const nativeNode = node;
  if (!nativeNode) return false;
  const { parentNode } = nativeNode;
  if (!parentNode) return false;
  const display = window.getComputedStyle(parentNode).getPropertyValue('display');
  return /flex/.test(display);
}

function isFlexBox(props) {
  const display = utils.getPropertyValue(props, 'display').value;
  return /flex$/.test(display);
}

class Layout extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
  };

  static displayName = 'StyleLayoutSetter';

  componentWillMount() {

  }

  // shouldComponentUpdate() {
  //   return false;
  // }

  componentWillUnmount() {

  }

  render() {
    const className = classNames('vs-style-layout', this.props.className);
    const aFlexBox = isFlexBox(this.props);
    const aFlexItem = inFlexBox(this.props.node);

    return (
      <div className={className}>
        <Field
          display="inline"
          title={$i18n.get({ id: 'styleDisplay', dm: '显示' })}
          className="vs-field-display"
          compact
          highlight={utils.getCurrentPropertyHighlight(this.props, 'display')}
        >
          <Display {...this.props} />
        </Field>
        {aFlexBox && (
          <Field
            display="caption"
            className="vs-field-flex"
            title={$i18n.get({ id: 'styleFlexibleLayout', dm: '弹性布局' })}
          >
            <Flex {...this.props} />
          </Field>
        )}
        {/* todo: aFlexItem && <Field display="caption" title="Flex Item">
           <FlexItem />
          </Field> */}
        <Field display="plain">
          <PaddingMargin {...this.props} />
        </Field>
        <Field display="plain" className="vs-flex-field">
          <Field
            display="inline"
            title={$i18n.get({ id: 'styleWidth', dm: '宽' })}
            compact
            highlight={utils.getCurrentPropertyHighlight(this.props, 'width')}
          >
            <Width {...this.props} />
          </Field>
          <Field
            display="inline"
            title={$i18n.get({ id: 'styleHigh', dm: '高' })}
            compact
            highlight={utils.getCurrentPropertyHighlight(this.props, 'height')}
          >
            <Height {...this.props} />
          </Field>
        </Field>
        {/* todo:
          {advanced && <Field display="inline" title="Position">
           <Position />
          </Field>}
          */}
      </div>
    );
  }
}

export default Layout;
