/**
 * 表达式控件，在原类型基础上切换成表达式模式
 */
/* import React, { PureComponent, ReactElement, FC } from 'react';
import { Button, Input, Radio, NumberPicker, Switch, Icon } from '@alifd/next';
import { ArrayTable } from '@formily/next-components';
import { connect } from '@formily/react-schema-renderer';
import _isPlainObject from 'lodash/isPlainObject';
import _isArray from 'lodash/isArray';
import _isNumber from 'lodash/isNumber';
import _isString from 'lodash/isString';
import _isBoolean from 'lodash/isBoolean';
import _get from 'lodash/get';
import _tap from 'lodash/tap';
import { ExpressionSetter } from '@ali/lowcode-editor-setters';

const { Group: RadioGroup } = Radio;

export interface ExpressionProps {
  className: string;
  value: any;
  onChange?: () => void;
  type: 'string' | 'number' | 'boolan' | 'array';
}

export interface ExpressionState {
  useExpression: false;
}

class ExpressionComp extends PureComponent<ExpressionProps, ExpressionState> {
  static isFieldComponent = true;

  state = {
    useExpression: '',
  };

  constructor(props) {
    super(props);
    this.state.useExpression = this.isUseExpression(this.props.value);
    this.handleChange = this.handleChange;
  }

  isUseExpression = (value: any) => {
    if (_isPlainObject(value) && value.type === 'JSFunction') {
      return true;
    }
    return false;
  };

  // @todo 需要再 bind 一次？
  handleChange = (value) => {
    this.props?.onChange(value);
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({
        value: this.props.value,
        useExpression: this.isUseExpression(this.props.value),
      });
    }
  }

  handleUseExpressionChange = (useExpression) => {
    this.setState(({ value }) => {
      let nextValue = value || '';
      if (useExpression) {
        nextValue = {
          type: 'JSFunction',
          value: ''
        };
      } else  {
        nextVaule = null;
      }
      return {
        value: nextValue,
        useExpression,
      };
    });
  };

  renderOriginal = () => {
    const { value, type } = this.props;

    if (type === 'string') {
      return <Input onChange={this.handleChange} value={value} />;
    } else if (type === 'boolean') {
      return <Switch onChange={this.handleChange} checked={value} />;
    } else if (type === 'number') {
      return <NumberPicker onChange={this.handleChange} value={value} />;
    } else if (type === 'array') {
      return <ArrayTable onChange={this.handleChange} value={value} />;
    }
    return null;
  };

  renderExpression = () => {
    const { value, type } = this.props;

    // @todo 传入上下文才有智能提示
    return (
      <ExpressionSetter value={value} onChange={this.handleChange}  />
    );
  };

  render() {
    const { useExpression } = this.state;
    return (
      <div>
        {!useExpression && this.renderOriginal()}
        {useExpression && this.renderExpression()}
        <Button onClick={this.handleUseExpressionChange}><Icon type="edit" /></Button>
      </div>
    );
  }
}

export const Expression = connect({
  getProps: (componentProps, fieldProps) => {
    debugger;
  }
})(ExpressionComp); */
