import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Button, Icon } from '@alifd/next';

import './index.scss';
import { timingSafeEqual } from 'crypto';

const SETTER_NAME = 'function-setter'

interface FunctionSetterProps {
  value: string;
  type: string;
  defaultValue: string;
  placeholder: string;
  hasClear: boolean;
  onChange: (icon: string | object) => undefined;
  icons: string[];
}
export default class FunctionSetter extends PureComponent<FunctionSetterProps, {}> {
  static defaultProps = {
    value: undefined,
    type: 'string',
    defaultValue: '',
    hasClear: true,
    placeholder: '请点击选择 Icon',
    onChange: (icon: string | object) => undefined,
  };

  private emitEventName = '';

  state = {
    firstLoad: true,
  };

  componentDidMount() {
    const { editor } = this.props.field;
    this.emitEventName = `${SETTER_NAME}-${this.props.field.id}`;
    editor.on(`${this.emitEventName}.bindEvent`, this.bindEvent)
  }

  bindEvent = (eventName) => {
    this.bindEventCallback(eventName);
  }


  componentWillUnmount() {
    const { editor } = this.props.field;
    editor.off(`${this.emitEventName}.bindEvent`, this.bindEvent)
  }


  bindFunction = () => {
    const { field, value } = this.props;
    field.editor.emit('eventBindDialog.openDialog', field.name, this.emitEventName);
  }

  removeFunctionBind = () => {
    const { field ,onChange} = this.props;
    field.parent.clearPropValue(field.name);
  }

  parseFunctionName = (functionString: String) => {
    // 因为函数格式是固定的，所以可以按照字符换去匹配获取函数名
    let funNameStr = functionString.split('.')[1];
    let endIndex = functionString.indexOf('(');
    return funNameStr.substr(0, endIndex);

  }

  /**
   * 渲染按钮(初始状态)
   */
  renderButton = () => {
    return <Button type="primary" onClick={() => this.bindFunction()}>绑定函数</Button>
  }

  focusFunctionName = (functionName) => {
    const { editor } = this.props.field;

    editor.get('skeleton').getPanel('sourceEditor').show();

    setTimeout(() => {
      editor.emit('sourceEditor.focusByFunction', {
        functionName
      })
    }, 300)
  }

  /**
   * 渲染绑定函数
   */
  renderBindFunction = () => {
    const { value } = this.props;
    // 解析函数名
    let functionName = this.parseFunctionName(value.value);
    // let functionName = 'onClick';
    return <div className="function-container">
      <img className="funtion-icon" src="https://gw.alicdn.com/tfs/TB1os6KRFT7gK0jSZFpXXaTkpXa-200-200.png"></img>
      <span className="function-name" onClick={() => this.focusFunctionName(functionName)}>{functionName}</span>
      <Icon type="set" size="medium" className="funtion-operate-icon" onClick={this.bindFunction} />
      <Icon type="ashbin" size="medium" className="funtion-operate-icon" onClick={this.removeFunctionBind} />
    </div>
  }


  bindEventCallback = (eventName: String) => {
    const { onChange } = this.props;
    onChange({
      type: 'JSFunction',
      value: `function(){ this.${eventName}() }`,
    });
  }

  render() {
    const { value } = this.props;
    return <div className="lc-function-setter">
      {
        value ? this.renderBindFunction() : this.renderButton()
      }
    </div>;
  }
}
