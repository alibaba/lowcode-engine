import { Component, isValidElement, ReactNode } from 'react';
import classNames from 'classnames';
import { createIcon } from '@alilc/lowcode-utils';
import { TitleContent, isI18nData, I18nData } from '@alilc/lowcode-types';
import { intl } from '../../intl';
import { Tip } from '../tip';
import './title.less';

/**
 * 根据 keywords 将 label 分割成文字片段
 * 示例：title = '自定义页面布局'，keywords = '页面'，返回结果为 ['自定义', '页面', '布局']
 * @param label title
 * @param keywords 关键字
 * @returns 文字片段列表
 */
 function splitLabelByKeywords(label: string, keywords: string): string[] {
  const len = keywords.length;
  const fragments = [];
  let str = label;

  while (str.length > 0) {
    const index = str.indexOf(keywords);

    if (index === 0) {
      fragments.push(keywords);
      str = str.slice(len);
    } else if (index < 0) {
      fragments.push(str);
      str = '';
    } else {
      fragments.push(str.slice(0, index));
      str = str.slice(index);
    }
  }

  return fragments;
}

export class Title extends Component<{
  title: TitleContent;
  className?: string;
  onClick?: () => void;
  match?: boolean;
  keywords?: string;
}> {
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

  renderLabel = (label: string | I18nData | ReactNode) => {
    let { match, keywords } = this.props;

    if (!label) {
      return null;
    }

    const intlLabel = intl(label);

    if (typeof intlLabel !== 'string') {
      return <span className="lc-title-txt">{intlLabel}</span>;
    }

    let labelToRender: ReactNode = intlLabel;

    if (match && keywords) {
      const fragments = splitLabelByKeywords(intlLabel as string, keywords);

      labelToRender = fragments.map(f => <span style={{ color: f === keywords ? 'red' : 'inherit' }}>{f}</span>);
    }

    return (
      <span className="lc-title-txt">{labelToRender}</span>
    );
  };

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

    const icon = title.icon ? createIcon(title.icon, { size: 20 }) : null;

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
        {this.renderLabel(title.label)}
        {tip}
      </span>
    );
  }
}
