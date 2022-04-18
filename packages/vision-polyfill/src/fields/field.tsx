import classnames from 'classnames';
import * as React from 'react';
import { Component } from 'react';
import InlineTip from './inlinetip';
import { isPlainObject } from '@ali/lowcode-utils';
import { intl } from '../locale';

interface IHelpTip {
  url?: string;
  content?: string;
}

function splitWord(title: string): JSX.Element[] {
  return (title || '').split('').map((w, i) => <b key={`word${i}`} className="engine-word">{w}</b>);
}

function getFieldTitle(title: string, tip: IHelpTip, compact?: boolean, propName?: string): JSX.Element {
  const className = classnames('engine-field-title', { 've-compact': compact });
  let titleContent = null;

  if (!compact && typeof title === 'string') {
    titleContent = splitWord(title);
  }

  let tipUrl = null;
  let tipContent = null;

  tipContent = (
    <div>
      <div>{intl('PropName:')}{propName}</div>
    </div>
  );

  if (isPlainObject(tip)) {
    tipUrl = tip.url;
    tipContent = (
      <div>
        <div>{intl('PropName:')}{propName}</div>
        <div>{intl('Explanation:')}{tip.content}</div>
      </div>
    );
  } else if (tip) {
    tipContent = (
      <div>
        <div>{intl('PropName:')}{propName}</div>
        <div>{intl('Explanation:')}{tip}</div>
      </div>
    );
  }
  return (
    <a
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      href={tipUrl!}
    >
      {titleContent || (typeof title === 'object' ? '' : title)}
      <InlineTip position="top">{tipContent}</InlineTip>
    </a>
  );
}

export interface IVEFieldProps {
  prop: any;
  children: JSX.Element | string;
  title?: string;
  tip?: any;
  propName?: string;
  className?: string;
  compact?: boolean;
  stageName?: string;
  /**
   * render the top-header by jsx
   */
  headDIY?: boolean;

  isSupportVariable?: boolean;
  isSupportMultiSetter?: boolean;
  isUseVariable?: boolean;

  isGroup?: boolean;
  isExpand?: boolean;

  toggleExpand?: () => any;
  onExpandChange?: (fn: () => any) => any;
}

interface IVEFieldState {
  hasError?: boolean;
}

export default class VEField extends Component<IVEFieldProps, IVEFieldState> {
  public static displayName = 'VEField';

  public readonly props: IVEFieldProps;

  public classNames: string[] = [];

  public state: IVEFieldState = {
    hasError: false,
  };

  public componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(error);
    console.warn(info.componentStack);
  }

  public renderHead(): JSX.Element | JSX.Element[] | null {
    const { title, tip, compact, propName } = this.props;
    return getFieldTitle(title!, tip, compact, propName);
  }

  public renderBody(): JSX.Element | string {
    return this.props.children;
  }

  public renderFoot(): any {
    return null;
  }

  public render(): JSX.Element {
    const { stageName, headDIY } = this.props;
    const classNameList = classnames(...this.classNames, this.props.className);
    const fieldProps: any = {};

    if (stageName) {
      // 为 stage 切换奠定基础
      fieldProps['data-stage-target'] = this.props.stageName;
    }

    if (this.state.hasError) {
      return (
        <div>Field render error, please open console to find out.</div>
      );
    }

    const headContent = headDIY ? this.renderHead()
      : <div className="engine-field-head">{this.renderHead()}</div>;

    return (
      <div className={classNameList} {...fieldProps}>
        {headContent}
        <div className="engine-field-body">
          {this.renderBody()}
        </div>
        <div className="engine-field-foot">
          {this.renderFoot()}
        </div>
      </div>
    );
  }
}
