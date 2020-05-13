import * as React from 'react';
import classnames from 'classnames';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';
import ArrowRightOutlined from '@ant-design/icons/ArrowRightOutlined';
import ResizeObserver from 'rc-resize-observer';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';
import Tag from '../tag';
import Breadcrumb, { BreadcrumbProps } from '../breadcrumb';
import Avatar, { AvatarProps } from '../avatar';
import TransButton from '../_util/transButton';
import LocaleReceiver from '../locale-provider/LocaleReceiver';

export interface PageHeaderProps {
  backIcon?: React.ReactNode;
  prefixCls?: string;
  title: React.ReactNode;
  subTitle?: React.ReactNode;
  style?: React.CSSProperties;
  breadcrumb?: BreadcrumbProps;
  tags?: React.ReactElement<Tag> | React.ReactElement<Tag>[];
  footer?: React.ReactNode;
  extra?: React.ReactNode;
  avatar?: AvatarProps;
  onBack?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  ghost?: boolean;
}

const renderBack = (
  prefixCls: string,
  backIcon?: React.ReactNode,
  onBack?: (e: React.MouseEvent<HTMLElement>) => void,
) => {
  if (!backIcon || !onBack) {
    return null;
  }
  return (
    <LocaleReceiver componentName="PageHeader">
      {({ back }: { back: string }) => (
        <div className={`${prefixCls}-back`}>
          <TransButton
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              if (onBack) {
                onBack(e);
              }
            }}
            className={`${prefixCls}-back-button`}
            aria-label={back}
          >
            {backIcon}
          </TransButton>
        </div>
      )}
    </LocaleReceiver>
  );
};

const renderBreadcrumb = (breadcrumb: BreadcrumbProps) => {
  return <Breadcrumb {...breadcrumb} />;
};

const getBackIcon = (props: PageHeaderProps, direction: string = 'ltr') => {
  if (props.backIcon !== undefined) {
    return props.backIcon;
  }
  return direction === 'rtl' ? <ArrowRightOutlined /> : <ArrowLeftOutlined />;
};

const renderTitle = (prefixCls: string, props: PageHeaderProps, direction: string = 'ltr') => {
  const { title, avatar, subTitle, tags, extra, onBack } = props;
  const headingPrefixCls = `${prefixCls}-heading`;
  if (title || subTitle || tags || extra) {
    const backIcon = getBackIcon(props, direction);
    const backIconDom = renderBack(prefixCls, backIcon, onBack);
    return (
      <div className={headingPrefixCls}>
        <div className={`${headingPrefixCls}-left`}>
          {backIconDom}
          {avatar && <Avatar {...avatar} />}
          {title && (
            <span
              className={`${headingPrefixCls}-title`}
              title={typeof title === 'string' ? title : undefined}
            >
              {title}
            </span>
          )}
          {subTitle && (
            <span
              className={`${headingPrefixCls}-sub-title`}
              title={typeof subTitle === 'string' ? subTitle : undefined}
            >
              {subTitle}
            </span>
          )}
          {tags && <span className={`${headingPrefixCls}-tags`}>{tags}</span>}
        </div>
        {extra && <span className={`${headingPrefixCls}-extra`}>{extra}</span>}
      </div>
    );
  }
  return null;
};

const renderFooter = (prefixCls: string, footer: React.ReactNode) => {
  if (footer) {
    return <div className={`${prefixCls}-footer`}>{footer}</div>;
  }
  return null;
};

const renderChildren = (prefixCls: string, children: React.ReactNode) => {
  return <div className={`${prefixCls}-content`}>{children}</div>;
};

const PageHeader: React.FC<PageHeaderProps> = props => {
  const [compact, updateCompact] = React.useState(false);
  const onResize = ({ width }: { width: number }) => {
    updateCompact(width < 768);
  };
  return (
    <ConfigConsumer>
      {({ getPrefixCls, pageHeader, direction }: ConfigConsumerProps) => {
        const {
          prefixCls: customizePrefixCls,
          style,
          footer,
          children,
          breadcrumb,
          className: customizeClassName,
        } = props;
        let ghost: undefined | boolean = true;

        // Use `ghost` from `props` or from `ConfigProvider` instead.
        if ('ghost' in props) {
          ghost = props.ghost;
        } else if (pageHeader && 'ghost' in pageHeader) {
          ghost = pageHeader.ghost;
        }

        const prefixCls = getPrefixCls('page-header', customizePrefixCls);
        const breadcrumbDom = breadcrumb && breadcrumb.routes ? renderBreadcrumb(breadcrumb) : null;
        const className = classnames(prefixCls, customizeClassName, {
          'has-breadcrumb': breadcrumbDom,
          'has-footer': footer,
          [`${prefixCls}-ghost`]: ghost,
          [`${prefixCls}-rtl`]: direction === 'rtl',
          [`${prefixCls}-compact`]: compact,
        });

        return (
          <ResizeObserver onResize={onResize}>
            <div className={className} style={style}>
              {breadcrumbDom}
              {renderTitle(prefixCls, props, direction)}
              {children && renderChildren(prefixCls, children)}
              {renderFooter(prefixCls, footer)}
            </div>
          </ResizeObserver>
        );
      }}
    </ConfigConsumer>
  );
};

export default PageHeader;
