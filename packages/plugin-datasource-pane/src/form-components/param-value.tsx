import React, { PureComponent, ReactElement, FC } from 'react';
import { Button, Input, Radio, NumberPicker, Switch } from '@alifd/next';
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

export interface ParamValueProps {
  className: string;
  value: any;
  onChange?: () => void;
}

export interface ParamValueState {
  type: 'string' | 'number' | 'boolean' | '';
}

class ParamValueComp extends PureComponent<ParamValueProps, ParamValueState> {
  static isFieldComponent = true;

  state = {
    type: '',
  };

  constructor(props) {
    super(props);
    this.state.type = this.getTypeFromValue(this.props.value);
  }

  getTypeFromValue = (value) => {
    if (_isBoolean(value)) {
      return 'boolean';
    } else if (_isNumber(value)) {
      return 'number';
    } else if (_isPlainObject(value) && value.type === 'JSFunction') {
      return 'expression';
    }
    return 'string';
  };

  // @todo 需要再 bind 一次？
  handleChange = (value) => {
    this.props?.onChange(value);
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({
        value: this.props.value,
        type: this.getTypeFromValue(this.props.value),
      });
    }
  }

  handleTypeChange = (type) => {
    this.setState(({ value }) => {
      let nextValue = value || '';
      if (type === 'string') {
        nextValue = nextValue.toString();
      } else if (type === 'number') {
        nextValue = nextValue * 1;
      } else if (type === 'boolean') {
        nextValue = nextValue === 'true' || nextValue;
      } else if (type === 'expression') {
        nextValue = '';
      }
      return {
        value: nextValue,
        type,
      };
    });
  };

  render() {
    const { type } = this.state;
    const { value } = this.props;
    return (
      <div>
        {
          <RadioGroup shape="button" size="small" onChange={this.handleTypeChange}>
            <Radio value="string">字符串</Radio>
            <Radio value="boolean">布尔</Radio>
            <Radio value="number">数字</Radio>
            <Radio value="expression">表达式</Radio>
          </RadioGroup>
        }
        {type === 'string' && <Input onChange={this.handleChange.bind(this)} value={value} />}
        {type === 'boolean' && <Switch onChange={this.handleChange.bind(this)} checked={value} />}
        {type === 'number' && <NumberPicker onChange={this.handleChange.bind(this)} value={value} />}
        {type === 'expression' && <ExpressionSetter onChange={this.handleChange.bind(this)} value={value} />}
      </div>
    );
  }
}

export const ParamValue = connect()(ParamValueComp);
