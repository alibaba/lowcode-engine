import './variableSetter.less';
import { Component } from 'react';

class Input extends Component {
  public props: {
    value: string;
    placeholder: string;
    onChange: (val: any) => any;
  };

  public state: { focused: boolean };

  constructor(props: object) {
    super(props);
    this.state = {
      focused: false,
    };
  }

  public componentDidMount() {
    this.adjustTextAreaHeight();
  }

  private domRef: HTMLTextAreaElement | null = null;

  public adjustTextAreaHeight() {
    if (!this.domRef) {
      return;
    }
    this.domRef.style.height = '1px';
    const calculatedHeight = this.domRef.scrollHeight;
    this.domRef.style.height = calculatedHeight >= 200 ? '200px' : `${calculatedHeight }px`;
  }

  public render() {
    const { value, placeholder, onChange } = this.props;
    return (
      <div
        className={`engine-variable-setter-input engine-input-control${this.state.focused ? ' engine-focused' : ''}`}
      >
        <textarea
          ref={(r) => {
            this.domRef = r;
          }}
          className="engine-input"
          value={value || ''}
          placeholder={placeholder || ''}
          onChange={(e) => {
            onChange(e.target.value || '');
          }}
          onBlur={() => this.setState({ focused: false })}
          onFocus={() => this.setState({ focused: true })}
          onKeyUp={this.adjustTextAreaHeight.bind(this)}
        />
      </div>
    );
  }
}

export default class VariableSetter extends Component<{
  prop: any;
  placeholder: string;
}> {
  public willDetach: () => any;

  public componentWillMount() {
    this.willDetach = this.props.prop.onValueChange(() => this.forceUpdate());
  }

  public componentWillUnmount() {
    if (this.willDetach) {
      this.willDetach();
    }
  }

  public render() {
    const { prop } = this.props;
    return (
      <Input
        value={prop.getVariableValue()}
        placeholder={this.props.placeholder}
        onChange={(val: string) => prop.setVariableValue(val)}
      />
    );
  }
}
