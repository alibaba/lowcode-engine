import { Component, isValidElement, ReactElement, ReactNode } from 'react';
import { Icon } from '@alifd/next';
import classNames from 'classnames';
import EmbedTip, { TipConfig } from '../tip/embed-tip';
import './title.less';
import { IconConfig, createIcon } from '../../utils';

export interface TitleConfig {
  label?: ReactNode;
  tip?: string | ReactElement | TipConfig;
  icon?: string | ReactElement | IconConfig;
  className?: string;
}

export type TitleContent = string | ReactElement | TitleConfig;

export class Title extends Component<{ title: TitleContent; onClick?: () => void }> {
  render() {
    let { title } = this.props;
    if (isValidElement(title)) {
      return title;
    }
    if (typeof title === 'string') {
      title = { label: title }; // tslint:disable-line
    }

    const icon = title.icon ? createIcon(title.icon) : null;

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
      <div
        className={classNames('lc-title', title.className, {
          'has-tip': !!tip,
        })}
        onClick={this.props.onClick}
      >
        {icon ? <div className="lc-title-icon">{icon}</div> : null}
        {title.label ? <span className="lc-title-label">{title.label}</span> : null}
        {tip}
      </div>
    );
  }
}
