import { Component } from 'react';
import classNames from 'classnames';
import { Icon } from '@alifd/next';
import { Title, TitleContent } from '@ali/lowcode-globals';
import './index.less';

export interface FieldProps {
  className?: string;
  // span
  title?: TitleContent | null;
}

export class Field extends Component<FieldProps> {
  private shell: HTMLDivElement | null = null;

  private checkIsBlockField() {
    if (this.shell) {
      const setter = this.shell.lastElementChild!.firstElementChild;
      if (setter && setter.classList.contains('lc-block-setter')) {
        this.shell.classList.add('lc-block-field');
        this.shell.classList.remove('lc-inline-field');
      } else {
        this.shell.classList.remove('lc-block-field');
        this.shell.classList.add('lc-inline-field');
      }
    }
  }
  componentDidUpdate() {
    this.checkIsBlockField();
  }
  componentDidMount() {
    this.checkIsBlockField();
  }

  render() {
    const { className, children, title } = this.props;

    return (
      <div ref={shell => (this.shell = shell)} className={classNames('lc-field lc-inline-field', className)}>
        {title && (
          <div className="lc-field-head">
            <div className="lc-field-title">
              <Title title={title} />
            </div>
          </div>
        )}
        <div className="lc-field-body">{children}</div>
      </div>
    );
  }
}

export interface FieldGroupProps extends FieldProps {
  defaultCollapsed?: boolean;
  // gap?: number;
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
