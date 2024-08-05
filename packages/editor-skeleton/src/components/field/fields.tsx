/* eslint-disable react/no-unused-prop-types */
import { Component, ErrorInfo, MouseEvent } from 'react';
import { isObject } from 'lodash';
import classNames from 'classnames';
import { Icon } from '@alifd/next';
import { Title } from '@alilc/lowcode-editor-core';
import { IPublicModelEditor, IPublicTypeTitleContent } from '@alilc/lowcode-types';
import { PopupPipe, PopupContext } from '../popup';
import './index.less';
import InlineTip from './inlinetip';
import { intl } from '../../locale';
import { Logger } from '@alilc/lowcode-utils';

const logger = new Logger({ level: 'warn', bizName: 'skeleton:field' });

export interface FieldProps {
  className?: string;
  meta?: { package: string; componentName: string } | string;
  title?: IPublicTypeTitleContent | null;
  editor?: IPublicModelEditor;
  defaultDisplay?: 'accordion' | 'inline' | 'block' | 'plain' | 'popup' | 'entry';
  collapsed?: boolean;
  valueState?: number;
  name?: string;
  tip?: any;
  onExpandChange?: (expandState: boolean) => void;
  onClear?: () => void;
}

export class Field extends Component<FieldProps> {
  state = {
    collapsed: this.props.collapsed,
    display: this.props.defaultDisplay || 'inline',
    hasError: false,
  };

  private body: HTMLDivElement | null = null;

  private dispose?: () => void;

  constructor(props: any) {
    super(props);
    this.handleClear = this.handleClear.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  private toggleExpand = () => {
    const { onExpandChange } = this.props;
    // eslint-disable-next-line react/no-access-state-in-setstate
    const collapsed = !this.state.collapsed;
    this.setState({
      collapsed,
    });
    onExpandChange && onExpandChange(!collapsed);
  };

  private deployBlockTesting() {
    if (this.dispose) {
      this.dispose();
    }
    const { body } = this;
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

  private handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    this.props.onClear && this.props.onClear();
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

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(`${this.props.title} has error`, error, errorInfo);
  }

  getTipContent(propName: string, tip?: any): any {
    let tipContent = (
      <div>
        <div>{intl('Attribute: ')}{propName}</div>
      </div>
    );

    if (isObject(tip)) {
      tipContent = (
        <div>
          <div>{intl('Attribute: ')}{propName}</div>
          <div>{intl('Description: ')}{(tip as any).content}</div>
        </div>
      );
    } else if (tip) {
      tipContent = (
        <div>
          <div>{intl('Attribute: ')}{propName}</div>
          <div>{intl('Description: ')}{tip}</div>
        </div>
      );
    }
    return tipContent;
  }

  clickHandler(event?: MouseEvent) {
    const { editor, name, title, meta } = this.props;
    editor?.eventBus.emit('setting.setter.field.click', { name, title, meta, event });
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return null;
    }

    const { className, children, meta, title, valueState, name: propName, tip } = this.props;
    const { display, collapsed } = this.state;
    const isAccordion = display === 'accordion';
    let hostName = '';
    if (typeof meta === 'object') {
      hostName = `${meta?.package || ''}-${meta.componentName || ''}`;
    } else if (typeof meta === 'string') {
      hostName = meta;
    }
    const id = `${hostName}-${propName || (title as any)['en-US'] || (title as any)['zh-CN']}`;
    const tipContent = this.getTipContent(propName!, tip);
    return (
      <div
        className={classNames(`lc-field lc-${display}-field`, className, {
          'lc-field-is-collapsed': isAccordion && collapsed,
        })}
        id={id}
      >
        {
          display !== 'plain' && (
            <div className="lc-field-head" onClick={isAccordion ? this.toggleExpand : undefined}>
              <div className="lc-field-title">
                {createValueState(valueState, this.handleClear)}
                <Title
                  title={title || ''}
                  onClick={this.clickHandler}
                />
                <InlineTip position="top">{tipContent}</InlineTip>
              </div>
              {isAccordion && <Icon className="lc-field-icon" type="arrow-up" size="xs" />}
            </div>
          )
        }
        <div key="body" ref={(shell) => { this.body = shell; }} className="lc-field-body">
          {children}
        </div>
      </div>
    );
  }
}

/**
 * **交互专利点**
 *
 * -1 多种值
 * 0 | null 无值
 * 1 类似值，比如数组长度一样
 * 2 单一植
 * 10 必填
 *
 * TODO: turn number to enum
 */
function createValueState(/* valueState?: number, onClear?: (e: React.MouseEvent) => void */) {
  return null;
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
    const { title, className, stageName } = this.props;
    const classNameList = classNames('lc-field', 'lc-entry-field', className);

    return (
      <div className={classNameList}>
        <div className="lc-field-head" data-stage-target={stageName}>
          <div className="lc-field-title">
            <Title title={title || ''} />
          </div>
          <Icon className="lc-field-icon" type="arrow-right" size="xs" />
        </div>
      </div>
    );
  }
}

export class PlainField extends Component<FieldProps> {
  render() {
    const { className, children } = this.props;
    return (
      <div className={classNames('lc-field lc-plain-field', className)}>
        <div className="lc-field-body">{children}</div>
      </div>
    );
  }
}
