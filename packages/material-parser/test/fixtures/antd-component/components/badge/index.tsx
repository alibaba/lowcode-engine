import * as React from 'react';
import Animate from 'rc-animate';
import omit from 'omit.js';
import classNames from 'classnames';
import ScrollNumber from './ScrollNumber';
import { PresetColorTypes, PresetColorType, PresetStatusColorType } from '../_util/colors';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';
import { LiteralUnion } from '../_util/type';

export { ScrollNumberProps } from './ScrollNumber';

export interface BadgeProps {
  /** Number to show in badge */
  count?: React.ReactNode;
  showZero?: boolean;
  /** Max count to show */
  overflowCount?: number;
  /** whether to show red dot without number */
  dot?: boolean;
  style?: React.CSSProperties;
  prefixCls?: string;
  scrollNumberPrefixCls?: string;
  className?: string;
  status?: PresetStatusColorType;
  color?: LiteralUnion<PresetColorType, string>;
  text?: React.ReactNode;
  offset?: [number | string, number | string];
  title?: string;
}

function isPresetColor(color?: string): boolean {
  return (PresetColorTypes as any[]).indexOf(color) !== -1;
}

export default class Badge extends React.Component<BadgeProps, any> {
  static defaultProps = {
    count: null,
    showZero: false,
    dot: false,
    overflowCount: 99,
  };

  getNumberedDisplayCount() {
    const { count, overflowCount } = this.props;
    const displayCount =
      (count as number) > (overflowCount as number) ? `${overflowCount}+` : count;
    return displayCount as string | number | null;
  }

  getDisplayCount() {
    const isDot = this.isDot();
    // dot mode don't need count
    if (isDot) {
      return '';
    }
    return this.getNumberedDisplayCount();
  }

  getScrollNumberTitle() {
    const { title, count } = this.props;
    if (title) {
      return title;
    }
    return typeof count === 'string' || typeof count === 'number' ? count : undefined;
  }

  getStyleWithOffset() {
    const { offset, style } = this.props;
    return offset
      ? {
          right: -parseInt(offset[0] as string, 10),
          marginTop: offset[1],
          ...style,
        }
      : style;
  }

  getBadgeClassName(prefixCls: string, direction: string = 'ltr') {
    const { className, children } = this.props;
    return classNames(className, prefixCls, {
      [`${prefixCls}-status`]: this.hasStatus(),
      [`${prefixCls}-not-a-wrapper`]: !children,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    }) as string;
  }

  hasStatus(): boolean {
    const { status, color } = this.props;
    return !!status || !!color;
  }

  isZero() {
    const numberedDisplayCount = this.getNumberedDisplayCount();
    return numberedDisplayCount === '0' || numberedDisplayCount === 0;
  }

  isDot() {
    const { dot } = this.props;
    const isZero = this.isZero();
    return (dot && !isZero) || this.hasStatus();
  }

  isHidden() {
    const { showZero } = this.props;
    const displayCount = this.getDisplayCount();
    const isZero = this.isZero();
    const isDot = this.isDot();
    const isEmpty = displayCount === null || displayCount === undefined || displayCount === '';
    return (isEmpty || (isZero && !showZero)) && !isDot;
  }

  renderStatusText(prefixCls: string) {
    const { text } = this.props;
    const hidden = this.isHidden();
    return hidden || !text ? null : <span className={`${prefixCls}-status-text`}>{text}</span>;
  }

  renderDisplayComponent() {
    const { count } = this.props;
    const customNode = count as React.ReactElement<any>;
    if (!customNode || typeof customNode !== 'object') {
      return undefined;
    }
    return React.cloneElement(customNode, {
      style: {
        ...this.getStyleWithOffset(),
        ...(customNode.props && customNode.props.style),
      },
    });
  }

  renderBadgeNumber(prefixCls: string, scrollNumberPrefixCls: string) {
    const { status, count, color } = this.props;

    const displayCount = this.getDisplayCount();
    const isDot = this.isDot();
    const hidden = this.isHidden();

    const scrollNumberCls = classNames({
      [`${prefixCls}-dot`]: isDot,
      [`${prefixCls}-count`]: !isDot,
      [`${prefixCls}-multiple-words`]:
        !isDot && count && count.toString && count.toString().length > 1,
      [`${prefixCls}-status-${status}`]: !!status,
      [`${prefixCls}-status-${color}`]: isPresetColor(color),
    });

    let statusStyle: React.CSSProperties | undefined = this.getStyleWithOffset();
    if (color && !isPresetColor(color)) {
      statusStyle = statusStyle || {};
      statusStyle.background = color;
    }

    return hidden ? null : (
      <ScrollNumber
        prefixCls={scrollNumberPrefixCls}
        data-show={!hidden}
        className={scrollNumberCls}
        count={displayCount}
        displayComponent={this.renderDisplayComponent()} // <Badge status="success" count={<Icon type="xxx" />}></Badge>
        title={this.getScrollNumberTitle()}
        style={statusStyle}
        key="scrollNumber"
      />
    );
  }

  renderBadge = ({ getPrefixCls, direction }: ConfigConsumerProps) => {
    const {
      prefixCls: customizePrefixCls,
      scrollNumberPrefixCls: customizeScrollNumberPrefixCls,
      children,
      status,
      text,
      color,
      ...restProps
    } = this.props;
    const omitArr = [
      'count',
      'showZero',
      'overflowCount',
      'className',
      'style',
      'dot',
      'offset',
      'title',
    ];

    const prefixCls = getPrefixCls('badge', customizePrefixCls);
    const scrollNumberPrefixCls = getPrefixCls('scroll-number', customizeScrollNumberPrefixCls);

    const scrollNumber = this.renderBadgeNumber(prefixCls, scrollNumberPrefixCls);
    const statusText = this.renderStatusText(prefixCls);

    const statusCls = classNames({
      [`${prefixCls}-status-dot`]: this.hasStatus(),
      [`${prefixCls}-status-${status}`]: !!status,
      [`${prefixCls}-status-${color}`]: isPresetColor(color),
    });
    const statusStyle: React.CSSProperties = {};
    if (color && !isPresetColor(color)) {
      statusStyle.background = color;
    }

    // <Badge status="success" />
    if (!children && this.hasStatus()) {
      const styleWithOffset = this.getStyleWithOffset();
      const statusTextColor = styleWithOffset && styleWithOffset.color;
      return (
        <span
          {...omit(restProps, omitArr)}
          className={this.getBadgeClassName(prefixCls, direction)}
          style={styleWithOffset}
        >
          <span className={statusCls} style={statusStyle} />
          <span style={{ color: statusTextColor }} className={`${prefixCls}-status-text`}>
            {text}
          </span>
        </span>
      );
    }

    return (
      <span {...omit(restProps, omitArr)} className={this.getBadgeClassName(prefixCls, direction)}>
        {children}
        <Animate
          component=""
          showProp="data-show"
          transitionName={children ? `${prefixCls}-zoom` : ''}
          transitionAppear
        >
          {scrollNumber}
        </Animate>
        {statusText}
      </span>
    );
  };

  render() {
    return <ConfigConsumer>{this.renderBadge}</ConfigConsumer>;
  }
}
