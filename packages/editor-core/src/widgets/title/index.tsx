import { Component, isValidElement } from 'react';
import classNames from 'classnames';
import { createIcon } from '@ali/lowcode-utils';
import { TitleContent, isI18nData } from '@ali/lowcode-types';
import { intl } from '../../intl';
import { Tip } from '../tip';
import './title.less';

export class Title extends Component<{ title: TitleContent; className?: string; onClick?: () => void }> {
  constructor(props: any) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: React.MouseEvent) {
    const { title, onClick } = this.props as any;
    const url = title && (title.docUrl || title.url);
    if (url) {
      window.open(url);
      // 防止触发行操作（如折叠面板）
      e.stopPropagation();
    }
    // TODO: 操作交互冲突，目前 mixedSetter 仅有 2 个 setter 注册时用到了 onClick
    onClick && onClick(e);
  }

  render() {
    // eslint-disable-next-line prefer-const
    let { title, className } = this.props;
    if (title == null) {
      return null;
    }
    if (isValidElement(title)) {
      return title;
    }
    if (typeof title === 'string' || isI18nData(title)) {
      title = { label: title };
    }

    const icon = title.icon ? createIcon(title.icon) : null;

    let tip: any = null;
    if (title.tip) {
      if (isValidElement(title.tip) && title.tip.type === Tip) {
        tip = title.tip;
      } else {
        const tipProps =
          typeof title.tip === 'object' && !(isValidElement(title.tip) || isI18nData(title.tip))
            ? title.tip
            : { children: title.tip };
        tip = <Tip {...tipProps} />;
      }
    }

    return (
      <span
        className={classNames('lc-title', className, title.className, {
          'has-tip': !!tip,
          'only-icon': !title.label,
        })}
        onClick={this.handleClick}
      >
        {icon ? <b className="lc-title-icon">{icon}</b> : null}
        {title.label ? intl(title.label) : null}
        {tip}
      </span>
    );
  }
}
