import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Button } from '@alifd/next';

import './index.scss';

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

  state = {
    firstLoad: true,
  };

  componentDidMount() {
    const {editor} = this.props.field;
    editor.on(`${SETTER_NAME}.bindEvent`,(eventName)=>{
      this.bindEventCallback(eventName);
    })

  }

  bindFunction = () =>{
    const {field,value} = this.props;
    field.editor.emit('eventBindDialog.openDialog',field.name,SETTER_NAME);
  }

  bindEventCallback = (eventName) => {
    const {onChange} = this.props;
    onChange({
      type: 'JSFunction',
      value: `function(){ this.${eventName}() }`,
    });
  }

  render() {
    const { icons, value, defaultValue, onChange, placeholder, hasClear, type } = this.props;
    const { firstLoad } = this.state;

    return <div className="lc-icon-setter"><Button type="primary" onClick={()=>this.bindFunction()}>绑定函数</Button></div>;
  }
}
