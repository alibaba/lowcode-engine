import { Component } from 'react';
import classNames from 'classnames';
import { Icon } from '@alifd/next';
import { Title, TitleContent } from '@ali/lowcode-globals';
import { PopupPipe, PopupContext } from '../popup';
import './index.less';

export interface FieldProps {
  className?: string;
  title?: TitleContent | null;
  defaultDisplay?: 'accordion' | 'inline' | 'block';
  collapsed?: boolean;
  onExpandChange?: (expandState: boolean) => void;
}

export class Field extends Component<FieldProps> {
  state = {
    collapsed: this.props.collapsed,
    display: this.props.defaultDisplay || 'inline',
  };

  private toggleExpand = () => {
    const { onExpandChange } = this.props;
    const collapsed = !this.state.collapsed;
    this.setState({
      collapsed,
    });
    onExpandChange && onExpandChange(!collapsed);
  };
  private body: HTMLDivElement | null = null;
  private dispose?: () => void;
  private deployBlockTesting() {
    if (this.dispose) {
      this.dispose();
    }
    const body = this.body;
    if (!body) {
      return;
    }
    const check = () => {
      const setter = body.firstElementChild;
      if (setter && setter.classList.contains('lc-block-setter')) {
        this.setState({
          display: 'block',
        });
      } else {
        this.setState({
          display: 'inline',
        });
      }
    };
    const observer = new MutationObserver(check);
    check();
    observer.observe(body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });
    this.dispose = () => observer.disconnect();
  }
  componentDidMount() {
    const { defaultDisplay } = this.props;
    if (!defaultDisplay || defaultDisplay === 'inline') {
      this.deployBlockTesting();
    }
  }
  componentWillUnmount() {
    if (this.dispose) {
      this.dispose();
    }
  }

  render() {
    const { className, children, title } = this.props;
    const { display, collapsed } = this.state;
    const isAccordion = display === 'accordion';
    return (
      <div
        className={classNames(`lc-field lc-${display}-field`, className, {
          'lc-field-is-collapsed': isAccordion && collapsed,
        })}
      >
        <div className="lc-field-head" onClick={isAccordion ? this.toggleExpand : undefined}>
          <div className="lc-field-title">
            <Title title={title || ''} />
          </div>
          {isAccordion && <Icon className="lc-field-icon" type="arrow-up" size="xs" />}
        </div>
        <div key="body" ref={(shell) => (this.body = shell)} className="lc-field-body">
          {children}
        </div>
      </div>
    );
  }
}

export interface PopupFieldProps extends FieldProps {
  width?: number;
}

export class PopupField extends Component<PopupFieldProps> {
  static contextType = PopupContext;
  private pipe: any;

  static defaultProps: PopupFieldProps = {
    width: 300,
  };

  render() {
    const { className, children, title, width } = this.props;
    if (!this.pipe) {
      this.pipe = (this.context as PopupPipe).create({ width });
    }

    const titleElement = title && (
      <div className="lc-field-title">
        <Title title={title} />
      </div>
    );

    this.pipe.send(<div className="lc-field-body">{children}</div>, titleElement);

    return (
      <div className={classNames('lc-field lc-popup-field', className)}>
        {title && (
          <div
            className="lc-field-head"
            onClick={(e) => {
              this.pipe.show((e as any).target);
            }}
          >
            <div className="lc-field-title">
              <Title title={title} />
            </div>
            <Icon className="lc-field-icon" type="arrow-left" size="xs" />
          </div>
        )}
      </div>
    );
  }
}

export interface EntryFieldProps extends FieldProps {
  stageName?: string;
}

export class EntryField extends Component<EntryFieldProps> {
  render() {
    const { stageName, title, className } = this.props;
    const classNameList = classNames('engine-setting-field', 'engine-entry-field', className);
    const fieldProps: any = {};

    if (stageName) {
      // 为 stage 切换奠定基础
      fieldProps['data-stage-target'] = stageName;
    }

    const innerElements = [
      <span className="engine-field-title" key="field-title">
        {title}
      </span>,
      // renderTip(tip, { propName }),
      // <Icons name="arrow" className="engine-field-arrow" size="12px" key="engine-field-arrow-icon" />,
    ];

    return (
      <div className={classNameList} {...fieldProps}>
        {innerElements}
      </div>
    );
  }
}

export class PlainField extends Component<FieldProps> {
  render() {
    const { className, children } = this.props;
    return (
      <div className={classNames(`lc-field lc-plain-field`, className)}>
        <div className="lc-field-body">{children}</div>
      </div>
    );
  }
}
