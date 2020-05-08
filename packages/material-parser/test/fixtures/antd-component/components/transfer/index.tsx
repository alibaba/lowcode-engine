import * as React from 'react';
import classNames from 'classnames';
import List, { TransferListProps } from './list';
import Operation from './operation';
import Search from './search';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/default';
import { ConfigConsumer, ConfigConsumerProps, RenderEmptyHandler } from '../config-provider';
import { TransferListBodyProps } from './renderListBody';

export { TransferListProps } from './list';
export { TransferOperationProps } from './operation';
export { TransferSearchProps } from './search';

export type TransferDirection = 'left' | 'right';

export interface RenderResultObject {
  label: React.ReactElement;
  value: string;
}

export type RenderResult = React.ReactElement | RenderResultObject | string | null;

type TransferRender = (item: TransferItem) => RenderResult;

export interface TransferItem {
  key: string;
  title?: string;
  description?: string;
  disabled?: boolean;
  [name: string]: any;
}

export interface ListStyle {
  direction: TransferDirection;
}

export type SelectAllLabel =
  | React.ReactNode
  | ((info: { selectedCount: number; totalCount: number }) => React.ReactNode);

export interface TransferProps {
  prefixCls?: string;
  className?: string;
  disabled?: boolean;
  dataSource: TransferItem[];
  targetKeys?: string[];
  selectedKeys?: string[];
  render?: TransferRender;
  onChange?: (targetKeys: string[], direction: string, moveKeys: string[]) => void;
  onSelectChange?: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
  style?: React.CSSProperties;
  listStyle: ((style: ListStyle) => React.CSSProperties) | React.CSSProperties;
  operationStyle?: React.CSSProperties;
  titles?: string[];
  operations?: string[];
  showSearch?: boolean;
  filterOption?: (inputValue: string, item: TransferItem) => boolean;
  locale?: Partial<TransferLocale>;
  footer?: (props: TransferListProps) => React.ReactNode;
  rowKey?: (record: TransferItem) => string;
  onSearch?: (direction: TransferDirection, value: string) => void;
  onScroll?: (direction: TransferDirection, e: React.SyntheticEvent<HTMLUListElement>) => void;
  children?: (props: TransferListBodyProps) => React.ReactNode;
  showSelectAll?: boolean;
  selectAllLabels?: SelectAllLabel[];
}

export interface TransferLocale {
  titles: string[];
  notFoundContent?: React.ReactNode;
  searchPlaceholder: string;
  itemUnit: string;
  itemsUnit: string;
}

class Transfer extends React.Component<TransferProps, any> {
  // For high-level customized Transfer @dqaria
  static List = List;

  static Operation = Operation;

  static Search = Search;

  static defaultProps = {
    dataSource: [],
    locale: {},
    showSearch: false,
    listStyle: () => {},
  };

  static getDerivedStateFromProps(nextProps: TransferProps) {
    if (nextProps.selectedKeys) {
      const targetKeys = nextProps.targetKeys || [];
      return {
        sourceSelectedKeys: nextProps.selectedKeys.filter(key => !targetKeys.includes(key)),
        targetSelectedKeys: nextProps.selectedKeys.filter(key => targetKeys.includes(key)),
      };
    }
    return null;
  }

  separatedDataSource: {
    leftDataSource: TransferItem[];
    rightDataSource: TransferItem[];
  } | null = null;

  constructor(props: TransferProps) {
    super(props);

    const { selectedKeys = [], targetKeys = [] } = props;
    this.state = {
      sourceSelectedKeys: selectedKeys.filter(key => targetKeys.indexOf(key) === -1),
      targetSelectedKeys: selectedKeys.filter(key => targetKeys.indexOf(key) > -1),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getSelectedKeysName(direction: TransferDirection) {
    return direction === 'left' ? 'sourceSelectedKeys' : 'targetSelectedKeys';
  }

  getTitles(transferLocale: TransferLocale): string[] {
    const { props } = this;
    if (props.titles) {
      return props.titles;
    }
    return transferLocale.titles;
  }

  getLocale = (transferLocale: TransferLocale, renderEmpty: RenderEmptyHandler) => {
    return { ...transferLocale, notFoundContent: renderEmpty('Transfer'), ...this.props.locale };
  };

  moveTo = (direction: TransferDirection) => {
    const { targetKeys = [], dataSource = [], onChange } = this.props;
    const { sourceSelectedKeys, targetSelectedKeys } = this.state;
    const moveKeys = direction === 'right' ? sourceSelectedKeys : targetSelectedKeys;
    // filter the disabled options
    const newMoveKeys = moveKeys.filter(
      (key: string) => !dataSource.some(data => !!(key === data.key && data.disabled)),
    );
    // move items to target box
    const newTargetKeys =
      direction === 'right'
        ? newMoveKeys.concat(targetKeys)
        : targetKeys.filter(targetKey => newMoveKeys.indexOf(targetKey) === -1);

    // empty checked keys
    const oppositeDirection = direction === 'right' ? 'left' : 'right';
    this.setState({
      [this.getSelectedKeysName(oppositeDirection)]: [],
    });
    this.handleSelectChange(oppositeDirection, []);

    if (onChange) {
      onChange(newTargetKeys, direction, newMoveKeys);
    }
  };

  moveToLeft = () => this.moveTo('left');

  moveToRight = () => this.moveTo('right');

  onItemSelectAll = (direction: TransferDirection, selectedKeys: string[], checkAll: boolean) => {
    const originalSelectedKeys = this.state[this.getSelectedKeysName(direction)] || [];

    let mergedCheckedKeys = [];
    if (checkAll) {
      // Merge current keys with origin key
      mergedCheckedKeys = Array.from(new Set([...originalSelectedKeys, ...selectedKeys]));
    } else {
      // Remove current keys from origin keys
      mergedCheckedKeys = originalSelectedKeys.filter(
        (key: string) => selectedKeys.indexOf(key) === -1,
      );
    }

    this.handleSelectChange(direction, mergedCheckedKeys);

    if (!this.props.selectedKeys) {
      this.setState({
        [this.getSelectedKeysName(direction)]: mergedCheckedKeys,
      });
    }
  };

  onLeftItemSelectAll = (selectedKeys: string[], checkAll: boolean) =>
    this.onItemSelectAll('left', selectedKeys, checkAll);

  onRightItemSelectAll = (selectedKeys: string[], checkAll: boolean) =>
    this.onItemSelectAll('right', selectedKeys, checkAll);

  handleFilter = (direction: TransferDirection, e: React.ChangeEvent<HTMLInputElement>) => {
    const { onSearch } = this.props;
    const value = e.target.value;
    if (onSearch) {
      onSearch(direction, value);
    }
  };

  handleLeftFilter = (e: React.ChangeEvent<HTMLInputElement>) => this.handleFilter('left', e);

  handleRightFilter = (e: React.ChangeEvent<HTMLInputElement>) => this.handleFilter('right', e);

  handleClear = (direction: TransferDirection) => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch(direction, '');
    }
  };

  handleLeftClear = () => this.handleClear('left');

  handleRightClear = () => this.handleClear('right');

  onItemSelect = (direction: TransferDirection, selectedKey: string, checked: boolean) => {
    const { sourceSelectedKeys, targetSelectedKeys } = this.state;
    const holder = direction === 'left' ? [...sourceSelectedKeys] : [...targetSelectedKeys];
    const index = holder.indexOf(selectedKey);
    if (index > -1) {
      holder.splice(index, 1);
    }
    if (checked) {
      holder.push(selectedKey);
    }
    this.handleSelectChange(direction, holder);

    if (!this.props.selectedKeys) {
      this.setState({
        [this.getSelectedKeysName(direction)]: holder,
      });
    }
  };

  onLeftItemSelect = (selectedKey: string, checked: boolean) =>
    this.onItemSelect('left', selectedKey, checked);

  onRightItemSelect = (selectedKey: string, checked: boolean) =>
    this.onItemSelect('right', selectedKey, checked);

  handleScroll = (direction: TransferDirection, e: React.SyntheticEvent<HTMLUListElement>) => {
    const { onScroll } = this.props;
    if (onScroll) {
      onScroll(direction, e);
    }
  };

  handleLeftScroll = (e: React.SyntheticEvent<HTMLUListElement>) => this.handleScroll('left', e);

  handleRightScroll = (e: React.SyntheticEvent<HTMLUListElement>) => this.handleScroll('right', e);

  handleSelectChange(direction: TransferDirection, holder: string[]) {
    const { sourceSelectedKeys, targetSelectedKeys } = this.state;
    const { onSelectChange } = this.props;
    if (!onSelectChange) {
      return;
    }

    if (direction === 'left') {
      onSelectChange(holder, targetSelectedKeys);
    } else {
      onSelectChange(sourceSelectedKeys, holder);
    }
  }

  handleListStyle = (
    listStyle: ((style: ListStyle) => React.CSSProperties) | React.CSSProperties,
    direction: TransferDirection,
  ) => {
    if (typeof listStyle === 'function') {
      return listStyle({ direction });
    }
    return listStyle;
  };

  separateDataSource() {
    const { dataSource, rowKey, targetKeys = [] } = this.props;

    const leftDataSource: TransferItem[] = [];
    const rightDataSource: TransferItem[] = new Array(targetKeys.length);
    dataSource.forEach(record => {
      if (rowKey) {
        record.key = rowKey(record);
      }

      // rightDataSource should be ordered by targetKeys
      // leftDataSource should be ordered by dataSource
      const indexOfKey = targetKeys.indexOf(record.key);
      if (indexOfKey !== -1) {
        rightDataSource[indexOfKey] = record;
      } else {
        leftDataSource.push(record);
      }
    });

    return {
      leftDataSource,
      rightDataSource,
    };
  }

  renderTransfer = (transferLocale: TransferLocale) => (
    <ConfigConsumer>
      {({ getPrefixCls, renderEmpty, direction }: ConfigConsumerProps) => {
        const {
          prefixCls: customizePrefixCls,
          className,
          disabled,
          operations = [],
          showSearch,
          footer,
          style,
          listStyle,
          operationStyle,
          filterOption,
          render,
          children,
          showSelectAll,
        } = this.props;
        const prefixCls = getPrefixCls('transfer', customizePrefixCls);
        const locale = {
          ...transferLocale,
          notFoundContent: renderEmpty('Transfer'),
          ...this.props.locale,
        };
        const { sourceSelectedKeys, targetSelectedKeys } = this.state;

        const { leftDataSource, rightDataSource } = this.separateDataSource();
        const leftActive = targetSelectedKeys.length > 0;
        const rightActive = sourceSelectedKeys.length > 0;

        const cls = classNames(className, prefixCls, {
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-customize-list`]: !!children,
          [`${prefixCls}-rtl`]: direction === 'rtl',
        });

        const titles = this.props.titles || locale.titles;
        const selectAllLabels = this.props.selectAllLabels || [];
        return (
          <div className={cls} style={style}>
            <List
              prefixCls={`${prefixCls}-list`}
              titleText={titles[0]}
              dataSource={leftDataSource}
              filterOption={filterOption}
              style={this.handleListStyle(listStyle, 'left')}
              checkedKeys={sourceSelectedKeys}
              handleFilter={this.handleLeftFilter}
              handleClear={this.handleLeftClear}
              onItemSelect={this.onLeftItemSelect}
              onItemSelectAll={this.onLeftItemSelectAll}
              render={render}
              showSearch={showSearch}
              renderList={children}
              footer={footer}
              onScroll={this.handleLeftScroll}
              disabled={disabled}
              direction="left"
              showSelectAll={showSelectAll}
              selectAllLabel={selectAllLabels[0]}
              {...locale}
            />
            <Operation
              className={`${prefixCls}-operation`}
              rightActive={rightActive}
              rightArrowText={operations[0]}
              moveToRight={this.moveToRight}
              leftActive={leftActive}
              leftArrowText={operations[1]}
              moveToLeft={this.moveToLeft}
              style={operationStyle}
              disabled={disabled}
              direction={direction}
            />
            <List
              prefixCls={`${prefixCls}-list`}
              titleText={titles[1]}
              dataSource={rightDataSource}
              filterOption={filterOption}
              style={this.handleListStyle(listStyle, 'right')}
              checkedKeys={targetSelectedKeys}
              handleFilter={this.handleRightFilter}
              handleClear={this.handleRightClear}
              onItemSelect={this.onRightItemSelect}
              onItemSelectAll={this.onRightItemSelectAll}
              render={render}
              showSearch={showSearch}
              renderList={children}
              footer={footer}
              onScroll={this.handleRightScroll}
              disabled={disabled}
              direction="right"
              showSelectAll={showSelectAll}
              selectAllLabel={selectAllLabels[1]}
              {...locale}
            />
          </div>
        );
      }}
    </ConfigConsumer>
  );

  render() {
    return (
      <LocaleReceiver componentName="Transfer" defaultLocale={defaultLocale.Transfer}>
        {this.renderTransfer}
      </LocaleReceiver>
    );
  }
}

export default Transfer;
