import { Component } from 'react';
import classNames from 'classnames';
import { Icon } from '@alifd/next';
import { Title, TitleContent } from '@ali/lowcode-globals';
import { PopupPipe, PopupContext } from '../popup';
import './index.less';

export interface FieldProps {
  className?: string;
  // span
  title?: TitleContent | null;
}

export class CommonField extends Component<FieldProps> {
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
      <div ref={(shell) => (this.shell = shell)} className={classNames('lc-field lc-inline-field', className)}>
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

export type EntryFieldProps = FieldProps;

export class EntryField extends Component<EntryFieldProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { propName, stageName, tip, title, className } = this.props;
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
      renderTip(tip, { propName }),
      <Icons name="arrow" className="engine-field-arrow" size="12px" key="engine-field-arrow-icon" />,
    ];

    return (
      <div className={classNameList} {...fieldProps}>
        {innerElements}
      </div>
    );
  }
}
