import { Component, isValidElement, ReactElement, ReactNode } from 'react';
import { Icon } from '@alifd/next';
import classNames from 'classnames';
import EmbedTip, { TipConfig } from '../tip/embed-tip';
import './title.less';

export interface IconConfig {
  type: string;
  size?: number | "small" | "xxs" | "xs" | "medium" | "large" | "xl" | "xxl" | "xxxl" | "inherit";
  className?: string;
}

export interface TitleConfig {
  label?: ReactNode;
  tip?: string | ReactElement | TipConfig;
  icon?: string | ReactElement | IconConfig;
  className?: string;
}

export type TitleContent = string | ReactElement | TitleConfig;

export default class Title extends Component<{ title: TitleContent; onClick?: () => void }> {
  render() {
    let { title } = this.props;
    if (isValidElement(title)) {
      return title;
    }
    if (typeof title === 'string') {
      title = { label: title }; // tslint:disable-line
    }

    let icon = null;
    if (title.icon) {
      if (isValidElement(title.icon)) {
        icon = title.icon;
      } else {
        const iconProps = typeof title.icon === 'string' ? { type: title.icon } : title.icon;
        icon = <Icon {...iconProps} />;
      }
    }

    let tip: any = null;
    if (title.tip) {
      if (isValidElement(title.tip) && title.tip.type === EmbedTip) {
        tip = title.tip;
      } else {
        const tipProps =
          typeof title.tip === 'object' && !isValidElement(title.tip) ? title.tip : { children: title.tip };
        tip = <EmbedTip direction="top" theme="black" {...tipProps} />;
      }
    }

    return (
      <div className={classNames('lc-title', title.className)} onClick={this.props.onClick}>
        {icon ? <div className="lc-title-icon">{icon}</div> : null}
        {title.label ? <span className="lc-title-label">{title.label}</span> : null}
        {tip}
      </div>
    );
  }
}
