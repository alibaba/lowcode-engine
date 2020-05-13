import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'omit.js';
import Checkbox, { CheckboxChangeEvent } from './Checkbox';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';

export type CheckboxValueType = string | number | boolean;

export interface CheckboxOptionType {
  label: React.ReactNode;
  value: CheckboxValueType;
  style?: React.CSSProperties;
  disabled?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
}

export interface AbstractCheckboxGroupProps {
  prefixCls?: string;
  className?: string;
  options?: Array<CheckboxOptionType | string>;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export interface CheckboxGroupProps extends AbstractCheckboxGroupProps {
  name?: string;
  defaultValue?: Array<CheckboxValueType>;
  value?: Array<CheckboxValueType>;
  onChange?: (checkedValue: Array<CheckboxValueType>) => void;
}

export interface CheckboxGroupState {
  value: CheckboxValueType[];
  registeredValues: CheckboxValueType[];
}

export interface CheckboxGroupContext {
  toggleOption?: (option: CheckboxOptionType) => void;
  value?: any;
  disabled?: boolean;
}

export const GroupContext = React.createContext<CheckboxGroupContext | null>(null);

class CheckboxGroup extends React.PureComponent<CheckboxGroupProps, CheckboxGroupState> {
  static defaultProps = {
    options: [],
  };

  static propTypes = {
    defaultValue: PropTypes.array,
    value: PropTypes.array,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func,
  };

  static getDerivedStateFromProps(nextProps: CheckboxGroupProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value || [],
      };
    }
    return null;
  }

  constructor(props: CheckboxGroupProps) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue || [],
      registeredValues: [],
    };
  }

  getOptions() {
    const { options } = this.props;
    // https://github.com/Microsoft/TypeScript/issues/7960
    return (options as Array<CheckboxOptionType>).map(option => {
      if (typeof option === 'string') {
        return {
          label: option,
          value: option,
        } as CheckboxOptionType;
      }
      return option;
    });
  }

  cancelValue = (value: string) => {
    this.setState(({ registeredValues }) => ({
      registeredValues: registeredValues.filter(val => val !== value),
    }));
  };

  registerValue = (value: string) => {
    this.setState(({ registeredValues }) => ({
      registeredValues: [...registeredValues, value],
    }));
  };

  toggleOption = (option: CheckboxOptionType) => {
    const { registeredValues } = this.state;
    const optionIndex = this.state.value.indexOf(option.value);
    const value = [...this.state.value];
    if (optionIndex === -1) {
      value.push(option.value);
    } else {
      value.splice(optionIndex, 1);
    }
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    const { onChange } = this.props;
    if (onChange) {
      const options = this.getOptions();
      onChange(
        value
          .filter(val => registeredValues.indexOf(val) !== -1)
          .sort((a, b) => {
            const indexA = options.findIndex(opt => opt.value === a);
            const indexB = options.findIndex(opt => opt.value === b);
            return indexA - indexB;
          }),
      );
    }
  };

  renderGroup = ({ getPrefixCls, direction }: ConfigConsumerProps) => {
    const { props, state } = this;
    const { prefixCls: customizePrefixCls, className, style, options, ...restProps } = props;
    const prefixCls = getPrefixCls('checkbox', customizePrefixCls);
    const groupPrefixCls = `${prefixCls}-group`;

    const domProps = omit(restProps, ['children', 'defaultValue', 'value', 'onChange', 'disabled']);

    let { children } = props;
    if (options && options.length > 0) {
      children = this.getOptions().map(option => (
        <Checkbox
          prefixCls={prefixCls}
          key={option.value.toString()}
          disabled={'disabled' in option ? option.disabled : props.disabled}
          value={option.value}
          checked={state.value.indexOf(option.value) !== -1}
          onChange={option.onChange}
          className={`${groupPrefixCls}-item`}
          style={option.style}
        >
          {option.label}
        </Checkbox>
      ));
    }

    const context = {
      toggleOption: this.toggleOption,
      value: this.state.value,
      disabled: this.props.disabled,
      name: this.props.name,

      // https://github.com/ant-design/ant-design/issues/16376
      registerValue: this.registerValue,
      cancelValue: this.cancelValue,
    };

    const classString = classNames(groupPrefixCls, className, {
      [`${groupPrefixCls}-rtl`]: direction === 'rtl',
    });
    return (
      <div className={classString} style={style} {...domProps}>
        <GroupContext.Provider value={context}>{children}</GroupContext.Provider>
      </div>
    );
  };

  render() {
    return <ConfigConsumer>{this.renderGroup}</ConfigConsumer>;
  }
}

export default CheckboxGroup;
