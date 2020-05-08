import * as React from 'react';
import RcPagination from 'rc-pagination';
import enUS from 'rc-pagination/lib/locale/en_US';
import classNames from 'classnames';
import LeftOutlined from '@ant-design/icons/LeftOutlined';
import RightOutlined from '@ant-design/icons/RightOutlined';
import DoubleLeftOutlined from '@ant-design/icons/DoubleLeftOutlined';
import DoubleRightOutlined from '@ant-design/icons/DoubleRightOutlined';

import ResponsiveObserve from '../_util/responsiveObserve';
import MiniSelect from './MiniSelect';
import Select from '../select';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';

export interface PaginationProps {
  total?: number;
  defaultCurrent?: number;
  disabled?: boolean;
  current?: number;
  defaultPageSize?: number;
  pageSize?: number;
  onChange?: (page: number, pageSize?: number) => void;
  hideOnSinglePage?: boolean;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
  onShowSizeChange?: (current: number, size: number) => void;
  showQuickJumper?: boolean | { goButton?: React.ReactNode };
  showTitle?: boolean;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  size?: 'default' | 'small';
  responsive?: boolean;
  simple?: boolean;
  style?: React.CSSProperties;
  locale?: Object;
  className?: string;
  prefixCls?: string;
  selectPrefixCls?: string;
  itemRender?: (
    page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    originalElement: React.ReactElement<HTMLElement>,
  ) => React.ReactNode;
  role?: string;
  showLessItems?: boolean;
}

export type PaginationPosition =
  | 'top'
  | 'bottom'
  | 'both'
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight';

export interface PaginationConfig extends PaginationProps {
  position?: PaginationPosition[] | PaginationPosition;
}

export type PaginationLocale = any;

export default class Pagination extends React.Component<PaginationProps, {}> {
  private token: string;

  private inferredSmall: boolean = false;

  componentDidMount() {
    this.token = ResponsiveObserve.subscribe((screens) => {
      const { xs } = screens;
      const { size, responsive } = this.props;
      const inferredSmall = !!(xs && !size && responsive);
      if (this.inferredSmall !== inferredSmall) {
        this.inferredSmall = inferredSmall;
        this.forceUpdate();
      }
    });
  }

  componentWillUnmount() {
    ResponsiveObserve.unsubscribe(this.token);
  }

  getIconsProps = (prefixCls: string, direction: 'ltr' | 'rtl' | undefined) => {
    let prevIcon = (
      <a className={`${prefixCls}-item-link`}>
        <LeftOutlined />
      </a>
    );
    let nextIcon = (
      <a className={`${prefixCls}-item-link`}>
        <RightOutlined />
      </a>
    );
    let jumpPrevIcon = (
      <a className={`${prefixCls}-item-link`}>
        {/* You can use transition effects in the container :) */}
        <div className={`${prefixCls}-item-container`}>
          <DoubleLeftOutlined className={`${prefixCls}-item-link-icon`} />
          <span className={`${prefixCls}-item-ellipsis`}>•••</span>
        </div>
      </a>
    );
    let jumpNextIcon = (
      <a className={`${prefixCls}-item-link`}>
        {/* You can use transition effects in the container :) */}
        <div className={`${prefixCls}-item-container`}>
          <DoubleRightOutlined className={`${prefixCls}-item-link-icon`} />
          <span className={`${prefixCls}-item-ellipsis`}>•••</span>
        </div>
      </a>
    );

    // change arrows direction in right-to-left direction
    if (direction === 'rtl') {
      let temp: any;
      temp = prevIcon;
      prevIcon = nextIcon;
      nextIcon = temp;

      temp = jumpPrevIcon;
      jumpPrevIcon = jumpNextIcon;
      jumpNextIcon = temp;
    }
    return {
      prevIcon,
      nextIcon,
      jumpPrevIcon,
      jumpNextIcon,
    };
  };

  renderPagination = (contextLocale: PaginationLocale) => {
    const {
      prefixCls: customizePrefixCls,
      selectPrefixCls: customizeSelectPrefixCls,
      className,
      size,
      locale: customLocale,
      ...restProps
    } = this.props;
    const locale = { ...contextLocale, ...customLocale };
    const isSmall = size === 'small' || this.inferredSmall;
    return (
      <ConfigConsumer>
        {({ getPrefixCls, direction }: ConfigConsumerProps) => {
          const prefixCls = getPrefixCls('pagination', customizePrefixCls);
          const selectPrefixCls = getPrefixCls('select', customizeSelectPrefixCls);
          const extendedClassName = classNames(className, {
            mini: isSmall,
            [`${prefixCls}-rtl`]: direction === 'rtl',
          });

          return (
            <RcPagination
              {...restProps}
              prefixCls={prefixCls}
              selectPrefixCls={selectPrefixCls}
              {...this.getIconsProps(prefixCls, direction)}
              className={extendedClassName}
              selectComponentClass={isSmall ? MiniSelect : Select}
              locale={locale}
            />
          );
        }}
      </ConfigConsumer>
    );
  };

  render() {
    return (
      <LocaleReceiver componentName="Pagination" defaultLocale={enUS}>
        {this.renderPagination}
      </LocaleReceiver>
    );
  }
}
