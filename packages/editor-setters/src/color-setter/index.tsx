import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import { Input, Balloon } from '@alife/next';
import './index.scss';

interface Color {
  rgb: any;
  onChange: () => void;
}

export interface PluginProps {
  value: string;
  onChange: any;
}

export default class ColorPickerView extends PureComponent<PluginProps> {
  static display = 'ColorPicker';
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
  };
  static defaultProps = {
    onChange: () => {},
    value: '',
  };
  constructor(props: Readonly<{ value: string; defaultValue: string }>) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue,
    };
  }
  static getDerivedStateFromProps(props: { value: string }, state: { preValue: string }) {
    if (props.value != state.preValue) {
      return {
        preValue: props.value,
        value: props.value,
      };
    }
    return null;
  }
  onChangeComplete = (color: Color): void => {
    let value;
    if (color.rgb.a < 1) {
      const rgb = color.rgb;
      const rgba = [rgb.r, rgb.g, rgb.b, rgb.a];
      value = `rgba(${rgba.join(',')})`;
    } else {
      value = color.hex;
    }
    this.setState({
      value,
    });
    this.props.onChange && this.props.onChange(value);
  };
  onInputChange = (value: string): void => {
    if (/^[0-9a-zA-Z]{6}$/.test(value)) value = '#' + value;
    this.setState({
      value,
    });
    this.props.onChange && this.props.onChange(value);
  };
  render(): React.ReactNode {
    const { value, onChange, ...restProps } = this.props;
    const boxStyle = {
      backgroundColor: this.state.value,
    };
    const triggerNode = (
      <div className="lowcode-color-box">
        <div style={boxStyle} />
      </div>
    );
    const InnerBeforeNode = (
      <Balloon
        className={'lowcode-color-content'}
        trigger={triggerNode}
        needAdjust={true}
        triggerType="click"
        closable={false}
        alignEdge="edge"
        offset={[-3, -6]}
      >
        <SketchPicker onChangeComplete={this.onChangeComplete} color={this.state.value} arrowPointAtCenter={true} />
      </Balloon>
    );
    return (
      <Input {...restProps} innerBefore={InnerBeforeNode} onChange={this.onInputChange} value={this.state.value} />
    );
  }
}
