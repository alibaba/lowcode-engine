import { Component } from 'react';
import { isObject } from 'lodash';
import classNames from 'classnames';
import { Icon } from '@alifd/next';
import { Title, Tip } from '@ali/lowcode-editor-core';
import { TitleContent } from '@ali/lowcode-types';
import { PopupPipe, PopupContext } from '../popup';
import { intlNode } from '../../locale';
import './index.less';
import { IconClear } from '../../icons/clear';
import InlineTip from './inlinetip';

export interface FieldProps {
  className?: string;
  meta?: { package: string; componentName: string } | string;
  title?: TitleContent | null;
  defaultDisplay?: 'accordion' | 'inline' | 'block';
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
  };

  constructor(props: any) {
    super(props);
    this.handleClear = this.handleClear.bind(this);
  }

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

  getTipContent(propName: string, tip?: any): any {
    let tipContent = (
      <div>
        <div>属性：{propName}</div>
      </div>
    );

    if (isObject(tip)) {
      tipContent = (
        <div>
          <div>属性：{propName}</div>
          <div>说明：{(tip as any).content}</div>
        </div>
      );
    } else if (tip) {
      tipContent = (
        <div>
          <div>属性：{propName}</div>
          <div>说明：{tip}</div>
        </div>
      );
    }
    return tipContent;
  }

  render() {
    const { className, children, meta, title, valueState, onClear, name: propName, tip } = this.props;
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
        <div className="lc-field-head" onClick={isAccordion ? this.toggleExpand : undefined}>
          <div className="lc-field-title">
            {createValueState(valueState, this.handleClear)}
            <Title title={title || ''} />
            <InlineTip position="top">{tipContent}</InlineTip>
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
function createValueState(valueState?: number, onClear?: (e: React.MouseEvent) => void) {
  return null;
  /*
  let tip: any = null;
  let className = 'lc-valuestate';
  let icon: any = null;
  if (valueState) {
    if (valueState < 0) {
      // multiple value 橘黄色点： tip：多种值，点击清除
      tip = intlNode('Multiple Value, Click to Clear');
      className += ' valuestate-multiple';
      icon = <IconClear size={6} />;
    } else if (valueState === 10) {
      // isset  orangered tip: 必填项
      tip = intlNode('Required');
      className += ' valuestate-required';
      onClear = undefined;
    } else if (valueState > 0) {
      // isset  蓝点 tip: 已设置值，点击清除
      tip = intlNode('Setted Value, Click to Clear');
      className += ' valuestate-isset';
      icon = <IconClear size={6} />;
    }
  } else {
    onClear = undefined;
    // unset 占位空间
  }

  return (
    <i className={className} onClick={onClear}>
      {icon}
      {tip && <Tip>{tip}</Tip>}
    </i>
  );
  */
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

    return (
      <div className={classNameList} {...fieldProps}>
        <div className="lc-field-title">
          <Title title={title || ''} />
        </div>
        <Icon className="lc-field-icon" type="arrow-left" size="xs" />
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
