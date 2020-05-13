import * as React from 'react';
import classNames from 'classnames';
import omit from 'omit.js';
import Grid from './Grid';
import Meta from './Meta';
import Tabs, { TabsProps } from '../tabs';
import Row from '../row';
import Col from '../col';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';
import { Omit } from '../_util/type';
import SizeContext from '../config-provider/SizeContext';

function getAction(actions: React.ReactNode[]) {
  const actionList = actions.map((action, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <li style={{ width: `${100 / actions.length}%` }} key={`action-${index}`}>
      <span>{action}</span>
    </li>
  ));
  return actionList;
}

export { CardGridProps } from './Grid';
export { CardMetaProps } from './Meta';

export type CardType = 'inner';
export type CardSize = 'default' | 'small';

export interface CardTabListType {
  key: string;
  tab: React.ReactNode;
  disabled?: boolean;
}

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  prefixCls?: string;
  title?: React.ReactNode;
  extra?: React.ReactNode;
  bordered?: boolean;
  headStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  loading?: boolean;
  hoverable?: boolean;
  children?: React.ReactNode;
  id?: string;
  className?: string;
  size?: CardSize;
  type?: CardType;
  cover?: React.ReactNode;
  actions?: React.ReactNode[];
  tabList?: CardTabListType[];
  tabBarExtraContent?: React.ReactNode | null;
  onTabChange?: (key: string) => void;
  activeTabKey?: string;
  defaultActiveTabKey?: string;
  tabProps?: TabsProps;
}

export default class Card extends React.Component<CardProps, {}> {
  static Grid: typeof Grid = Grid;

  static Meta: typeof Meta = Meta;

  onTabChange = (key: string) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(key);
    }
  };

  isContainGrid() {
    let containGrid;
    React.Children.forEach(this.props.children, (element: JSX.Element) => {
      if (element && element.type && element.type === Grid) {
        containGrid = true;
      }
    });
    return containGrid;
  }

  renderCard = ({ getPrefixCls, direction }: ConfigConsumerProps) => {
    const {
      prefixCls: customizePrefixCls,
      className,
      extra,
      headStyle = {},
      bodyStyle = {},
      title,
      loading,
      bordered = true,
      size: customizeSize,
      type,
      cover,
      actions,
      tabList,
      children,
      activeTabKey,
      defaultActiveTabKey,
      tabBarExtraContent,
      hoverable,
      tabProps = {},
      ...others
    } = this.props;

    const prefixCls = getPrefixCls('card', customizePrefixCls);

    const loadingBlockStyle =
      bodyStyle.padding === 0 || bodyStyle.padding === '0px' ? { padding: 24 } : undefined;

    const loadingBlock = (
      <div className={`${prefixCls}-loading-content`} style={loadingBlockStyle}>
        <Row gutter={8}>
          <Col span={22}>
            <div className={`${prefixCls}-loading-block`} />
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <div className={`${prefixCls}-loading-block`} />
          </Col>
          <Col span={15}>
            <div className={`${prefixCls}-loading-block`} />
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={6}>
            <div className={`${prefixCls}-loading-block`} />
          </Col>
          <Col span={18}>
            <div className={`${prefixCls}-loading-block`} />
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={13}>
            <div className={`${prefixCls}-loading-block`} />
          </Col>
          <Col span={9}>
            <div className={`${prefixCls}-loading-block`} />
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={4}>
            <div className={`${prefixCls}-loading-block`} />
          </Col>
          <Col span={3}>
            <div className={`${prefixCls}-loading-block`} />
          </Col>
          <Col span={16}>
            <div className={`${prefixCls}-loading-block`} />
          </Col>
        </Row>
      </div>
    );

    const hasActiveTabKey = activeTabKey !== undefined;
    const extraProps = {
      ...tabProps,
      [hasActiveTabKey ? 'activeKey' : 'defaultActiveKey']: hasActiveTabKey
        ? activeTabKey
        : defaultActiveTabKey,
      tabBarExtraContent,
    };

    let head: React.ReactNode;
    const tabs =
      tabList && tabList.length ? (
        <Tabs
          size="large"
          {...extraProps}
          className={`${prefixCls}-head-tabs`}
          onChange={this.onTabChange}
        >
          {tabList.map(item => (
            <Tabs.TabPane tab={item.tab} disabled={item.disabled} key={item.key} />
          ))}
        </Tabs>
      ) : null;
    if (title || extra || tabs) {
      head = (
        <div className={`${prefixCls}-head`} style={headStyle}>
          <div className={`${prefixCls}-head-wrapper`}>
            {title && <div className={`${prefixCls}-head-title`}>{title}</div>}
            {extra && <div className={`${prefixCls}-extra`}>{extra}</div>}
          </div>
          {tabs}
        </div>
      );
    }
    const coverDom = cover ? <div className={`${prefixCls}-cover`}>{cover}</div> : null;
    const body = (
      <div className={`${prefixCls}-body`} style={bodyStyle}>
        {loading ? loadingBlock : children}
      </div>
    );
    const actionDom =
      actions && actions.length ? (
        <ul className={`${prefixCls}-actions`}>{getAction(actions)}</ul>
      ) : null;
    const divProps = omit(others, ['onTabChange']);
    return (
      <SizeContext.Consumer>
        {size => {
          const mergedSize = customizeSize || size;
          const classString = classNames(prefixCls, className, {
            [`${prefixCls}-loading`]: loading,
            [`${prefixCls}-bordered`]: bordered,
            [`${prefixCls}-hoverable`]: hoverable,
            [`${prefixCls}-contain-grid`]: this.isContainGrid(),
            [`${prefixCls}-contain-tabs`]: tabList && tabList.length,
            [`${prefixCls}-${mergedSize}`]: mergedSize,
            [`${prefixCls}-type-${type}`]: !!type,
            [`${prefixCls}-rtl`]: direction === 'rtl',
          });

          return (
            <div {...divProps} className={classString}>
              {head}
              {coverDom}
              {body}
              {actionDom}
            </div>
          );
        }}
      </SizeContext.Consumer>
    );
  };

  render() {
    return <ConfigConsumer>{this.renderCard}</ConfigConsumer>;
  }
}
