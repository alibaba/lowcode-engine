import { Component } from 'react';
import classNames from 'classnames';
import { Icon } from '@alifd/next';
import { Title, TitleContent } from '@ali/lowcode-globals';
import './index.less';
import { CommonField, PopupField } from './fields';

export interface FieldProps {
  className?: string;
  // span
  title?: TitleContent | null;
  type?: string;
}

export class Field extends Component<FieldProps> {
  render() {
    const { type, ...rest } = this.props;
    if (type === 'popup') {
      return <PopupField {...rest} />;
    }
    return <CommonField {...rest} />;
  }
}

export interface FieldGroupProps extends FieldProps {
  defaultCollapsed?: boolean;
  onExpandChange?: (collapsed: boolean) => void;
}

export class FieldGroup extends Component<FieldGroupProps> {
  state = {
    collapsed: this.props.defaultCollapsed,
  };

  toggleExpand() {
    const { onExpandChange } = this.props;
    const collapsed = !this.state.collapsed;
    this.setState({
      collapsed,
    });
    onExpandChange && onExpandChange(collapsed);
  }

  render() {
    const { className, children, title } = this.props;

    return (
      <div
        className={classNames('lc-field lc-accordion-field', className, {
          'lc-field-is-collapsed': this.state.collapsed,
        })}
      >
        {title && (
          <div className="lc-field-head" onClick={this.toggleExpand.bind(this)}>
            <div className="lc-field-title">
              <Title title={title} />
            </div>
            <Icon className="lc-field-icon" type="arrow-up" size="xs" />
          </div>
        )}
        <div className="lc-field-body">{children}</div>
      </div>
    );
  }
}
